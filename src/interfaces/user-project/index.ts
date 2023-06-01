import { UserInterface } from 'interfaces/user';
import { ProjectInterface } from 'interfaces/project';

export interface UserProjectInterface {
  id?: string;
  user_id: string;
  project_id: string;
  created_at?: Date;
  updated_at?: Date;

  user?: UserInterface;
  project?: ProjectInterface;
  _count?: {};
}
