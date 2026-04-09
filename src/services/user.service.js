import { apiService } from './api';
import { API } from '@/config/constants';
import { MESSAGES } from '@/config/constants';

export const userService = {
  getUserProfile: async () => {
    try {
      const response = await apiService.get(API.ENDPOINTS.USER_PROFILE);
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        message: error.message || MESSAGES.ERROR.NETWORK
      };
    }
  },

  updateUserProfile: async (userData) => {
    try {
      const response = await apiService.put(
        API.ENDPOINTS.USER_PROFILE,
        userData
      );
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        message: error.message || MESSAGES.ERROR.NETWORK
      };
    }
  }
};

export default userService;

