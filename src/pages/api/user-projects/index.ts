import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { userProjectValidationSchema } from 'validationSchema/user-projects';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getUserProjects();
    case 'POST':
      return createUserProject();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getUserProjects() {
    const data = await prisma.user_project
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'user_project'));
    return res.status(200).json(data);
  }

  async function createUserProject() {
    await userProjectValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.user_project.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
