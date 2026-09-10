"""Validate planning artifacts; this does not evaluate the future application."""

import json
import re
from collections import Counter
from pathlib import Path


def main():
    root = Path(__file__).resolve().parents[1]
    backlog = json.loads((root / "planning/backlog.json").read_text())
    inventory = json.loads((root / "planning/data_inventory.json").read_text())
    report = (root / "docs/research.md").read_text()
    issues = backlog["issues"]
    by_id = {issue["id"]: issue for issue in issues}
    requirements = {f"REQ-{n:02d}" for n in range(1, 18)}
    assert len(by_id) == len(issues), "Duplicate issue ID"
    assert set(backlog["requirements"]) == requirements
    covered = set()
    hours = Counter()
    visited = set()

    def visit(issue_id, active):
        assert issue_id in by_id, f"Unknown dependency: {issue_id}"
        assert issue_id not in active, f"Dependency cycle: {issue_id}"
        if issue_id in visited:
            return
        for dependency in by_id[issue_id]["depends_on"]:
            visit(dependency, active | {issue_id})
        visited.add(issue_id)

    for issue in issues:
        assert 1 <= issue["week"] <= len(backlog["milestones"])
        assert issue["owner"] in {"Ильяс", "Ольга", "Нурали"}
        assert issue["hours"] > 0
        assert issue["title"] and issue["acceptance"] and issue["requirements"]
        assert set(issue["requirements"]) <= requirements
        visit(issue["id"], set())
        covered.update(issue["requirements"])
        hours[issue["owner"]] += issue["hours"]
    assert covered == requirements, "Uncovered requirement"

    expected = set(inventory["expected_regions"])
    organizer = inventory["organizer_source"]
    observed = {item["region"] for item in organizer["files"]}
    assert len(expected) == 20 and observed <= expected
    assert len(observed) == organizer["observed_regions"]
    assert len(organizer["files"]) == organizer["observed_csv_files"]
    assert organizer["csv_headers_verified"] <= organizer["observed_csv_files"]
    assert {item["region"] for item in inventory["datasets"]} == observed

    definitions = re.findall(r"^\[\^(\d+)\]:", report, re.MULTILINE)
    references = set(re.findall(r"\[\^(\d+)\](?!:)", report))
    assert len(definitions) == len(set(definitions)), "Duplicate source definition"
    assert references == set(definitions), "Missing or unused source note"
    for path in root.rglob("*"):
        if path.is_file() and ".git" not in path.parts and path.suffix in {".md", ".json", ".yml", ".py"}:
            assert len(path.read_text().splitlines()) < 500, f"File too long: {path}"
    print(f"PASS: {len(issues)} tasks, {len(backlog['milestones'])} stages, {len(covered)} requirements; dependency DAG valid")
    print(f"Hours: {sum(hours.values())}; by owner: {dict(hours)}")
    print(f"Data: {len(observed)}/20 regions listed, {organizer['csv_headers_verified']} organizer CSV headers checked; full audit pending")
    print(f"Sources: {len(definitions)} reference groups linked; no app/ML test claimed")


if __name__ == "__main__":
    main()
