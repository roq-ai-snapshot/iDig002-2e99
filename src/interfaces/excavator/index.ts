import { ProjectInterface } from 'interfaces/project';
import { UserInterface } from 'interfaces/user';

export interface ExcavatorInterface {
  id?: string;
  name: string;
  owner_id: string;
  created_at?: Date;
  updated_at?: Date;
  project?: ProjectInterface[];
  user?: UserInterface;
  _count?: {
    project?: number;
  };
}
