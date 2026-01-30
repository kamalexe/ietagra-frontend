import { getToken } from './LocalStorageService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeaders = () => {
    const { access_token } = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': access_token ? `Bearer ${access_token}` : ''
    };
};

const ResearchService = {
    async getAllResearch() {
        const response = await fetch(`${API_BASE_URL}/research`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch research list');
        }

        const resData = await response.json();
        return resData.data;
    },

    async createResearch(data) {
        const response = await fetch(`${API_BASE_URL}/research`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create research');
        }

        const resData = await response.json();
        return resData.data;
    },

    async updateResearch(id, data) {
        const response = await fetch(`${API_BASE_URL}/research/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update research');
        }

        const resData = await response.json();
        return resData.data;
    },

    async deleteResearch(id) {
        const response = await fetch(`${API_BASE_URL}/research/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to delete research');
        }

        return true;
    }
};

export default ResearchService;
