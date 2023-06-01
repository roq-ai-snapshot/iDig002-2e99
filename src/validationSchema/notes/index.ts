import * as yup from 'yup';

export const noteValidationSchema = yup.object().shape({
  content: yup.string().required(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  project_id: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
});
