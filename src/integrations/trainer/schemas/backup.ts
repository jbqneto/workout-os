import { z } from 'zod';
import { SCHEMA_VERSION } from './common';
export const FullBackupSchema=z.object({schemaVersion:z.literal(SCHEMA_VERSION),documentType:z.literal('full-backup'),documentId:z.string().min(1),createdAt:z.iso.datetime({offset:true}),databaseVersion:z.number().int().nonnegative(),payload:z.record(z.string(),z.array(z.record(z.string(),z.unknown())))}).strict();
export type FullBackup=z.infer<typeof FullBackupSchema>;
