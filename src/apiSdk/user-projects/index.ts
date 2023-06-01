import axios from 'axios';
import queryString from 'query-string';
import { UserProjectInterface } from 'interfaces/user-project';
import { GetQueryInterface } from '../../interfaces';

export const getUserProjects = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/user-projects${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createUserProject = async (userProject: UserProjectInterface) => {
  const response = await axios.post('/api/user-projects', userProject);
  return response.data;
};

export const updateUserProjectById = async (id: string, userProject: UserProjectInterface) => {
  const response = await axios.put(`/api/user-projects/${id}`, userProject);
  return response.data;
};

export const getUserProjectById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/user-projects/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteUserProjectById = async (id: string) => {
  const response = await axios.delete(`/api/user-projects/${id}`);
  return response.data;
};
