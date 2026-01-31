import axiosInstance from '../api/axiosConfig';

const ENDPOINT = '/gallery';

class GalleryService {
    getGalleryImages(params = {}) {
        return axiosInstance.get(ENDPOINT, { params }).then(res => res.data.data);
    }

    getGalleryImage(id) {
        return axiosInstance.get(`${ENDPOINT}/${id}`).then(res => res.data.data);
    }

    createGalleryImage(data) {
        return axiosInstance.post(ENDPOINT, data).then(res => res.data.data);
    }

    updateGalleryImage(id, data) {
        return axiosInstance.put(`${ENDPOINT}/${id}`, data).then(res => res.data.data);
    }

    deleteGalleryImage(id) {
        return axiosInstance.delete(`${ENDPOINT}/${id}`).then(res => res.data);
    }
}

const galleryServiceInstance = new GalleryService();
export default galleryServiceInstance;
