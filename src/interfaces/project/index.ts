import { DocumentInterface } from 'interfaces/document';
import { NoteInterface } from 'interfaces/note';
import { UserProjectInterface } from 'interfaces/user-project';
import { ExcavatorInterface } from 'interfaces/excavator';

export interface ProjectInterface {
  id?: string;
  excavator_id: string;
  name: string;
  location: string;
  soil_condition: string;
  outcome?: string;
  created_at?: Date;
  updated_at?: Date;
  document?: DocumentInterface[];
  note?: NoteInterface[];
  user_project?: UserProjectInterface[];
  excavator?: ExcavatorInterface;
  _count?: {
    document?: number;
    note?: number;
    user_project?: number;
  };
}
