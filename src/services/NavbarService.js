import { getToken } from './LocalStorageService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const NAVBAR_URL = `${API_BASE_URL}/navbar`;

const getAuthHeaders = () => {
    const { access_token } = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': access_token ? `Bearer ${access_token}` : ''
    };
};

const NavbarService = {
    async getNavbarConfig() {
        const response = await fetch(NAVBAR_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch navbar configuration');
        }

        const resData = await response.json();
        return resData.data;
    },

    async updateNavbarConfig(configData) {
        const response = await fetch(NAVBAR_URL, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(configData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || errorData.message || 'Failed to update navbar configuration');
        }

        const resData = await response.json();
        return resData.data;
    }
};

export default NavbarService;
