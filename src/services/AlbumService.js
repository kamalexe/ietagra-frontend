import axios from 'axios';
import { getToken } from './LocalStorageService';

const API_URL = 'http://localhost:5000/api/albums';

class AlbumService {
    getAlbums(params = {}) {
        return axios.get(API_URL, { params }).then(res => res.data.data);
    }

    getAlbum(id) {
        return axios.get(`${API_URL}/${id}`).then(res => res.data.data);
    }

    createAlbum(data) {
        const { access_token } = getToken();
        return axios.post(API_URL, data, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }).then(res => res.data.data);
    }

    updateAlbum(id, data) {
        const { access_token } = getToken();
        return axios.put(`${API_URL}/${id}`, data, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }).then(res => res.data.data);
    }

    deleteAlbum(id) {
        const { access_token } = getToken();
        return axios.delete(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }).then(res => res.data);
    }
}

export default new AlbumService();
