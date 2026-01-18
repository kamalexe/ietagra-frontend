import { getToken } from './LocalStorageService';

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const { access_token } = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': access_token ? `Bearer ${access_token}` : ''
    };
};

const DepartmentService = {
    async getAllDepartments() {
        const response = await fetch(`${API_BASE_URL}/admin/departments`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch departments list');
        }

        const resData = await response.json();
        return resData.data;
    },

    async createDepartment(data) {
        const response = await fetch(`${API_BASE_URL}/admin/departments`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || error.message || 'Failed to create department');
        }

        const resData = await response.json();
        return resData.data;
    },

    async updateDepartment(id, data) {
         const response = await fetch(`${API_BASE_URL}/admin/departments/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || error.message || 'Failed to update department');
        }

        const resData = await response.json();
        return resData.data;
    },

    async deleteDepartment(id) {
        const response = await fetch(`${API_BASE_URL}/admin/departments/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to delete department');
        }

        return true;
    }
};

export default DepartmentService;
