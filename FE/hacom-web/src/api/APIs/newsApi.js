import axiosClient from '../Common/axiosClient';
import api_constant from '../Common/apiConstants';

export const getAllNews = async () => {
  const response = await axiosClient.get(api_constant.NEWS_API.GET_ALL_NEWS);
  return response.data;
};

export const getNewsById = async (id) => {
  const response = await axiosClient.get(api_constant.NEWS_API.GET_NEWS_BY_ID.replace('{id}', id));
  return response.data;
};

export const createNews = async (newsData) => {
  const response = await axiosClient.post(api_constant.NEWS_API.CREATE_NEWS, newsData);
  return response.data;
};

export const updateNews = async (id, newsData) => {
  const response = await axiosClient.put(api_constant.NEWS_API.UPDATE_NEWS.replace('{id}', id), newsData);
  return response.data;
};

export const deleteNews = async (id) => {
  const response = await axiosClient.delete(api_constant.NEWS_API.DELETE_NEWS.replace('{id}', id));
  return response.data;
};

export const searchNews = async (keyword) => {
  const response = await axiosClient.get(`${api_constant.NEWS_API.SEARCH_NEWS}?keyword=${keyword}`);
  return response.data;
};

export const filterNews = async (filterRequest) => {
  const response = await axiosClient.post(api_constant.NEWS_API.FILTER_NEWS, filterRequest);
  return response.data;
};