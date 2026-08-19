# ADR-0001: Local-first SQLite persistence

Status: Accepted

## Decision

Use `expo-sqlite` as the only durable database in v1.

## Rationale

The product is single-user, offline-first and currently needs no synchronization. SQLite provides relational integrity for plans/sessions/catalog while keeping ownership local.

## Consequences

- explicit migrations required;
- backup/export is our responsibility;
- no auth/network complexity;
- future sync, if ever added, must respect local history IDs and migrations.
