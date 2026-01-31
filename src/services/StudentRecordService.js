import { getToken } from './LocalStorageService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeaders = () => {
    const { access_token } = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': access_token ? `Bearer ${access_token}` : ''
    };
};

const StudentRecordService = {
    async getRecords(category, params = {}) {
        const queryString = new URLSearchParams({ category, ...params }).toString();
        const response = await fetch(`${API_BASE_URL}/student-records?${queryString}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch student records');
        }

        const resData = await response.json();
        return resData.data;
    }
};

export default StudentRecordService;
