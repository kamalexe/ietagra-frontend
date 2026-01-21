import { getToken } from './LocalStorageService';

const API_BASE_URL = 'http://localhost:5000/api';

const ContactService = {
    async getContacts() {
        const { access_token } = getToken();
        const response = await fetch(`${API_BASE_URL}/contacts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': access_token ? `Bearer ${access_token}` : ''
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch contacts');
        }

        const resData = await response.json();
        return resData.data;
    }
};

export default ContactService;
