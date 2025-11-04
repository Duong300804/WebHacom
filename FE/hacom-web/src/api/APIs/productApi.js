import axiosClient from '../Common/axiosClient';
import api_constant from '../Common/apiConstants';

export const getAllProducts = async () => {
  const response = await axiosClient.get(api_constant.PRODUCT_API.GET_ALL_PRODUCT);
  return response.data;
};

export const searchProducts = async (keyword) => {
  const response = await axiosClient.get(`${api_constant.PRODUCT_API.SEARCH_PRODUCT}?keyword=${keyword}`);
  return response.data;
};

export const filterProducts = async (filterRequest) => {
  const response = await axiosClient.post(api_constant.PRODUCT_API.FILTER_PRODUCT, filterRequest);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await axiosClient.post(api_constant.PRODUCT_API.CREATE_PRODUCT, productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await axiosClient.put(`${api_constant.PRODUCT_API.UPDATE_PRODUCT.replace('{id}', id)}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axiosClient.delete(`${api_constant.PRODUCT_API.DELETE_PRODUCT.replace('{id}', id)}`);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axiosClient.get(`${api_constant.PRODUCT_API.GET_PRODUCT_BY_ID.replace('{id}', id)}`);
  return response.data;
};

export const getProductsSortedByPriceAsc = async () => {
  const response = await axiosClient.get(api_constant.PRODUCT_API.SORT_PRODUCT_BY_PRICE_ASC);
  return response.data;
};

export const getProductsSortedByPriceDesc = async () => {
  const response = await axiosClient.get(api_constant.PRODUCT_API.SORT_PRODUCT_BY_PRICE_DESC);
  return response.data;
};

export const getProductsSortedByNewest = async () => {
  const response = await axiosClient.get(api_constant.PRODUCT_API.SORT_PRODUCT_BY_NEWEST);
  return response.data;
};

export const countProductsByFilter = async (filterRequest) => {
  const response = await axiosClient.post(api_constant.PRODUCT_API.COUNT_PRODUCT_BY_FILTER, filterRequest);
  return response.data;
};