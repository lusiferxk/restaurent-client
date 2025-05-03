import React, { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { ImageIcon, Loader2 } from 'lucide-react';

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string) => void;
  label: string;
  required?: boolean;
  className?: string;
}

export function CloudinaryUpload({ onUploadSuccess, label, required = false, className = '' }: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <CldUploadWidget
        uploadPreset="tastebite"
        onUpload={(result: any) => {
          if (result?.event === "success" && result?.info?.secure_url) {
            onUploadSuccess(result.info.secure_url);
            setIsUploading(false);
          }
        }}
        onOpen={() => setIsUploading(true)}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <ImageIcon className="h-5 w-5" />
                <span>Upload Image</span>
              </>
            )}
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
} 