import { getToken } from './LocalStorageService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const FOOTER_URL = `${API_BASE_URL}/footer`;

const getAuthHeaders = () => {
    const { access_token } = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': access_token ? `Bearer ${access_token}` : ''
    };
};

const FooterService = {
    async getFooterConfig() {
        const response = await fetch(FOOTER_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch footer configuration');
        }

        const resData = await response.json();
        return resData.data;
    },

    async updateFooterConfig(configData) {
        const response = await fetch(FOOTER_URL, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(configData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || errorData.message || 'Failed to update footer configuration');
        }

        const resData = await response.json();
        return resData.data;
    }
};

export default FooterService;
