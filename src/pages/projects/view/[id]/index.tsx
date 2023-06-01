import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getProjectById } from 'apiSdk/projects';
import { Error } from 'components/error';
import { ProjectInterface } from 'interfaces/project';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteDocumentById } from 'apiSdk/documents';
import { deleteNoteById } from 'apiSdk/notes';
import { deleteUserProjectById } from 'apiSdk/user-projects';

function ProjectViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ProjectInterface>(
    () => (id ? `/projects/${id}` : null),
    () =>
      getProjectById(id, {
        relations: ['excavator', 'document', 'note', 'user_project'],
      }),
  );

  const documentHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteDocumentById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const noteHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteNoteById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const user_projectHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteUserProjectById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Project Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              name: {data?.name}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              location: {data?.location}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              soil_condition: {data?.soil_condition}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              outcome: {data?.outcome}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              created_at: {data?.created_at as unknown as string}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              updated_at: {data?.updated_at as unknown as string}
            </Text>
            {hasAccess('excavator', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                excavator: <Link href={`/excavators/view/${data?.excavator?.id}`}>{data?.excavator?.id}</Link>
              </Text>
            )}
            {hasAccess('document', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Document
                </Text>
                <Link href={`/documents/create?project_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4">
                    Create
                  </Button>
                </Link>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>id</Th>
                        <Th>name</Th>
                        <Th>file_path</Th>
                        <Th>created_at</Th>
                        <Th>updated_at</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.document?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.id}</Td>
                          <Td>{record.name}</Td>
                          <Td>{record.file_path}</Td>
                          <Td>{record.created_at as unknown as string}</Td>
                          <Td>{record.updated_at as unknown as string}</Td>
                          <Td>
                            <Button>
                              <Link href={`/documents/edit/${record.id}`}>Edit</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button>
                              <Link href={`/documents/view/${record.id}`}>View</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button onClick={() => documentHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('note', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Note
                </Text>
                <Link href={`/notes/create?project_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4">
                    Create
                  </Button>
                </Link>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>id</Th>
                        <Th>content</Th>
                        <Th>created_at</Th>
                        <Th>updated_at</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.note?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.id}</Td>
                          <Td>{record.content}</Td>
                          <Td>{record.created_at as unknown as string}</Td>
                          <Td>{record.updated_at as unknown as string}</Td>
                          <Td>
                            <Button>
                              <Link href={`/notes/edit/${record.id}`}>Edit</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button>
                              <Link href={`/notes/view/${record.id}`}>View</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button onClick={() => noteHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('user_project', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  User Project
                </Text>
                <Link href={`/user-projects/create?project_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4">
                    Create
                  </Button>
                </Link>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>id</Th>
                        <Th>created_at</Th>
                        <Th>updated_at</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.user_project?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.id}</Td>
                          <Td>{record.created_at as unknown as string}</Td>
                          <Td>{record.updated_at as unknown as string}</Td>
                          <Td>
                            <Button>
                              <Link href={`/user-projects/edit/${record.id}`}>Edit</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button>
                              <Link href={`/user-projects/view/${record.id}`}>View</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button onClick={() => user_projectHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'project',
  operation: AccessOperationEnum.READ,
})(ProjectViewPage);
