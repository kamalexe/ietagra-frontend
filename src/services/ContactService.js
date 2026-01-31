import { getToken } from './LocalStorageService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ContactService = {
    async getContacts(params = {}) {
        const { access_token } = getToken();
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/contacts${queryString ? `?${queryString}` : ''}`, {
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
