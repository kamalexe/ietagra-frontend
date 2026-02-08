import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
  }
});

export const optimizeCloudinaryUrl = (url) => {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  const isRawFile = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i.test(url);

  // Normalize RAW delivery (critical for PDFs)
  if (isRawFile) {
    return url
      .replace('/image/upload/', '/raw/upload/')
      .replace('/video/upload/', '/raw/upload/');
  }

  // Image optimization
  if (url.includes('/image/upload/') && !url.includes('f_auto,q_auto')) {
    return url.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
  }

  return url;
};

export default cld;
