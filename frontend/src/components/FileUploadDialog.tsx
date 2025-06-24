import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, FileText, Image, BarChart3 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';

interface FileUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (files: File[]) => void;
}

interface UploadedFile {
  file: File;
  preview?: string;
}

const getFileIcon = (type: string) => {
  if (type.includes('pdf')) return <FileText className="w-6 h-6 text-red-500" />;
  if (type.includes('image')) return <Image className="w-6 h-6 text-blue-500" />;
  if (type.includes('csv') || type.includes('excel')) return <BarChart3 className="w-6 h-6 text-green-500" />;
  return <File className="w-6 h-6 text-neutral-400" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  isOpen,
  onClose,
  onFileUpload,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'],
      'text/plain': ['.txt'],
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = () => {
    if (uploadedFiles.length > 0) {
      onFileUpload(uploadedFiles.map(uf => uf.file));
      setUploadedFiles([]);
      onClose();
    }
  };

  const handleClose = () => {
    // Clean up object URLs
    uploadedFiles.forEach(uf => {
      if (uf.preview) {
        URL.revokeObjectURL(uf.preview);
      }
    });
    setUploadedFiles([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>
            Upload PDFs, Word documents, CSV files, images, or text files to analyze and ask questions about.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-neutral-600 hover:border-neutral-500'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
            {isDragActive ? (
              <p className="text-blue-400">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-neutral-300 mb-2">
                  Drag & drop files here, or click to select files
                </p>
                <p className="text-sm text-neutral-500">
                  Supports PDF, DOCX, CSV, images, and text files (max 50MB each)
                </p>
              </div>
            )}
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-neutral-300">Uploaded Files</h4>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {uploadedFiles.map((uploadedFile, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getFileIcon(uploadedFile.file.type)}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-neutral-200 truncate">
                          {uploadedFile.file.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatFileSize(uploadedFile.file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-neutral-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={uploadedFiles.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Upload {uploadedFiles.length} {uploadedFiles.length === 1 ? 'File' : 'Files'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 