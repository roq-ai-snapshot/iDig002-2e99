import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { projectValidationSchema } from 'validationSchema/projects';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getProjects();
    case 'POST':
      return createProject();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getProjects() {
    const data = await prisma.project
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'project'));
    return res.status(200).json(data);
  }

  async function createProject() {
    await projectValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.document?.length > 0) {
      const create_document = body.document;
      body.document = {
        create: create_document,
      };
    } else {
      delete body.document;
    }
    if (body?.note?.length > 0) {
      const create_note = body.note;
      body.note = {
        create: create_note,
      };
    } else {
      delete body.note;
    }
    if (body?.user_project?.length > 0) {
      const create_user_project = body.user_project;
      body.user_project = {
        create: create_user_project,
      };
    } else {
      delete body.user_project;
    }
    const data = await prisma.project.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
