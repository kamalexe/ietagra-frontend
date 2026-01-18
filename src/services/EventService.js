import { getToken } from './LocalStorageService';

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const { access_token } = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': access_token ? `Bearer ${access_token}` : ''
    };
};

const EventService = {
    async getAllEvents() {
        // Public endpoint
        const response = await fetch(`${API_BASE_URL}/events`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }

        const resData = await response.json();
        return resData.data;
    },

    async getEvent(id) {
        // Public endpoint
        const response = await fetch(`${API_BASE_URL}/events/${id}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch event');
        }

        const resData = await response.json();
        return resData.data;
    },

    async getEventBySlug(slug) {
        // Public endpoint
        const response = await fetch(`${API_BASE_URL}/events/slug/${slug}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch event');
        }

        const resData = await response.json();
        return resData.data;
    },

    async createEvent(data) {
        const response = await fetch(`${API_BASE_URL}/events`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create event');
        }

        const resData = await response.json();
        return resData.data;
    },

    async updateEvent(id, data) {
        const response = await fetch(`${API_BASE_URL}/events/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update event');
        }

        const resData = await response.json();
        return resData.data;
    },

    async deleteEvent(id) {
        const response = await fetch(`${API_BASE_URL}/events/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to delete event');
        }

        return true;
    },

    async bulkUpload(formData) {
        const { access_token } = getToken();
        const response = await fetch(`${API_BASE_URL}/admin/events/bulk-upload`, {
            method: 'POST',
            headers: {
                'Authorization': access_token ? `Bearer ${access_token}` : ''
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to bulk upload events');
        }

        return await response.json();
    }
};

export default EventService;
