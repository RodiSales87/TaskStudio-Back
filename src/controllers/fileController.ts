import { NextFunction, Request, Response } from 'express';
import FileRepository from '../repositories/fileRepository';
import TaskRepository from '../repositories/TaskRepository';

export class FileController {
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const { id: userId, role } = req.user!; // Pega o token

      if (!req.file) {
        return next({ status: 400, message: 'Nenhum arquivo anexado.' });
      }

      // Verifica se a task existe e se o usuário tem permissão
      const task = await TaskRepository.findById(taskId);
      if (!task) {
        return next({ status: 404, message: 'Task não encontrada' });
      }
      if (role === 'USER' && task.creatorId !== userId) {
        return next({ status: 403, message: 'Acesso negado. A task não é sua.' });
      }

      const fileUrl = `/uploads/${req.file.filename}`;

      // Salva bd
      const attachment = await FileRepository.saveAttachmentMetaData({
        filename: req.file.originalname,
        url: fileUrl,
        taskId: task.id
      });

      res.locals = {
        status: 201,
        message: 'Arquivo anexado com sucesso à Tarefa!',
        data: attachment,
      };

      return next();
    } catch (err) {
      return next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { attachmentId } = req.params;
      const { id: userId, role } = req.user!;

      // 1. Procurar o anexo
      const attachment = await FileRepository.findById(attachmentId);
      if (!attachment) {
        return next({ status: 404, message: 'Anexo não encontrado.' });
      }

      // 2. Segurança: Só deleta se a Task dona daquele anexo pertence àquele usuário (ou se for ADMIN)
      const task = await TaskRepository.findById(attachment.taskId);
      if (!task) {
         return next({ status: 404, message: 'Task dona do anexo não encontrada.' });
      }
      if (role === 'USER' && task.creatorId !== userId) {
        return next({ status: 403, message: 'Acesso negado. A task não é sua.' });
      }

      // 3. Deleta o registro do banco
      await FileRepository.deleteAttachmentMetaData(attachment.id);

      // 4. Deleta o arquivo FISICAMENTE do projeto
      const fs = require('fs');
      const path = require('path');
      
      // Converte '/uploads/nome-do-arquivo' -> 'C:\...\TaskStudio\uploads\nome-do-arquivo'
      const filePath = path.join(__dirname, '..', '..', attachment.url);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Exclui o arquivo!
      }

      res.locals = {
        status: 200,
        message: 'Anexo removido do banco e arquivo deletado com sucesso.',
      };

      return next();
    } catch (err) {
      return next(err);
    }
  }

}

export default new FileController();