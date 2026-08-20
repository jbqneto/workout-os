# Trainer JSON Protocol v1

## Purpose

Make manual App <-> Trainer exchange cheap, deterministic and robust without paying for an API.

## Documents

### trainer-request

App -> trainer.

Purposes:

- `create_plan`
- `monthly_review_and_plan`
- `adjust_plan`
- `review_only`

The exporter should include only context relevant to the purpose.

### trainer-response

Trainer -> app.

Can contain:

- a `catalogPatch` containing **new canonical exercises only**;
- a new `trainingPlan`;
- a textual `review`.

The trainer cannot create environments or equipment. Those describe physical reality and are owned by the app/user. A response that references unknown equipment or an unknown environment fails semantic validation.

A catalog patch also cannot overwrite an existing exercise ID. Updating catalog records will require an explicit future protocol decision rather than being inferred from an ID collision.

### full-backup

App-only complete backup/restore format. It is not optimized as trainer context.

## Envelope

All documents include:

```json
{
  "schemaVersion": "1.0.0",
  "documentType": "trainer-request",
  "documentId": "req_2026_08_monthly_review",
  "createdAt": "2026-08-31T20:00:00Z",
  "payload": {}
}
```

## Contract rules

- JSON only; no Markdown fences.
- semantic IDs are canonical;
- unknown references fail semantic validation;
- display names do not resolve identity;
- trainer responses may add new exercises through `catalogPatch`;
- trainer responses may not invent equipment or environments;
- duplicate/colliding semantic IDs are rejected;
- workout variants reference prescriptions belonging to the same workout;
- import is all-or-nothing;
- app never interprets review text as executable progression logic.

## Validation pipeline

Trainer input is untrusted until all of these stages succeed:

1. JSON parse;
2. structural Zod validation;
3. supported schema-version check;
4. semantic validation against the current local catalog;
5. human-readable import preview;
6. explicit confirmation;
7. one SQLite transaction;
8. rollback on any failure.

## Trainer instruction embedded in request

The request contains a `responseContract` that tells the trainer which document and schema version to return and constrains invention of equipment/IDs.

`neverInventEquipment: true` is a hard protocol boundary, not a suggestion.

## Resistance

Resistance is polymorphic. Examples:

```json
{ "type": "weight", "value": 37.5, "unit": "kg" }
```

```json
{ "type": "bodyweight" }
```

```json
{ "type": "bodyweight", "additionalWeightKg": 10 }
```

```json
{ "type": "assisted_bodyweight", "assistanceKg": 20 }
```

```json
{ "type": "machine_level", "level": 7 }
```

Do not collapse all of these into `loadKg`.

## Source of truth

Runtime contracts under `src/integrations/trainer/schemas/` are the operational source of truth. Public Draft 2020-12 documents under `schemas/` are generated/export artifacts for humans and external agents.

Run:

```bash
npm run schema:export
```

whenever runtime contracts change.

## Versioning policy

- patch: validation/documentation clarification with unchanged semantics;
- minor: backward-compatible optional fields;
- major: breaking structure/meaning.

The importer must reject unsupported major versions clearly.

The `1.0.0` contract is not considered frozen until the product-owner review in TASK-011.
