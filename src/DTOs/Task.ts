import { z } from 'zod';

export const Task = z.object({
  title: z.string({ required_error: 'O título é obrigatório' }),
  description: z.string().optional(),
  deadline: z.coerce.date().optional(),
  status: z.enum(['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA']).optional(),
});

export const UpdateTask = Task.partial();