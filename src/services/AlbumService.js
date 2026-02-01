import axiosInstance from '../api/axiosConfig';

const ENDPOINT = '/albums';

class AlbumService {
    getAlbums(params = {}) {
        return axiosInstance.get(ENDPOINT, { params }).then(res => res.data.data);
    }

    getAlbum(id) {
        return axiosInstance.get(`${ENDPOINT}/${id}`).then(res => res.data.data);
    }

    createAlbum(data) {
        return axiosInstance.post(ENDPOINT, data).then(res => res.data.data);
    }

    updateAlbum(id, data) {
        return axiosInstance.put(`${ENDPOINT}/${id}`, data).then(res => res.data.data);
    }

    deleteAlbum(id) {
        return axiosInstance.delete(`${ENDPOINT}/${id}`).then(res => res.data);
    }
}

const albumService = new AlbumService();
export default albumService;
