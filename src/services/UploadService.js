import { getToken } from './LocalStorageService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const UPLOAD_URL = `${API_BASE_URL}/upload`;

const getAuthHeaders = () => {
    const { access_token } = getToken();
    return {
        'Authorization': access_token ? `Bearer ${access_token}` : ''
    };
};

const UploadService = {
    async getFiles() {
        const response = await fetch(`${UPLOAD_URL}/files`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch files');
        }

        const resData = await response.json();
        return resData.data;
    },

    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        const headers = getAuthHeaders();
        // Do NOT set Content-Type header when sending FormData, 
        // fetch/browser will set it automatically with boundary

        const response = await fetch(`${UPLOAD_URL}`, {
            method: 'POST',
            headers: headers,
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to upload file');
        }

        const resData = await response.json();
        return resData.data;
    },

    async deleteFile(publicId) {
        // publicId might contain slashes (e.g. folder/image)
        // We must encode it properly for URL param
        const encodedId = encodeURIComponent(publicId);

        const response = await fetch(`${UPLOAD_URL}/${encodedId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete file');
        }

        return await response.json();
    }
};

export default UploadService;
