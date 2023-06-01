import { ProjectInterface } from 'interfaces/project';

export interface DocumentInterface {
  id?: string;
  project_id: string;
  name: string;
  file_path: string;
  created_at?: Date;
  updated_at?: Date;

  project?: ProjectInterface;
  _count?: {};
}
