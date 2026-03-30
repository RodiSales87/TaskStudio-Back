import { Prisma, Attachment } from '@prisma/client';
import prisma from '@database';

class FileRepository {
  async saveAttachmentMetaData(data: Prisma.AttachmentUncheckedCreateInput): Promise<Attachment> {
    const attachment = await prisma.attachment.create({ data });
    return attachment;
  }

  async findById(id: string): Promise<Attachment | null> {
    const attachment = await prisma.attachment.findUnique({ where: { id } });
    return attachment;
  }

  async deleteAttachmentMetaData(id: string): Promise<Attachment> {
    const attachment = await prisma.attachment.delete({ where: { id } });
    return attachment;
  }
}

export default new FileRepository();