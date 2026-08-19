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

- a `catalogPatch` for new canonical exercises/equipment;
- a new `trainingPlan`;
- a textual `review`.

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
- response may add missing catalog records through `catalogPatch`;
- import is all-or-nothing;
- app never interprets review text as executable progression logic.

## Trainer instruction embedded in request

The request contains a `responseContract` that tells the trainer which document and schema version to return and constrains invention of equipment/IDs.

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

## Versioning policy

- patch: validation/documentation clarification with unchanged semantics;
- minor: backward-compatible optional fields;
- major: breaking structure/meaning.

The importer must reject unsupported major versions clearly.
