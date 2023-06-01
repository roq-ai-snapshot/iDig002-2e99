import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createUserProject } from 'apiSdk/user-projects';
import { Error } from 'components/error';
import { userProjectValidationSchema } from 'validationSchema/user-projects';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { ProjectInterface } from 'interfaces/project';
import { getUsers } from 'apiSdk/users';
import { getProjects } from 'apiSdk/projects';
import { UserProjectInterface } from 'interfaces/user-project';

function UserProjectCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: UserProjectInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createUserProject(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<UserProjectInterface>({
    initialValues: {
      created_at: new Date(new Date().toDateString()),
      updated_at: new Date(new Date().toDateString()),
      user_id: (router.query.user_id as string) ?? null,
      project_id: (router.query.project_id as string) ?? null,
    },
    validationSchema: userProjectValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create User Project
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="created_at" mb="4">
            <FormLabel>created_at</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.created_at}
              onChange={(value: Date) => formik.setFieldValue('created_at', value)}
            />
          </FormControl>
          <FormControl id="updated_at" mb="4">
            <FormLabel>updated_at</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.updated_at}
              onChange={(value: Date) => formik.setFieldValue('updated_at', value)}
            />
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'user_id'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.id}
              </option>
            )}
          />
          <AsyncSelect<ProjectInterface>
            formik={formik}
            name={'project_id'}
            label={'project_id'}
            placeholder={'Select Project'}
            fetcher={getProjects}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.id}
              </option>
            )}
          />
          <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'user_project',
  operation: AccessOperationEnum.CREATE,
})(UserProjectCreatePage);
