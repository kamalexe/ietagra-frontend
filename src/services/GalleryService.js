import axios from 'axios';
import { getToken } from './LocalStorageService';

const API_URL = 'http://localhost:5000/api/gallery';

class GalleryService {
    getGalleryImages() {
        return axios.get(API_URL).then(res => res.data.data);
    }

    getGalleryImage(id) {
        return axios.get(`${API_URL}/${id}`).then(res => res.data.data);
    }

    createGalleryImage(data) {
        const { access_token } = getToken();
        return axios.post(API_URL, data, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }).then(res => res.data.data);
    }

    updateGalleryImage(id, data) {
        const { access_token } = getToken();
        return axios.put(`${API_URL}/${id}`, data, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }).then(res => res.data.data);
    }

    deleteGalleryImage(id) {
        const { access_token } = getToken();
        return axios.delete(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }).then(res => res.data);
    }
}

export default new GalleryService();
