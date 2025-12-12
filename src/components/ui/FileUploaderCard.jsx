import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { uploadFile } from '../../services/api';
import toast from 'react-hot-toast';

const FileUploaderCard = ({ onTextExtracted, onFileUpload }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Support both prop names for backwards compatibility
  const handleCallback = onTextExtracted || onFileUpload;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        toast.error('File size too large. Max 5MB allowed.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    const loadingToast = toast.loading('Uploading and extracting text...');

    try {
        const { data } = await uploadFile(formData);
        toast.dismiss(loadingToast);
        toast.success(`Successfully extracted text from ${file.name}`);
        if (handleCallback) {
          handleCallback(data.text);
        }
    } catch (error) {
        console.error('Upload error:', error);
        toast.dismiss(loadingToast);
        toast.error(error.response?.data?.error || 'Failed to upload file');
    } finally {
        setIsUploading(false);
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="p-6 rounded-xl border border-dashed border-gray-500/50 bg-background/30 hover:bg-background/50 transition-all flex flex-col items-center justify-center gap-4 group">
        <div className="p-4 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
          {isUploading ? (
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          ) : (
              <Upload className="w-8 h-8 text-blue-500" />
          )}
        </div>
        <div className="text-center">
          <p className="font-medium">{isUploading ? 'Processing...' : 'Upload File'}</p>
          <p className="text-sm text-gray-500">.pdf, .docx, .txt supported</p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.docx,.txt,.md"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>
    </motion.div>
  );
};

export default FileUploaderCard;
