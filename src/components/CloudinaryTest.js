import React, { useState } from 'react';
import CloudinaryUpload from './common/CloudinaryUpload';
import CloudinaryService from '../services/CloudinaryService';

const CloudinaryTest = () => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [optimizedUrl, setOptimizedUrl] = useState('');

    const handleUploadSuccess = (data) => {
        console.log('Upload success:', data);
        setUploadedImage(data);
        
        // Generate optimized URL using the public_id
        const optUrl = CloudinaryService.getOptimizedUrl(data.public_id);
        setOptimizedUrl(optUrl);
    };

    const handleUploadFailure = (error) => {
        console.error('Upload failed:', error);
        alert('Upload failed. Check console for details.');
    };

    return (
        <div className="p-4 border rounded shadow-md max-w-md mx-auto mt-10 bg-white">
            <h2 className="text-xl font-bold mb-4">Cloudinary Integration Test</h2>
            
            <p className="text-sm text-gray-600 mb-4">
                Select an image to test uploading to Cloudinary.
            </p>

            <CloudinaryUpload 
                onUploadSuccess={handleUploadSuccess} 
                onUploadFailure={handleUploadFailure}
                folder="test_uploads"
            />

            {uploadedImage && (
                <div className="mt-4 space-y-2">
                    <div className="p-2 bg-green-50 text-green-700 rounded text-sm mb-2">
                        Upload Successful!
                    </div>
                    
                    <div>
                        <p className="text-xs font-semibold text-gray-500">Public ID:</p>
                        <p className="text-xs font-mono bg-gray-100 p-1 rounded select-all">{uploadedImage.public_id}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                            <p className="text-xs font-semibold mb-1">Original:</p>
                            <img src={uploadedImage.secure_url} alt="Original" className="w-full h-auto rounded border" />
                        </div>
                        {optimizedUrl && (
                            <div>
                                <p className="text-xs font-semibold mb-1">Optimized:</p>
                                <img src={optimizedUrl} alt="Optimized" className="w-full h-auto rounded border" />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CloudinaryTest;
