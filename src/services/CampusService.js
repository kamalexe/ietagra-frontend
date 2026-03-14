import { getToken } from './LocalStorageService';

const API_BASE_URL = '/api';

const getAuthHeaders = () => {
    const { access_token } = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': access_token ? `Bearer ${access_token}` : ''
    };
};

const CampusService = {
    async getAllCampuses() {
        const response = await fetch(`${API_BASE_URL}/campuses`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch campuses list');
        }

        const resData = await response.json();
        return resData.data;
    },

    async getCampus(id) {
        const response = await fetch(`${API_BASE_URL}/campuses/${id}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch campus');
        }

        const resData = await response.json();
        return resData.data;
    },

    async createCampus(data) {
        const response = await fetch(`${API_BASE_URL}/campuses`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || error.message || 'Failed to create campus');
        }

        const resData = await response.json();
        return resData.data;
    },

    async updateCampus(id, data) {
        const response = await fetch(`${API_BASE_URL}/campuses/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || error.message || 'Failed to update campus');
        }

        const resData = await response.json();
        return resData.data;
    },

    async deleteCampus(id) {
        const response = await fetch(`${API_BASE_URL}/campuses/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to delete campus');
        }

        return true;
    },

    async seedCampuses() {
        const response = await fetch(`${API_BASE_URL}/campuses/seed`, {
            method: 'POST',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || error.message || 'Failed to seed campuses');
        }

        const resData = await response.json();
        return resData;
    }
};

export default CampusService;
