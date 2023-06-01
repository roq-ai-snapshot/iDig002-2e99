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
import { createProject } from 'apiSdk/projects';
import { Error } from 'components/error';
import { projectValidationSchema } from 'validationSchema/projects';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ExcavatorInterface } from 'interfaces/excavator';
import { getUsers } from 'apiSdk/users';
import { UserInterface } from 'interfaces/user';
import { getExcavators } from 'apiSdk/excavators';
import { ProjectInterface } from 'interfaces/project';

function ProjectCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ProjectInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createProject(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ProjectInterface>({
    initialValues: {
      name: '',
      location: '',
      soil_condition: '',
      outcome: '',
      created_at: new Date(new Date().toDateString()),
      updated_at: new Date(new Date().toDateString()),
      excavator_id: (router.query.excavator_id as string) ?? null,
      document: [],
      note: [],
      user_project: [],
    },
    validationSchema: projectValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Project
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="location" mb="4" isInvalid={!!formik.errors?.location}>
            <FormLabel>location</FormLabel>
            <Input type="text" name="location" value={formik.values?.location} onChange={formik.handleChange} />
            {formik.errors.location && <FormErrorMessage>{formik.errors?.location}</FormErrorMessage>}
          </FormControl>
          <FormControl id="soil_condition" mb="4" isInvalid={!!formik.errors?.soil_condition}>
            <FormLabel>soil_condition</FormLabel>
            <Input
              type="text"
              name="soil_condition"
              value={formik.values?.soil_condition}
              onChange={formik.handleChange}
            />
            {formik.errors.soil_condition && <FormErrorMessage>{formik.errors?.soil_condition}</FormErrorMessage>}
          </FormControl>
          <FormControl id="outcome" mb="4" isInvalid={!!formik.errors?.outcome}>
            <FormLabel>outcome</FormLabel>
            <Input type="text" name="outcome" value={formik.values?.outcome} onChange={formik.handleChange} />
            {formik.errors.outcome && <FormErrorMessage>{formik.errors?.outcome}</FormErrorMessage>}
          </FormControl>
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
          <AsyncSelect<ExcavatorInterface>
            formik={formik}
            name={'excavator_id'}
            label={'excavator_id'}
            placeholder={'Select Excavator'}
            fetcher={getExcavators}
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
  entity: 'project',
  operation: AccessOperationEnum.CREATE,
})(ProjectCreatePage);
