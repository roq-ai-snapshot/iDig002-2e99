import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { userProjectValidationSchema } from 'validationSchema/user-projects';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  await prisma.user_project
    .withAuthorization({ userId: roqUserId })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getUserProjectById();
    case 'PUT':
      return updateUserProjectById();
    case 'DELETE':
      return deleteUserProjectById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getUserProjectById() {
    const data = await prisma.user_project.findFirst(convertQueryToPrismaUtil(req.query, 'user_project'));
    return res.status(200).json(data);
  }

  async function updateUserProjectById() {
    await userProjectValidationSchema.validate(req.body);
    const data = await prisma.user_project.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteUserProjectById() {
    const data = await prisma.user_project.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
