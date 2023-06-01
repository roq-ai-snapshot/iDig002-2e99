import * as yup from 'yup';

export const userProjectValidationSchema = yup.object().shape({
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  user_id: yup.string().nullable().required(),
  project_id: yup.string().nullable().required(),
});
