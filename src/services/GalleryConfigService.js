import axiosInstance from '../api/axiosConfig';

const ENDPOINT = '/gallery-config';

const GalleryConfigService = {
    getConfig: () => {
        return axiosInstance.get(ENDPOINT).then(res => res.data.data);
    },

    updateConfig: (data) => {
        return axiosInstance.put(ENDPOINT, data).then(res => res.data.data);
    }
};

export default GalleryConfigService;
