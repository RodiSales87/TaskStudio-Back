import { Request, Response, NextFunction } from 'express';
import TaskRepository from '../repositories/TaskRepository';
import { Task, UpdateTask } from '../DTOs/Task';
import { Prisma } from '@prisma/client';

class TaskController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const taskData = Task.parse(req.body);
      
      // Quando cria uma task, injetamos automaticamente quem foi o autor!
      const userId = req.user!.id; 

      const task = await TaskRepository.create({
        ...taskData,
        creatorId: userId,
      });

      res.locals = {
        status: 201,
        message: 'Task criada com sucesso!',
        data: task,
      };

      return next();
    } catch (error) {
      return next(error);
    }
  }

  async readAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId, role } = req.user!;
      
      // Se for ADMIN, o Prisma pega tudo. Se for USER, apenas as com seu creatorId
      const filter: Prisma.TaskWhereInput = role === 'ADMIN' ? {} : { creatorId: userId };

      const tasks = await TaskRepository.findMany(filter);

      res.locals = {
        status: 200,
        data: tasks,
      };

      return next();
    } catch (error) {
      return next(error);
    }
  }

  async read(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const { id: userId, role } = req.user!;

      const task = await TaskRepository.findById(taskId);

      if (!task) {
        return next({ status: 404, message: 'Task não encontrada' });
      }

      // Impedir um USER de ver a tarefa do coleguinha
      if (role === 'USER' && task.creatorId !== userId) {
        return next({ status: 403, message: 'Acesso negado. Esta task não pertence a você.' });
      }

      res.locals = {
        status: 200,
        data: task,
      };

      return next();
    } catch (error) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const { id: userId, role } = req.user!;
      const taskData = UpdateTask.parse(req.body);

      const taskExists = await TaskRepository.findById(taskId);

      if (!taskExists) {
        return next({ status: 404, message: 'Task não encontrada' });
      }

      // Impedir atualização se for USER e a task for de outro
      if (role === 'USER' && taskExists.creatorId !== userId) {
        return next({ status: 403, message: 'Acesso negado.' });
      }

      const updatedTask = await TaskRepository.update(taskId, taskData);

      res.locals = {
        status: 200,
        data: updatedTask,
        message: 'Task atualizada!',
      };

      return next();
    } catch (error) {
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const { id: userId, role } = req.user!;

      const taskExists = await TaskRepository.findById(taskId);

      if (!taskExists) {
        return next({ status: 404, message: 'Task não encontrada' });
      }

      // Impedir deleção por curiosos
      if (role === 'USER' && taskExists.creatorId !== userId) {
        return next({ status: 403, message: 'Acesso negado.' });
      }

      await TaskRepository.delete(taskId);

      res.locals = {
        status: 200,
        message: 'Task deletada com sucesso',
      };

      return next();
    } catch (error) {
      return next(error);
    }
  }
}

export default new TaskController();