import * as yup from 'yup';
import { projectValidationSchema } from 'validationSchema/projects';

export const excavatorValidationSchema = yup.object().shape({
  name: yup.string().required(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  owner_id: yup.string().nullable().required(),
  project: yup.array().of(projectValidationSchema),
});
