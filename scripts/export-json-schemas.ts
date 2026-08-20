import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';
import { FullBackupSchema, TrainerRequestSchema, TrainerResponseSchema } from '../src/integrations/trainer/schemas';

const outputs = [
  ['trainer-request.schema.json', 'Workout OS Trainer Request 1.0.0', 'trainer-request-1.0.0', TrainerRequestSchema],
  ['trainer-response.schema.json', 'Workout OS Trainer Response 1.0.0', 'trainer-response-1.0.0', TrainerResponseSchema],
  ['full-backup.schema.json', 'Workout OS Full Backup 1.0.0', 'full-backup-1.0.0', FullBackupSchema],
] as const;

mkdirSync(resolve('schemas'), { recursive: true });

for (const [filename, title, id, schema] of outputs) {
  const generated = z.toJSONSchema(schema, { target: 'draft-2020-12' });
  const jsonSchema = {
    ...generated,
    $id: `https://workout-os.local/schemas/${id}.json`,
    title,
  };
  writeFileSync(resolve('schemas', filename), `${JSON.stringify(jsonSchema, null, 2)}\n`);
  console.log(`wrote schemas/${filename}`);
}
