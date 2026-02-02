import cld from '../utils/cloudinary';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const CloudinaryService = {
    /**
     * Uploads an image to Cloudinary using the unsigned upload preset.
     * @param {File} file - The file object to upload.
     * @param {string} folder - Optional folder name.
     * @returns {Promise<Object>} - The Cloudinary response object.
     */
    async uploadImage(file, folder = 'ietagra_uploads') {
        if (!CLOUD_NAME || !UPLOAD_PRESET) {
            throw new Error('Cloudinary configuration is missing. Please check .env file.');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        if (folder) {
            formData.append('folder', folder);
        }

        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `Image upload failed (${response.status})`);
        }

        return await response.json();
    },

    /**
     * Generates an optimized URL for a given public ID.
     * @param {string} publicId - The public ID of the image.
     * @returns {string} - The optimized URL.
     */
    getOptimizedUrl(publicId) {
        if (!publicId) return '';
        
        try {
            const myImage = cld.image(publicId);
            
            myImage
                .resize(auto().gravity(autoGravity()))
                .format('auto')
                .quality('auto');
                
            return myImage.toURL();
        } catch (error) {
            console.error("Error generating optimized URL:", error);
            return '';
        }
    }
};

export default CloudinaryService;
