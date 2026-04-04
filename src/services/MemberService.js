import axiosInstance from '../api/axiosConfig';

const getMembers = async (params = {}) => {
    try {
        const response = await axiosInstance.get('/members', { params });
        return response.data.data;
    } catch (error) {
        throw new Error(error.message || 'Failed to fetch members');
    }
};

const getMember = async (id) => {
    try {
        const response = await axiosInstance.get(`/members/${id}`);
        return response.data.data;
    } catch (error) {
        throw new Error(error.message || 'Failed to fetch member');
    }
};

const createMember = async (data) => {
    try {
        const response = await axiosInstance.post('/members', data);
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Failed to create member');
    }
};

const updateMember = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/members/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Failed to update member');
    }
};

const deleteMember = async (id) => {
    try {
        const response = await axiosInstance.delete(`/members/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Failed to delete member');
    }
};

const bulkUploadMembers = async (formData) => {
    try {
        const response = await axiosInstance.post('/members/bulk-upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Failed to upload members');
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
