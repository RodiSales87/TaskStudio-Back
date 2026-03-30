// Caminho do arquivo: src/repositories/TaskRepository.ts
import { Prisma, Task } from '@prisma/client';
import prisma from '@database';

class TaskRepository {
  async create(data: Prisma.TaskUncheckedCreateInput): Promise<Task> {
    const task = await prisma.task.create({ data });
    return task;
  }

  async findById(id: string): Promise<Task | null> {
    const task = await prisma.task.findUnique({ 
      where: { id },
      include: { attachments: true } // <- Isso faz as Tasks virem com os anexos na consulta única
    });
    return task as Task;
  }

  async findMany(whereFilter: Prisma.TaskWhereInput): Promise<Task[]> {
    const tasks = await prisma.task.findMany({ 
      where: whereFilter,
      include: { attachments: true } // <- Isso faz as Tasks virem com os anexos na consulta geral
    });
    return tasks as Task[];
  }

  async update(id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
    const task = await prisma.task.update({ where: { id }, data });
    return task;
  }

  async delete(id: string): Promise<Task> {
    const task = await prisma.task.delete({ where: { id } });
    return task;
  }
}

export default new TaskRepository();
