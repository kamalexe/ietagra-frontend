import { getToken } from './LocalStorageService';

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const { access_token } = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': access_token ? `Bearer ${access_token}` : ''
    };
};

const FacultyService = {
    async getAllFaculty() {
        const response = await fetch(`${API_BASE_URL}/admin/faculty`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch faculty list');
        }

        const resData = await response.json();
        return resData.data;
    },

    async createFaculty(data) {
        const response = await fetch(`${API_BASE_URL}/admin/faculty`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || error.message || 'Failed to create faculty member');
        }

        const resData = await response.json();
        return resData.data;
    },

    async updateFaculty(id, data) {
        const response = await fetch(`${API_BASE_URL}/admin/faculty/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || error.message || 'Failed to update faculty member');
        }

        const resData = await response.json();
        return resData.data;
    },

    async deleteFaculty(id) {
        const response = await fetch(`${API_BASE_URL}/admin/faculty/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to delete faculty member');
        }

        return true;
    },

    async bulkUpload(formData) {
        const { access_token } = getToken();
        const response = await fetch(`${API_BASE_URL}/admin/faculty/bulk-upload`, {
            method: 'POST',
            headers: {
                'Authorization': access_token ? `Bearer ${access_token}` : ''
                // Content-Type is handled automatically by browser for FormData
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to bulk upload faculty');
        }

        return await response.json();
    }
};

export default FacultyService;
