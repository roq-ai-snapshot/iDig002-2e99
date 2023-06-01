import * as yup from 'yup';

export const documentValidationSchema = yup.object().shape({
  name: yup.string().required(),
  file_path: yup.string().required(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  project_id: yup.string().nullable().required(),
});
