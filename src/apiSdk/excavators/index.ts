import axios from 'axios';
import queryString from 'query-string';
import { ExcavatorInterface } from 'interfaces/excavator';
import { GetQueryInterface } from '../../interfaces';

export const getExcavators = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/excavators${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createExcavator = async (excavator: ExcavatorInterface) => {
  const response = await axios.post('/api/excavators', excavator);
  return response.data;
};

export const updateExcavatorById = async (id: string, excavator: ExcavatorInterface) => {
  const response = await axios.put(`/api/excavators/${id}`, excavator);
  return response.data;
};

export const getExcavatorById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/excavators/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteExcavatorById = async (id: string) => {
  const response = await axios.delete(`/api/excavators/${id}`);
  return response.data;
};
