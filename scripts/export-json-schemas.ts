import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';
import { FullBackupSchema, TrainerRequestSchema, TrainerResponseSchema } from '../src/integrations/trainer/schemas';

const outputs = [
  ['trainer-request.schema.json', TrainerRequestSchema],
  ['trainer-response.schema.json', TrainerResponseSchema],
  ['full-backup.schema.json', FullBackupSchema],
] as const;

for (const [filename, schema] of outputs) {
  const jsonSchema = z.toJSONSchema(schema, { target: 'draft-2020-12' });
  writeFileSync(resolve('schemas', filename), `${JSON.stringify(jsonSchema, null, 2)}\n`);
  console.log(`wrote schemas/${filename}`);
}
