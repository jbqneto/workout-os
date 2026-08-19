# Architecture

## Context

This is a single-user local-first mobile application. Complexity should live where it protects data/behavior: domain boundaries, migrations, JSON imports and session persistence. Avoid enterprise ceremony elsewhere.

## Container view

```text
┌─────────────────────────────── Android App ───────────────────────────────┐
│                                                                          │
│ Expo Router / React Native UI                                            │
│               │                                                          │
│               ▼                                                          │
│ Feature use cases                                                        │
│               │                                                          │
│               ▼                                                          │
│ Domain models / invariants                                               │
│          │                 │                                             │
│          ▼                 ▼                                             │
│ SQLite infrastructure   Trainer JSON boundary                            │
│          │                 │                                             │
│          ▼                 ▼                                             │
│ local database        local files / Android share sheet                  │
└──────────────────────────────────────────────────────────────────────────┘
                              │ manual
                              ▼
                   External trainer / ChatGPT
```

## Why no backend

The current product has no cross-device or multi-user requirement. A backend would add auth, networking, availability, migrations and operational ownership without solving a current need.

## Why no ORM initially

The schema is relational but compact. Direct SQLite keeps migrations transparent and avoids binding domain design to an ORM. Re-evaluate only if query/mapping boilerplate becomes a measurable problem.

## Route layer

`app/` should contain only route wrappers and navigation layouts. Screens live under `src/features`.

This protects feature code from file-system routing conventions and keeps tests/imports simple.

## Domain layer

Pure TypeScript. It owns types and concepts but not persistence concerns.

## Persistence

SQLite is the durable source of truth.

Key practices:

- foreign keys ON;
- WAL journal mode;
- migrations tracked explicitly;
- semantic string IDs at domain boundaries;
- JSON only for fields whose internal shape is intentionally polymorphic (e.g. resistance), not as a replacement for relational modeling.

## Plan immutability/history

A new cycle becomes a new plan. Do not mutate historical plan meaning after sessions were executed.

Display metadata may be corrected carefully, but the records required to interpret historical execution must remain stable.

## Rest timer architecture

State:

```ts
{
  exerciseSessionId,
  sourceExerciseId,
  startedAt,
  endsAt,
  scheduledNotificationId
}
```

UI derives remaining seconds from `endsAt`.

This is robust to JS timer throttling/backgrounding. Local notification is scheduled separately.

## Trainer protocol

Transport is manual files today. The protocol should not care.

Future MCP/API transport should be able to reuse the same logical request/response documents rather than inventing a second domain contract.
