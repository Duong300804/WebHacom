import axiosClient from '../Common/axiosClient';
import api_constant from '../Common/apiConstants';

export const getAllBanners = async () => {
  const response = await axiosClient.get(api_constant.BANNER_API.GET_ALL_BANNER);
  return response.data;
};

export const getBannerById = async (id) => {
  const response = await axiosClient.get(`${api_constant.BANNER_API.GET_BANNER_BY_ID.replace('{id}', id)}`);
  return response.data;
};

export const createBanner = async (bannerData) => {
  const response = await axiosClient.post(api_constant.BANNER_API.CREATE_BANNER, bannerData);
  return response.data;
};

export const updateBanner = async (id, bannerData) => {
  const response = await axiosClient.put(`${api_constant.BANNER_API.UPDATE_BANNER.replace('{id}', id)}`, bannerData);
  return response.data;
};

export const deleteBanner = async (id) => {
  const response = await axiosClient.delete(`${api_constant.BANNER_API.DELETE_BANNER.replace('{id}', id)}`);
  return response.data;
};

export const searchBanners = async (keyword) => {
  const response = await axiosClient.get(`${api_constant.BANNER_API.SEARCH_BANNER}?keyword=${keyword}`);
  return response.data;
};

export const filterBanners = async (filterRequest) => {
  const response = await axiosClient.post(api_constant.BANNER_API.FILTER_BANNER, filterRequest);
  return response.data;
};