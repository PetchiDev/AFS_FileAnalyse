import apiClient from './api';
import { API } from '@/config/constants';

/**
 * Service to interact with User Directory (AD) via Backend
 */
export const graphService = {
    /**
     * Search users in the tenant via backend
     * @param {string} query 
     * @param {number} top
     * @param {string} nextPageToken
     * @returns {Promise<Object>} users and next_page_token
     */
    searchUsers: async (query = '', top = 10, nextPageToken = null) => {
        try {
            const params = {
                top,
                search: query || undefined,
                next_page_token: nextPageToken || undefined
            };

            const response = await apiClient.get(API.ENDPOINTS.AD_USERS, { params });
            
            if (response.data) {
                return {
                    users: response.data.users || [],
                    next_page_token: response.data.next_page_token || null,
                    total_count: response.data.total_count || 0
                };
            }
            
            return { users: [], next_page_token: null, total_count: 0 };
        } catch (error) {
            console.error('Error searching tenant users:', error);
            return { users: [], next_page_token: null, total_count: 0 };
        }
    }
};

export default graphService;
