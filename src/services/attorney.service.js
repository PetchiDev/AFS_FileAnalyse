import apiClient from './api';
import { API } from '@/config/constants';

export const attorneyService = {
    /**
     * Get list of attorneys with pagination
     * @param {number} pageNumber - Page number starting from 1
     * @param {number} pageSize - Number of items per page
     * @returns {Promise<Object>} Paginated attorneys data
     */
    getAttorneys: async (pageNumber = 1, pageSize = 10) => {
        try {
            const response = await apiClient.post(`${API.ENDPOINTS.ATTORNEYS}/`, {
                page_number: pageNumber,
                page_size: pageSize
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error fetching attorneys');
        }
    },

    /**
     * Get attorney details by ID
     * @param {string} id - Attorney ID
     * @returns {Promise<Object>} Attorney details
     */
    getAttorneyDetails: async (id) => {
        try {
            const response = await apiClient.get(`${API.ENDPOINTS.ATTORNEY_DETAILS}/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error fetching attorney details');
        }
    },

    /**
     * Search attorneys by title
     * @param {string} title - Attorney name/title to search
     * @param {number} pageNumber - Page number
     * @param {number} pageSize - Page size
     * @returns {Promise<Object>} Search results
     */
    searchAttorneys: async (title, job_title, pageNumber = 1, pageSize = 10) => {
        try {
            const response = await apiClient.post(`${API.ENDPOINTS.SEARCH_ATTORNEYS}`, {
                title,
                job_title,
                page_number: pageNumber,
                page_size: pageSize
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error searching attorneys');
        }
    }
};

export default attorneyService;
