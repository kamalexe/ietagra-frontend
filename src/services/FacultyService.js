import { getToken } from './LocalStorageService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeaders = () => {
    const { access_token } = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': access_token ? `Bearer ${access_token}` : ''
    };
};

const FacultyService = {
    async getAllFaculty() {
        const response = await fetch(`${API_BASE_URL}/faculty`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            let errorMessage = `Failed to fetch faculty list (${response.status})`;
            try {
                const error = await response.json();
                errorMessage = error.error || error.message || errorMessage;
            } catch (e) { }
            throw new Error(errorMessage);
        }

        const resData = await response.json();
        return resData.data;
    },

    async getPublicFacultyByDepartment(departmentId) {
        const response = await fetch(`${API_BASE_URL}/faculty/public/${departmentId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch department faculty');
        }

        const resData = await response.json();
        return resData.data;
    },

    async createFaculty(data) {
        const response = await fetch(`${API_BASE_URL}/faculty`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            let errorMessage = `Failed to create faculty member (${response.status})`;
            try {
                const error = await response.json();
                errorMessage = error.error || error.message || errorMessage;
            } catch (jsonErr) {
                // Not JSON, maybe get text
                const text = await response.text().catch(() => '');
                if (text) errorMessage += `: ${text.substring(0, 100)}`;
            }
            throw new Error(errorMessage);
        }

        const resData = await response.json();
        return resData.data;
    },

    async updateFaculty(id, data) {
        const response = await fetch(`${API_BASE_URL}/faculty/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            let errorMessage = `Failed to update faculty member (${response.status})`;
            try {
                const error = await response.json();
                errorMessage = error.error || error.message || errorMessage;
            } catch (jsonErr) {
                const text = await response.text().catch(() => '');
                if (text) errorMessage += `: ${text.substring(0, 100)}`;
            }
            throw new Error(errorMessage);
        }

        const resData = await response.json();
        return resData.data;
    },

    async deleteFaculty(id) {
        const response = await fetch(`${API_BASE_URL}/faculty/${id}`, {
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
        const response = await fetch(`${API_BASE_URL}/faculty/bulk-upload`, {
            method: 'POST',
            headers: {
                'Authorization': access_token ? `Bearer ${access_token}` : ''
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
