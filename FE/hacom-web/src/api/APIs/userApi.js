import axiosClient from '../Common/axiosClient';
import api_constant from '../Common/apiConstants';

export const getAllUsers = async () => {
  const response = await axiosClient.get(api_constant.USER_API.GET_All_USER);
  return response.data;
};

export const getAllAccount = async () => {
  const response = await axiosClient.get(api_constant.USER_API.GET_ALL_ACCOUNT);
  return response.data;
};

export const searchUsers = async (keyword) => {
  const response = await axiosClient.get(`${api_constant.USER_API.SEARCH_USER}?keyword=${keyword}`);
  return response.data;
};

export const searchAccount = async (keyword) => {
  const response = await axiosClient.get(`${api_constant.USER_API.SEARCH_ACCOUNT}?keyword=${keyword}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axiosClient.post(api_constant.USER_API.CREATE_USER, userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await axiosClient.put(`${api_constant.USER_API.UPDATE_USER.replace(':id', id)}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosClient.delete(`${api_constant.USER_API.DELETE_USER.replace(':id', id)}`);
  return response.data;
};

export const filterUsers = async (role) => {
  const filterRequest = { role };
  const response = await axiosClient.post(api_constant.USER_API.FILTER_USER, filterRequest);
  return response.data;
};

export const filterAccount = async (role) => {
  const filterRequest = { role };
  const response = await axiosClient.post(api_constant.USER_API.FILTER_ACCOUNT, filterRequest);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axiosClient.get(`${api_constant.USER_API.GET_USER_BY_ID.replace(':id', id)}`);
  return response.data;
};