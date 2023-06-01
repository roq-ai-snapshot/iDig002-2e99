import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { excavatorValidationSchema } from 'validationSchema/excavators';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  await prisma.excavator
    .withAuthorization({ userId: roqUserId })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getExcavatorById();
    case 'PUT':
      return updateExcavatorById();
    case 'DELETE':
      return deleteExcavatorById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getExcavatorById() {
    const data = await prisma.excavator.findFirst(convertQueryToPrismaUtil(req.query, 'excavator'));
    return res.status(200).json(data);
  }

  async function updateExcavatorById() {
    await excavatorValidationSchema.validate(req.body);
    const data = await prisma.excavator.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteExcavatorById() {
    const data = await prisma.excavator.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
