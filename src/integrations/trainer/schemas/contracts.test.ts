import { describe, expect, it } from 'vitest';
import request from '../../../../examples/json/trainer-request.example.json';
import response from '../../../../examples/json/trainer-response.example.json';
import { TrainerRequestSchema } from './trainerRequest';
import { TrainerResponseSchema } from './trainerResponse';
describe('trainer contracts',()=>{it('accepts canonical trainer request fixture',()=>{expect(TrainerRequestSchema.safeParse(request).success).toBe(true);});it('accepts canonical trainer response fixture',()=>{expect(TrainerResponseSchema.safeParse(response).success).toBe(true);});});
