import { Router } from 'express';
import auth from '../middlewares/auth';
import { TaskController } from '../controllers';

const taskRouter = Router();

// middleware interceptando todas as requisições de task
taskRouter.route('/')
  .post([auth], TaskController.create)
  .get([auth], TaskController.readAll);

taskRouter.route('/:taskId')
  .get([auth], TaskController.read)
  .patch([auth], TaskController.update)
  .delete([auth], TaskController.delete);

export default taskRouter;