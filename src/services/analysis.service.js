import apiClient from './api';
import { API } from '@/config/constants';

export const analysisService = {
    /**
     * Get list of verticals
     * @returns {Promise<Object>} verticals array
     */
    getVerticals: async () => {
        try {
            const response = await apiClient.get(API.ENDPOINTS.VERTICALS);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error fetching verticals');
        }
    },

    /**
     * Get practice areas for a specific vertical
     * @param {string} vertical - Vertical name
     * @returns {Promise<Object>} practice areas array
     */
    getPracticeAreas: async (vertical) => {
        try {
            const response = await apiClient.get(`${API.ENDPOINTS.PRACTICE_AREAS}/${encodeURIComponent(vertical)}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error fetching practice areas');
        }
    },

    /**
     * Run risk analysis for a company
     * @param {Object} payload - Company information
     * @param {string} payload.company_name
     * @param {string} payload.company_website
     * @param {string} payload.vertical
     * @param {string} payload.practice_area
     * @param {string} payload.user_prompt
     * @returns {Promise<Object>} Analysis result
     */
    runAnalysis: async (payload) => {
        try {
            const response = await apiClient.post(API.ENDPOINTS.RISK_ANALYSIS, payload);
            return response.data;
        } catch (error) {
            if (error.response) {
                const data = error.response.data;

                // If the detail is an array of validation errors (Pydantic style)
                if (data.detail && Array.isArray(data.detail) && data.detail.length > 0) {
                    const firstError = data.detail[0];
                    if (firstError.msg) {
                        throw new Error(firstError.msg);
                    }
                }

                // Fallback to message or generic server error
                const serverError = data.message || 'Server error occurred during analysis';
                throw new Error(serverError);
            } else if (error.request) {
                throw new Error('No response from server. Please check your connection.');
            } else {
                throw new Error(error.message || 'Error initiating analysis');
            }
        }
    },
    /**
     * Get analysis history
     * @param {Object} params - Pagination params
     * @returns {Promise<Object>} History items
     */
    getHistory: async (params = { page_number: 1, page_size: 10 }) => {
        try {
            const response = await apiClient.post(API.ENDPOINTS.HISTORY, params);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error fetching analysis history');
        }
    },

    /**
     * Get analysis history detail
     * @param {string} analysis_id - Analysis ID
     * @returns {Promise<Object>} Analysis detail
     */
    getHistoryDetail: async (analysis_id) => {
        try {
            const response = await apiClient.get(`${API.ENDPOINTS.HISTORY_DETAIL}/${analysis_id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error fetching analysis detail');
        }
    },

    /**
     * Filter analysis history
     * @param {Object} payload - Filter and pagination payload
     * @returns {Promise<Object>} Filtered history items
     */
    filterHistory: async (payload) => {
        try {
            const response = await apiClient.post(API.ENDPOINTS.HISTORY_FILTER, payload);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error filtering analysis history');
        }
    },

    /**
     * Extract fields from chat message
     * @param {Object} payload - Chat information
     * @param {string} payload.message
     * @param {Object|null} payload.current_fields
     * @param {boolean} payload.analysis_completed
     * @returns {Promise<Object>} Extracted fields and status
     */
    chatExtract: async (payload) => {
        try {
            const response = await apiClient.post(API.ENDPOINTS.CHAT_EXTRACT, payload);
            return response.data;
        } catch (error) {
            if (error.response) {
                const data = error.response.data;
                if (data.detail && Array.isArray(data.detail) && data.detail.length > 0) {
                    const firstError = data.detail[0];
                    if (firstError.msg) {
                        throw new Error(firstError.msg);
                    }
                }
                const serverError = data.message || 'Server error occurred during chat extraction';
                throw new Error(serverError);
            } else if (error.request) {
                throw new Error('No response from server. Please check your connection.');
            } else {
                throw new Error(error.message || 'Error communicating with chat API');
            }
        }
    },

    /**
     * Get list of chat sessions for a user
     * @param {string} objectId - User Object ID
     * @returns {Promise<Object>} Chat sessions
     */
    getChatSessions: async (objectId) => {
        try {
            const response = await apiClient.get(`${API.ENDPOINTS.CHAT_SESSIONS}/${objectId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error fetching chat sessions');
        }
    },
    /**
     * Get chat session details
     * @param {string} sessionId - Chat Session ID
     * @param {string} objectId - User Object ID
     * @returns {Promise<Object>} Session details and history
     */
    getChatSessionDetails: async (sessionId, objectId) => {
        try {
            const response = await apiClient.get(`${API.ENDPOINTS.CHAT_SESSION_DETAIL}/${sessionId}`, {
                params: { object_id: objectId }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error fetching chat session details');
        }
    },

    /**
     * Delete a chat session
     * @param {string} sessionId - Chat Session ID
     * @param {string} objectId - User Object ID
     * @returns {Promise<Object>} Confirmation message
     */
    deleteChatSession: async (sessionId, objectId) => {
        try {
            const response = await apiClient.delete(`${API.ENDPOINTS.CHAT_SESSION_DETAIL}/${sessionId}`, {
                params: { object_id: objectId }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error deleting chat session');
        }
    },

    /**
     * Delete an analysis report
     * @param {string} analysisId - Analysis ID (path param)
     * @param {string} objectId - Object/partition ID (query param)
     * @returns {Promise<Object>} Confirmation message
     */
    deleteAnalysis: async (analysisId, objectId) => {
        try {
            const response = await apiClient.delete(`${API.ENDPOINTS.HISTORY_DETAIL}/${analysisId}`, {
                params: { object_id: objectId }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error deleting analysis report');
        }
    },

    /**
     * Share analysis report
     * @param {Object} payload - Sharing information
     * @returns {Promise<Object>} Confirmation message
     */
    shareReport: async (payload) => {
        try {
            const response = await apiClient.post(API.ENDPOINTS.SHARING, payload);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error sharing report');
        }
    },

    /**
     * Get list of research sessions for a user
     * @param {string} objectId - User Object ID
     * @returns {Promise<Object>} Research sessions
     */
    getResearchSessions: async (objectId) => {
        try {
            const response = await apiClient.get(`${API.ENDPOINTS.RESEARCH_SESSIONS}/${objectId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error fetching research sessions');
        }
    },

    /**
     * Send a message in the research chat
     * @param {Object} payload - Research chat payload
     * @returns {Promise<Object>} Research chat response
     */
    researchChat: async (payload) => {
        try {
            const response = await apiClient.post(API.ENDPOINTS.RESEARCH_CHAT, payload);
            return response.data;
        } catch (error) {
            if (error.response) {
                const data = error.response.data;
                if (data.detail && Array.isArray(data.detail) && data.detail.length > 0) {
                    const firstError = data.detail[0];
                    if (firstError.msg) throw new Error(firstError.msg);
                }
                throw new Error(data.message || 'Server error during research chat');
            } else if (error.request) {
                throw new Error('No response from server. Please check your connection.');
            } else {
                throw new Error(error.message || 'Error communicating with research API');
            }
        }
    },

    /**
     * Get research chat session details
     * @param {string} chatSessionId - Research Chat Session ID
     * @param {string} objectId - User Object ID
     * @returns {Promise<Object>} Session details with conversations
     */
    getResearchSessionDetail: async (chatSessionId, objectId) => {
        try {
            const response = await apiClient.get(`${API.ENDPOINTS.RESEARCH_SESSION_DETAIL}/${chatSessionId}`, {
                params: { object_id: objectId }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error fetching research session detail');
        }
    },

    /**
     * Delete a research chat session
     * @param {string} chatSessionId - Research Chat Session ID
     * @param {string} objectId - User Object ID
     * @returns {Promise<Object>}
     */
    deleteResearchSession: async (chatSessionId, objectId) => {
        try {
            const response = await apiClient.delete(`${API.ENDPOINTS.RESEARCH_SESSION_DELETE}/${chatSessionId}`, {
                params: { object_id: objectId }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error deleting research session');
        }
    },

    /**
     * Get research history with pagination
     * @param {Object} payload - { object_id, page_number, page_size }
     * @returns {Promise<Object>} Research history items
     */
    getResearchHistory: async (payload) => {
        try {
            const response = await apiClient.post(API.ENDPOINTS.RESEARCH_HISTORY, payload);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error fetching research history');
        }
    },

    /**
     * Get research history detail
     * @param {string} research_id - Research ID
     * @returns {Promise<Object>} Research detail
     */
    getResearchHistoryDetail: async (research_id) => {
        try {
            const response = await apiClient.get(`${API.ENDPOINTS.RESEARCH_HISTORY}${research_id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error fetching research history detail');
        }
    },

    /**
     * Share research report
     * @param {Object} payload - Share payload
     * @returns {Promise<Object>} API response
     */
    shareResearch: async (payload) => {
        try {
            const response = await apiClient.post('/api/v1/sharing/share-research', payload);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error sharing research report');
        }
    },

    /**
     * Delete research history
     * @param {string} researchId - Research ID
     * @param {string} objectId - Admin/Owner object ID
     * @returns {Promise<Object>} API response
     */
    deleteResearchHistory: async (researchId, objectId) => {
        try {
            const response = await apiClient.delete(`${API.ENDPOINTS.RESEARCH_HISTORY}${researchId}`, {
                params: { object_id: objectId }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error deleting research history');
        }
    },
    
    /**
     * Process files for schedule generation
     * @param {FormData} formData - Contains files array and object_id
     * @returns {Promise<Object>} Processing result
     */
    processFiles: async (formData) => {
        try {
            const response = await apiClient.post(API.ENDPOINTS.PROCESS_FILES, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                const data = error.response.data;
                const serverError = data.message || 'Server error occurred during processing';
                throw new Error(serverError);
            } else if (error.request) {
                throw new Error('No response from server. Please check your connection.');
            } else {
                throw new Error(error.message || 'Error initiating processing');
            }
        }
    },
    
    /**
     * Get processing history
     * @param {Object} payload - { object_id, page_number, page_size, search_filename }
     * @returns {Promise<Object>} History records
     */
    getProcessings: async (payload) => {
        try {
            const response = await apiClient.post(API.ENDPOINTS.PROCESSINGS, payload);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error fetching processing history');
        }
    },
    
    /**
     * Get processing detail by ID
     * @param {string} id - Processing ID
     * @returns {Promise<Object>} Detail record
     */
    getProcessingDetail: async (id) => {
        try {
            const response = await apiClient.get(`${API.ENDPOINTS.PROCESSING_DETAIL}${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error fetching processing details');
        }
    },
    /**
     * Delete a processing record
     * @param {string} id - Processing ID
     * @param {string} objectId - User Object ID
     * @returns {Promise<Object>} Confirmation message
     */
    deleteProcessing: async (id, objectId) => {
        try {
            const response = await apiClient.delete(`${API.ENDPOINTS.PROCESSING_DETAIL}${id}`, {
                params: { object_id: objectId }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error deleting processing record');
        }
    },

    /**
     * Generate document from extracted data
     * @param {Object} payload - { processing_id, extracted_data }
     * @returns {Promise<Object>} Generation result
     */
    generateDocument: async (payload) => {
        try {
            const response = await apiClient.post(API.ENDPOINTS.GENERATE_DOCUMENT, payload);
            return response.data;
        } catch (error) {
            if (error.response) {
                const data = error.response.data;
                throw new Error(data.message || 'Error generating document');
            }
            throw new Error(error.message || 'Error connecting to generation API');
        }
    }
};

export default analysisService;
