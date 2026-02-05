import { getToken } from './LocalStorageService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CompanyService = {
    async registerCompany(companyData) {
        const response = await fetch(`${API_BASE_URL}/company-registration/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(companyData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error ? (Array.isArray(errorData.error) ? errorData.error.join(', ') : errorData.error) : 'Registration failed');
        }

        return await response.json();
    },

    async uploadDocument(file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/company-registration/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Upload failed');
        }

        return await response.json();
    },

    async getAllRegistrations() {
        const { access_token } = getToken();
        const response = await fetch(`${API_BASE_URL}/company-registration`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch registrations');
        return await response.json();
    },

    async updateStatus(id, status) {
        const { access_token } = getToken();
        const response = await fetch(`${API_BASE_URL}/company-registration/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update status');
        return await response.json();
    }
};

export default CompanyService;
