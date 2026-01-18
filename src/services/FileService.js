import { getToken } from './LocalStorageService';

const API_BASE_URL = 'http://localhost:5000/api';
const UPLOAD_URL = `${API_BASE_URL}/upload`;

const getAuthHeaders = () => {
    const { access_token } = getToken();
    // distinct from other services: we often DO NOT set Content-Type for FormData, 
    // as the browser sets it with the boundary automatically.
    return {
        'Authorization': access_token ? `Bearer ${access_token}` : ''
    };
};

const FileService = {
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${UPLOAD_URL}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: formData
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `Upload failed (${response.status})`);
        }

        const resData = await response.json();
        return resData.data; // Expected: { filename, url, relativePath }
    }
};

export default FileService;
