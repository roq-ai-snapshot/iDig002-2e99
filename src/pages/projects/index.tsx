import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getProjects, deleteProjectById } from 'apiSdk/projects';
import { ProjectInterface } from 'interfaces/project';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function ProjectListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<ProjectInterface[]>(
    () => '/projects',
    () =>
      getProjects({
        relations: ['excavator', 'document.count', 'note.count', 'user_project.count'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteProjectById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Project
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('project', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/projects/create`}>
            <Button colorScheme="blue" mr="4">
              Create
            </Button>
          </Link>
        )}
        {error && <Error error={error} />}
        {deleteError && <Error error={deleteError} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>id</Th>
                  <Th>name</Th>
                  <Th>location</Th>
                  <Th>soil_condition</Th>
                  <Th>outcome</Th>
                  <Th>created_at</Th>
                  <Th>updated_at</Th>
                  {hasAccess('excavator', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>excavator_id</Th>}
                  {hasAccess('document', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>document</Th>}
                  {hasAccess('note', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>note</Th>}
                  {hasAccess('user_project', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>user_project</Th>
                  )}
                  {hasAccess('project', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && <Th>Edit</Th>}
                  {hasAccess('project', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('project', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && <Th>Delete</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.id}</Td>
                    <Td>{record.name}</Td>
                    <Td>{record.location}</Td>
                    <Td>{record.soil_condition}</Td>
                    <Td>{record.outcome}</Td>
                    <Td>{record.created_at as unknown as string}</Td>
                    <Td>{record.updated_at as unknown as string}</Td>
                    {hasAccess('excavator', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/excavators/view/${record.excavator?.id}`}>{record.excavator?.id}</Link>
                      </Td>
                    )}
                    {hasAccess('document', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.document}</Td>
                    )}
                    {hasAccess('note', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.note}</Td>
                    )}
                    {hasAccess('user_project', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.user_project}</Td>
                    )}
                    {hasAccess('project', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/projects/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('project', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/projects/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('project', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Button onClick={() => handleDelete(record.id)}>Delete</Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'project',
  operation: AccessOperationEnum.READ,
})(ProjectListPage);
