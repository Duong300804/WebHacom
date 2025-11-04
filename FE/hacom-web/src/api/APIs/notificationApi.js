import axiosClient from '../Common/axiosClient';
import api_constant from '../Common/apiConstants';

export const getAllNotifications = async () => {
  const response = await axiosClient.get(api_constant.NOTIFICATION_API.GET_ALL_NOTIFICATIONS);
  return response.data;
};

export const getUnreadNotifications = async () => {
  const response = await axiosClient.get(api_constant.NOTIFICATION_API.GET_UNREAD_NOTIFICATIONS);
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await axiosClient.put(api_constant.NOTIFICATION_API.MARK_AS_READ.replace('{id}', id));
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await axiosClient.put(api_constant.NOTIFICATION_API.MARK_ALL_AS_READ);
  return response.data;
};