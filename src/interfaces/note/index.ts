import { ProjectInterface } from 'interfaces/project';
import { UserInterface } from 'interfaces/user';

export interface NoteInterface {
  id?: string;
  project_id: string;
  user_id: string;
  content: string;
  created_at?: Date;
  updated_at?: Date;

  project?: ProjectInterface;
  user?: UserInterface;
  _count?: {};
}
