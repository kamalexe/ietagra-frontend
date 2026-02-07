import { getToken } from './LocalStorageService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeaders = () => {
    const { access_token } = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': access_token ? `Bearer ${access_token}` : ''
    };
};

const StudentService = {
    async getAllStudents(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/admin/students${queryString ? `?${queryString}` : ''}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            let errorMessage = `Failed to fetch students list (${response.status})`;
            try {
                const error = await response.json();
                errorMessage = error.error || error.message || errorMessage;
            } catch (e) { }
            throw new Error(errorMessage);
        }

        const resData = await response.json();
        return resData.data;
    },

    async createStudent(data) {
        const response = await fetch(`${API_BASE_URL}/admin/students`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            let errorMessage = `Failed to create student (${response.status})`;
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

    async updateStudent(id, data) {
        const response = await fetch(`${API_BASE_URL}/admin/students/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            let errorMessage = `Failed to update student (${response.status})`;
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

    async deleteStudent(id) {
        const response = await fetch(`${API_BASE_URL}/admin/students/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to delete student');
        }

        return true;
    },

    async bulkUpload(formData) {
        const { access_token } = getToken();
        // Uses FormData, so don't set Content-Type header manually (let browser set boundary)
        const response = await fetch(`${API_BASE_URL}/admin/students/bulk-upload`, {
            method: 'POST',
            headers: {
                'Authorization': access_token ? `Bearer ${access_token}` : ''
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to bulk upload students');
        }

        return await response.json();
    }
};

export default StudentService;
