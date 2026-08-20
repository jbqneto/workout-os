import { migration001 } from './001_initial';
import { migration002 } from './002_integrity_hardening';

export const migrations = [migration001, migration002] as const;
