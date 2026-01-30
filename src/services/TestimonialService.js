import { getToken } from './LocalStorageService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeaders = () => {
    const { access_token } = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': access_token ? `Bearer ${access_token}` : ''
    };
};

const TestimonialService = {
    async getAllTestimonials() {
        const response = await fetch(`${API_BASE_URL}/testimonials`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch testimonials');
        }

        const resData = await response.json();
        return resData.data;
    },

    async createTestimonial(data) {
        const response = await fetch(`${API_BASE_URL}/testimonials`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create testimonial');
        }

        const resData = await response.json();
        return resData.data;
    },

    async updateTestimonial(id, data) {
        const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update testimonial');
        }

        const resData = await response.json();
        return resData.data;
    },

    async deleteTestimonial(id) {
        const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to delete testimonial');
        }

        return true;
    }
};

export default TestimonialService;
