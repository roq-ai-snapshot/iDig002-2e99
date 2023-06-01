import * as yup from 'yup';
import { documentValidationSchema } from 'validationSchema/documents';
import { noteValidationSchema } from 'validationSchema/notes';
import { userProjectValidationSchema } from 'validationSchema/user-projects';

export const projectValidationSchema = yup.object().shape({
  name: yup.string().required(),
  location: yup.string().required(),
  soil_condition: yup.string().required(),
  outcome: yup.string(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  excavator_id: yup.string().nullable().required(),
  document: yup.array().of(documentValidationSchema),
  note: yup.array().of(noteValidationSchema),
  user_project: yup.array().of(userProjectValidationSchema),
});
