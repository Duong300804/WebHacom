import axiosClient from '../Common/axiosClient';
import api_constant from '../Common/apiConstants';

export const getTotalProducts = async () => {
  const response = await axiosClient.get(api_constant.DASHBOARD_API.GET_TOTAL_PRODUCTS);
  return response.data;
};

export const getTotalRevenue = async () => {
  const response = await axiosClient.get(api_constant.DASHBOARD_API.GET_TOTAL_REVENUE);
  return response.data;
};

export const getTotalOrders = async () => {
  const response = await axiosClient.get(api_constant.DASHBOARD_API.GET_TOTAL_ORDERS);
  return response.data;
};

export const getTotalCustomers = async () => {
  const response = await axiosClient.get(api_constant.DASHBOARD_API.GET_TOTAL_CUSTOMERS);
  return response.data;
};

export const getRevenueByMonth = async () => {
  const response = await axiosClient.get(api_constant.DASHBOARD_API.GET_REVENUE_BY_MONTH);
  return response.data;
};

export const getRevenueByCategory = async () => {
  const response = await axiosClient.get(api_constant.DASHBOARD_API.GET_REVENUE_BY_CATEGORY);
  return response.data;
};

export const getRecentOrders = async () => {
  const response = await axiosClient.get(api_constant.DASHBOARD_API.GET_RECENT_ORDERS);
  return response.data;
};

export const getRecentProducts = async () => {
  const response = await axiosClient.get(api_constant.DASHBOARD_API.GET_RECENT_PRODUCTS);
  return response.data;
};

export const getTopProducts = async () => {
  const response = await axiosClient.get(api_constant.DASHBOARD_API.GET_TOP_PRODUCTS);
  return response.data;
};

export const getRecentCustomers = async () => {
  const response = await axiosClient.get(api_constant.DASHBOARD_API.GET_RECENT_CUSTOMERS);
  return response.data;
};