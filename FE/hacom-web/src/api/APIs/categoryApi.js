import axiosClient from '../Common/axiosClient';
import api_constant from '../Common/apiConstants';

export const getAllCategories = async () => {
  const response = await axiosClient.get(api_constant.CATEGORY_API.GET_ALL_CATEGORY);
  return response.data;
};

export const searchCategories = async (keyword) => {
  const response = await axiosClient.get(`${api_constant.CATEGORY_API.SEARCH_CATEGORY}?keyword=${keyword}`);
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await axiosClient.post(api_constant.CATEGORY_API.CREATE_CATEGORY, categoryData);
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await axiosClient.put(`${api_constant.CATEGORY_API.UPDATE_CATEGORY.replace('{id}', id)}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axiosClient.delete(`${api_constant.CATEGORY_API.DELETE_CATEGORY.replace('{id}', id)}`);
  return response.data;
};

export const filterCategories = async (filterRequest) => {
  const response = await axiosClient.post(api_constant.CATEGORY_API.FILTER_CATEGORY, filterRequest);
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await axiosClient.get(`${api_constant.CATEGORY_API.GET_CATEGORY_BY_ID.replace('{id}', id)}`);
  return response.data;
};