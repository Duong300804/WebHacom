import axiosClient from '../Common/axiosClient';
import api_constant from '../Common/apiConstants';

export const getAllStaff = async () => {
  const response = await axiosClient.get(api_constant.STAFF_API.GET_ALL_STAFF);
  return response.data;
};

export const searchStaff = async (keyword) => {
  const response = await axiosClient.get(`${api_constant.STAFF_API.SEARCH_STAFF}?keyword=${keyword}`);
  return response.data;
};

export const filterStaff = async (position) => {
  const filterRequest = { position };
  const response = await axiosClient.post(api_constant.STAFF_API.FILTER_STAFF, filterRequest);
  return response.data;
};

export const createStaff = async (staffData) => {
  const response = await axiosClient.post(api_constant.STAFF_API.CREATE_STAFF, staffData);
  return response.data;
};

export const updateStaff = async (id, staffData) => {
  const response = await axiosClient.put(`${api_constant.STAFF_API.UPDATE_STAFF.replace(':id', id)}`, staffData);
  return response.data;
};

export const deleteStaff = async (id) => {
  const response = await axiosClient.delete(`${api_constant.STAFF_API.DELETE_STAFF.replace(':id', id)}`);
  return response.data;
};

export const getStaffById = async (id) => {
  const response = await axiosClient.get(`${api_constant.STAFF_API.GET_STAFF_BY_ID.replace(':id', id)}`);
  return response.data;
};