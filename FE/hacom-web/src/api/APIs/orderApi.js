import axiosClient from '../Common/axiosClient';
import api_constant from '../Common/apiConstants';

export const getAllOrders = async () => {
  const response = await axiosClient.get(api_constant.ORDER_API.GET_ALL_ORDER);
  return response.data;
};
export const getMyOrders = async () => {
  const response = await axiosClient.get(api_constant.ORDER_API.GET_MY_ORDERS);
  return response.data;
};

export const searchOrders = async (keyword) => {
  const response = await axiosClient.get(`${api_constant.ORDER_API.SEARCH_ORDER}?keyword=${keyword}`);
  return response.data;
};

export const filterOrders = async (filterRequest) => {
  const response = await axiosClient.post(api_constant.ORDER_API.FILTER_ORDER, filterRequest);
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await axiosClient.get(`${api_constant.ORDER_API.GET_ORDER_BY_ID.replace('{id}', id)}`);
  return response.data;
};

export const updateOrder = async (id, updateRequest) => {
  const response = await axiosClient.put(`${api_constant.ORDER_API.UPDATE_ORDER.replace('{id}', id)}`, updateRequest);
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await axiosClient.delete(`${api_constant.ORDER_API.DELETE_ORDER.replace('{id}', id)}`);
  return response.data;
};

export const cancelOrder = async (id) => {
  const response = await axiosClient.put(`${api_constant.ORDER_API.CANCEL_ORDER.replace('{id}', id)}`);
  return response.data;
};

export const createOrder = async (orderRequest) => {
  const response = await axiosClient.post(api_constant.ORDER_API.CREATE_ORDER, orderRequest);
  return response.data;
};

export const trackOrder = async (trackingRequest) => {
  const response = await axiosClient.post(api_constant.ORDER_API.TRACK_ORDER, trackingRequest);
  return response.data;
};