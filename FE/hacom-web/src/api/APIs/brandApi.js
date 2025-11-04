import axiosClient from '../Common/axiosClient';
import api_constant from '../Common/apiConstants';

export const getAllBrands = async () => {
  const response = await axiosClient.get(api_constant.BRAND_API.GET_ALL_BRAND);
  return response.data;
};

export const searchBrands = async (keyword) => {
  const response = await axiosClient.get(`${api_constant.BRAND_API.SEARCH_BRAND}?keyword=${keyword}`);
  return response.data;
};

export const createBrand = async (brandData) => {
  const response = await axiosClient.post(api_constant.BRAND_API.CREATE_BRAND, brandData);
  return response.data;
};

export const updateBrand = async (id, brandData) => {
  const response = await axiosClient.put(`${api_constant.BRAND_API.UPDATE_BRAND.replace(':id', id)}`, brandData);
  return response.data;
};

export const deleteBrand = async (id) => {
  const response = await axiosClient.delete(`${api_constant.BRAND_API.DELETE_BRAND.replace(':id', id)}`);
  return response.data;
};

export const getBrandById = async (id) => {
  const response = await axiosClient.get(`${api_constant.BRAND_API.GET_BRAND_BY_ID.replace(':id', id)}`);
  return response.data;
};