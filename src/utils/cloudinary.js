import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
  }
});

export const optimizeCloudinaryUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;

  // If already has parameters, we might need to be careful, but usually we can inject f_auto,q_auto
  // Standard Cloudinary URL: https://res.cloudinary.com/<cloud>/image/upload/<transformations>/<version>/<id>
  // or https://res.cloudinary.com/<cloud>/image/upload/<version>/<id>

  if (url.includes('/upload/') && !url.includes('f_auto,q_auto')) {
    return url.replace('/upload/', '/upload/f_auto,q_auto/');
  }
  return url;
};

export default cld;
