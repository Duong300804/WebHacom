import axiosClient from '../Common/axiosClient';
import api_constant from '../Common/apiConstants';

export const login = async (username, password) => {
    const response = await axiosClient.post(api_constant.AUTH_API.LOGIN, {username, password});
    return response.data;
}

export const register = async (username, email, password) => {
  const response = await axiosClient.post(api_constant.AUTH_API.REGISTER, { username, email, password });
  return response.data;
}

export const forgotPassword = async (username, email, newPassword, confirmPassword) => {
  const response = await axiosClient.post(api_constant.AUTH_API.FORGOT_PASSWORD, { username, email, newPassword, confirmPassword });
  return response.data;
}

export const getProfile = async () => {
  const response = await axiosClient.get(api_constant.AUTH_API.PROFILE);
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await axiosClient.put(api_constant.AUTH_API.UPDATE_PROFILE, profileData);
  return response.data; 
};


export const changePassword = async (oldPassword, newPassword, confirmPassword) => {
  const response = await axiosClient.put(api_constant.AUTH_API.CHANGE_PASSWORD, { oldPassword, newPassword, confirmPassword });
  return response.data;
};
