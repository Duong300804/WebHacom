import axiosClient from '../Common/axiosClient';
import api_constant from '../Common/apiConstants';

export const getAllTags = async () => {
  const response = await axiosClient.get(api_constant.TAG_API.GET_ALL_TAG);
  return response.data;
};

export const searchTags = async (keyword) => {
  const response = await axiosClient.get(`${api_constant.TAG_API.SEARCH_TAG}?keyword=${keyword}`);
  return response.data;
};

export const createTag = async (tagData) => {
  const response = await axiosClient.post(api_constant.TAG_API.CREATE_TAG, tagData);
  return response.data;
};

export const updateTag = async (id, tagData) => {
  const response = await axiosClient.put(`${api_constant.TAG_API.UPDATE_TAG.replace(':id', id)}`, tagData);
  return response.data;
};

export const deleteTag = async (id) => {
  const response = await axiosClient.delete(`${api_constant.TAG_API.DELETE_TAG.replace(':id', id)}`);
  return response.data;
};

export const getTagById = async (id) => {
  const response = await axiosClient.get(`${api_constant.TAG_API.GET_TAG_BY_ID.replace(':id', id)}`);
  return response.data;
};