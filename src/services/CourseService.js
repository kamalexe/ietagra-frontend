import { getToken } from './LocalStorageService';

const API_BASE_URL = '/api';

const getAuthHeaders = () => {
    const { access_token } = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': access_token ? `Bearer ${access_token}` : ''
    };
};

const CourseService = {
    async getAllCourses(campusId = null) {
        let url = `${API_BASE_URL}/courses`;
        if (campusId) {
            url += `?campusId=${campusId}`;
        }
        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch courses list');
        }

        const resData = await response.json();
        return resData.data;
    },

    async getCourse(id) {
        const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch course');
        }

        const resData = await response.json();
        return resData.data;
    },

    async createCourse(data) {
        const response = await fetch(`${API_BASE_URL}/courses`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || error.message || 'Failed to create course');
        }

        const resData = await response.json();
        return resData.data;
    },

    async updateCourse(id, data) {
        const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || error.message || 'Failed to update course');
        }

        const resData = await response.json();
        return resData.data;
    },

    async deleteCourse(id) {
        const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to delete course');
        }

        return true;
    }
};

export default CourseService;
