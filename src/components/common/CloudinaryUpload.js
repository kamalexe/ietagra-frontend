import React, { useState } from 'react';
import CloudinaryService from '../../services/CloudinaryService';

const CloudinaryUpload = ({ 
    onUploadSuccess, 
    onUploadFailure, 
    folder = 'ietagra_uploads', 
    label = "Upload Image",
    className = ""
}) => {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await CloudinaryService.uploadImage(file, folder);
            if (onUploadSuccess) {
                onUploadSuccess(result);
            }
        } catch (error) {
            console.error('Upload Error:', error);
            if (onUploadFailure) {
                onUploadFailure(error);
            } else {
                alert(`Upload Failed: ${error.message}`);
            }
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = null;
        }
    };

    return (
        <div className={`flex flex-col items-start gap-2 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100
                        disabled:opacity-50
                        cursor-pointer"
                />
                {uploading && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                         <svg className="animate-spin h-5 w-5 text-violet-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CloudinaryUpload;
