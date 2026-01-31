import { getToken } from './LocalStorageService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const PAGES_URL = `${API_BASE_URL}/pages`;

const getAuthHeaders = () => {
    const { access_token } = getToken();
    // console.log("Debug: access_token for request:", access_token);
    return {
        'Content-Type': 'application/json',
        'Authorization': access_token ? `Bearer ${access_token}` : ''
    };
};

const PageService = {
    async getPageBySlug(slug) {
        const response = await fetch(`${PAGES_URL}/${encodeURIComponent(slug)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Page not found');
            }
            throw new Error('Failed to fetch page data');
        }

        const resData = await response.json();
        return resData.data; // Assuming API returns { status: 'success', data: { ... } }
    },

    async createPage(pageData) {
        const response = await fetch(`${PAGES_URL}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(pageData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || `Failed to create page (${response.status} ${response.statusText})`);
        }

        const resData = await response.json();
        return resData.data;
    },

    async updatePage(slug, pageData) {
        console.log('[DEBUG] PageService: Updating page', slug, pageData);
        const response = await fetch(`${PAGES_URL}/${encodeURIComponent(slug)}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(pageData)
        });

        console.log('[DEBUG] PageService: Response status', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('[DEBUG] PageService: Update failed', errorData);
            throw new Error(errorData.error || errorData.message || 'Failed to update page');
        }

        const resData = await response.json();
        console.log('[DEBUG] PageService: Update success', resData);
        return resData.data;
    },



    async deletePage(slug) {
        const response = await fetch(`${PAGES_URL}/${encodeURIComponent(slug)}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete page');
        }

        const resData = await response.json();
        return resData;
    },

    // For keeping compatibility if needed, though getPageBySlug is the main one used
    async getPage(slug) {
        return this.getPageBySlug(slug);
    },

    async getAllPages(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${PAGES_URL}${queryString ? `?${queryString}` : ''}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch pages');
        }

        const resData = await response.json();
        return resData.data;
    }
};

export default PageService;
