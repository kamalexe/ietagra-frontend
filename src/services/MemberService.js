import axios from 'axios';
import { getToken } from './LocalStorageService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const getMembers = async (params = {}) => {
    const { access_token } = getToken();
    if (!access_token) return [];

    try {
        const queryParams = new URLSearchParams(params).toString();
        const response = await axios.get(`${API_BASE_URL}/members?${queryParams}`, {
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch members');
    }
};

const getMember = async (id) => {
    const { access_token } = getToken();
    if (!access_token) {
        throw new Error('No access token found.');
    }
    try {
        const response = await axios.get(`${API_BASE_URL}/members/${id}`, {
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch member');
    }
};

const createMember = async (data) => {
    const { access_token } = getToken();
    try {
        const response = await axios.post(`${API_BASE_URL}/members`, data, {
            headers: {
                'authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to create member');
    }
};

const updateMember = async (id, data) => {
    const { access_token } = getToken();
    try {
        const response = await axios.put(`${API_BASE_URL}/members/${id}`, data, {
            headers: {
                'authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update member');
    }
};

const deleteMember = async (id) => {
    const { access_token } = getToken();
    try {
        const response = await axios.delete(`${API_BASE_URL}/members/${id}`, {
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete member');
    }
};

const bulkUploadMembers = async (formData) => {
    const { access_token } = getToken();
    try {
        const response = await axios.post(`${API_BASE_URL}/members/bulk-upload`, formData, {
            headers: {
                'authorization': `Bearer ${access_token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to upload members');
    }
};

const MemberService = {
    getMembers,
    getMember,
    createMember,
    updateMember,
    deleteMember,
    bulkUpload: bulkUploadMembers
};

export default MemberService;
