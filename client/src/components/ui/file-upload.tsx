import { useState, useRef, useCallback, DragEvent, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Image as ImageIcon, File, X, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { apiRequest } from "@/lib/queryClient";

export interface UploadedFile {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
}

export interface FileUploadProps {
  onFileUpload?: (file: UploadedFile) => void;
  onMultipleFilesUpload?: (files: UploadedFile[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
  showPreview?: boolean;
  previewMaxHeight?: number;
  className?: string;
}

export function FileUpload({
  onFileUpload,
  onMultipleFilesUpload,
  multiple = false,
  maxFiles = 10,
  acceptedFileTypes = "image/*",
  maxSizeMB = 5,
  showPreview = true,
  previewMaxHeight = 200,
  className = "",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0); // Track drag events for better handling
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  // Handle drag over event
  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  // Handle drag enter with counter to track multiple events
  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prevCount => prevCount + 1);
    setIsDragging(true);
  }, []);

  // Handle drag leave with counter
  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prevCount => {
      const newCount = prevCount - 1;
      if (newCount === 0) {
        setIsDragging(false);
      }
      return newCount;
    });
  }, []);

  const validateFiles = (files: File[]): { valid: File[], errors: string[] } => {
    const validFiles: File[] = [];
    const errors: string[] = [];
    
    // Check number of files
    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      return { valid: validFiles, errors };
    }
    
    // Check each file
    Array.from(files).forEach(file => {
      // Check file size
      if (file.size > maxSizeBytes) {
        errors.push(`"${file.name}" exceeds maximum size of ${maxSizeMB}MB`);
        return;
      }
      
      // Check file type if specified
      if (acceptedFileTypes !== "*") {
        // Handle multiple file types separated by commas
        const types = acceptedFileTypes.split(',');
        const isAccepted = types.some(type => {
          // Handle image/* format
          if (type.includes('/*')) {
            const category = type.split('/')[0];
            return file.type.startsWith(`${category}/`);
          }
          // Handle specific extensions (.pdf, .docx, etc.)
          else if (type.startsWith('.')) {
            const extension = type.toLowerCase();
            return file.name.toLowerCase().endsWith(extension);
          }
          // Handle specific mime types
          else {
            return file.type === type;
          }
        });
        
        if (!isAccepted) {
          errors.push(`"${file.name}" has an unsupported file type`);
          return;
        }
      }
      
      validFiles.push(file);
    });
    
    return { valid: validFiles, errors };
  };

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      const formData = new FormData();
      
      if (multiple) {
        files.forEach(file => {
          formData.append('images', file);
        });
        
        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev === null) return 0;
            return prev >= 90 ? 90 : prev + 10;
          });
        }, 200);
        
        // Upload multiple files
        const response = await apiRequest('POST', '/api/upload/multiple', formData);
        clearInterval(progressInterval);
        
        const data = await response.json();
        
        if (response.ok) {
          setUploadProgress(100);
          setUploadedFiles(data.files);
          if (onMultipleFilesUpload) {
            onMultipleFilesUpload(data.files);
          }
        } else {
          throw new Error(data.message || 'Error uploading files');
        }
      } else {
        // Single file upload
        formData.append('image', files[0]);
        
        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev === null) return 0;
            return prev >= 90 ? 90 : prev + 10;
          });
        }, 200);
        
        // Single file upload with our updated apiRequest that can handle FormData
        const response = await apiRequest('POST', '/api/upload', formData);
        clearInterval(progressInterval);
        
        const data = await response.json();
        
        if (response.ok) {
          setUploadProgress(100);
          setUploadedFiles([data.file]);
          if (onFileUpload) {
            onFileUpload(data.file);
          }
        } else {
          throw new Error(data.message || 'Error uploading file');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setUploadProgress(null);
    } finally {
      setUploading(false);
      setTimeout(() => {
        setUploadProgress(null);
      }, 3000);
    }
  };

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0); // Reset drag counter
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      
      // Filter out folders (which will have size of 0 and no type)
      const filteredFiles = droppedFiles.filter(file => file.size > 0 || file.type !== '');
      
      if (filteredFiles.length === 0) {
        setError('No valid files were dropped. Folders cannot be uploaded.');
        return;
      }
      
      const { valid, errors } = validateFiles(filteredFiles);
      
      if (errors.length > 0) {
        setError(errors.join(', '));
        return;
      }
      
      uploadFiles(valid);
    }
  }, [maxFiles, maxSizeBytes, acceptedFileTypes, multiple, onFileUpload, onMultipleFilesUpload]);

  const handleFileInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const { valid, errors } = validateFiles(selectedFiles);
      
      if (errors.length > 0) {
        setError(errors.join(', '));
        return;
      }
      
      uploadFiles(valid);
    }
  }, [maxFiles, maxSizeBytes, acceptedFileTypes, multiple, onFileUpload, onMultipleFilesUpload]);

  const handleBrowseClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const removeFile = useCallback((indexToRemove: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(indexToRemove, 1);
      
      // Notify parent component
      if (multiple && onMultipleFilesUpload) {
        onMultipleFilesUpload(newFiles);
      } else if (!multiple && newFiles.length > 0 && onFileUpload) {
        onFileUpload(newFiles[0]);
      }
      
      return newFiles;
    });
  }, [multiple, onFileUpload, onMultipleFilesUpload]);

  const clearAll = useCallback(() => {
    setUploadedFiles([]);
    if (multiple && onMultipleFilesUpload) {
      onMultipleFilesUpload([]);
    }
  }, [multiple, onMultipleFilesUpload]);

  const isImage = (mimetype: string) => mimetype.startsWith('image/');

  return (
    <div className={`w-full ${className}`}>
      {/* Error display */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Upload area */}
      <Card 
        className={`border-2 border-dashed 
          ${isDragging 
            ? 'border-primary bg-primary/10 shadow-lg ring-2 ring-primary/30' 
            : 'border-gray-300 hover:border-primary/50 hover:bg-primary/5'
          } 
          transition-all duration-200 rounded-lg`}
      >
        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="relative"
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileInputChange}
            accept={acceptedFileTypes}
            multiple={multiple}
          />
          
          <CardContent className="p-8 text-center">
            {uploadedFiles.length === 0 ? (
              <div className="py-10 flex flex-col items-center justify-center">
                <div className={`mb-4 p-5 rounded-full transition-all 
                  ${isDragging 
                    ? 'bg-primary/30 scale-110 shadow-md' 
                    : 'bg-primary/10 hover:bg-primary/20'
                  }`}>
                  <Upload 
                    className={`h-10 w-10 transition-all 
                      ${isDragging ? 'text-primary animate-bounce' : 'text-primary'}`} 
                  />
                </div>
                <h3 className={`text-xl font-semibold mb-1 transition-all
                  ${isDragging ? 'scale-110 text-primary' : ''}`}
                >
                  {isDragging 
                    ? `Drop your ${multiple ? 'files' : 'file'} here` 
                    : `Drag & drop your ${multiple ? 'files' : 'file'} here`
                  }
                </h3>
                <p className="text-gray-500 mb-4 text-sm">or</p>
                <Button
                  type="button"
                  onClick={handleBrowseClick}
                  disabled={uploading}
                  className="relative overflow-hidden group"
                >
                  <span className="relative z-10">Browse Files</span>
                  <span className="absolute inset-0 bg-primary/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                </Button>
                <p className="text-xs text-gray-500 mt-4">
                  {multiple ? `Up to ${maxFiles} files` : 'One file'}, max {maxSizeMB}MB each
                </p>
                {acceptedFileTypes !== "*" && (
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: {acceptedFileTypes.includes('image/*') ? 
                      'images (JPG, PNG, GIF, WebP, SVG, BMP, TIFF)' : 
                      acceptedFileTypes.replace(/\*/g, 'all')}
                    {acceptedFileTypes.includes('.pdf') && ' and documents (PDF, DOC, DOCX, etc)'}
                  </p>
                )}
              </div>
            ) : (
              <div className="py-2 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Uploaded {multiple ? `Files (${uploadedFiles.length})` : 'File'}</h3>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleBrowseClick}
                      disabled={uploading}
                      className="flex items-center gap-1"
                    >
                      <Upload className="h-4 w-4" />
                      Upload More
                    </Button>
                    {multiple && uploadedFiles.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:text-red-700 flex items-center gap-1"
                        onClick={clearAll}
                        disabled={uploading}
                      >
                        <XCircle className="h-4 w-4" />
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>
                
                <div 
                  className={`grid gap-3 ${multiple ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
                  onDragOver={e => e.preventDefault()}
                >
                  {uploadedFiles.map((file, index) => (
                    <div 
                      key={file.filename} 
                      className="relative border border-gray-200 shadow-sm hover:shadow-md rounded-md p-3 flex items-center gap-3 group transition-all hover:border-primary/50"
                      draggable={multiple}
                      onDragStart={multiple ? (e) => {
                        e.dataTransfer.setData('application/json', JSON.stringify({ index }));
                        e.currentTarget.classList.add('opacity-50', 'border-primary');
                      } : undefined}
                      onDragOver={multiple ? (e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('border-primary', 'bg-primary/5');
                      } : undefined}
                      onDragLeave={multiple ? (e) => {
                        e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
                      } : undefined}
                      onDragEnd={multiple ? (e) => {
                        e.currentTarget.classList.remove('opacity-50', 'border-primary');
                      } : undefined}
                      onDrop={multiple ? (e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
                        const sourceIndex = JSON.parse(e.dataTransfer.getData('application/json')).index;
                        
                        if (sourceIndex !== index) {
                          const newFiles = [...uploadedFiles];
                          const [movedFile] = newFiles.splice(sourceIndex, 1);
                          newFiles.splice(index, 0, movedFile);
                          setUploadedFiles(newFiles);
                          
                          if (multiple && onMultipleFilesUpload) {
                            onMultipleFilesUpload(newFiles);
                          }
                        }
                      } : undefined}
                    >
                      <div className="flex-shrink-0">
                        {showPreview && isImage(file.mimetype) ? (
                          <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100 border">
                            <img 
                              src={file.url} 
                              alt={file.originalName}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              style={{ maxHeight: previewMaxHeight }}
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-16 flex items-center justify-center rounded-md bg-gray-100 border">
                            {isImage(file.mimetype) ? (
                              <ImageIcon className="h-8 w-8 text-gray-400" />
                            ) : (
                              <File className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary">
                          {file.originalName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(0)} KB
                        </p>
                        {multiple && (
                          <p className="text-xs text-gray-400 italic mt-1">
                            Drag to reorder
                          </p>
                        )}
                      </div>
                      
                      <button
                        type="button"
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
                        onClick={() => removeFile(index)}
                        disabled={uploading}
                        title="Remove file"
                      >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Remove</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          
          {/* Upload progress indicator */}
          {uploadProgress !== null && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10 transition-all duration-300">
              <div className="w-3/4 mb-4">
                <Progress 
                  value={uploadProgress} 
                  className={`h-3 transition-all duration-300 ${uploadProgress === 100 ? 'bg-green-100' : 'bg-primary/10'}`} 
                />
              </div>
              <p className={`text-sm font-medium transition-all duration-300 ${uploadProgress === 100 ? 'text-green-600' : 'text-primary'}`}>
                {uploadProgress < 100 ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading... {uploadProgress}%
                  </span>
                ) : (
                  <span className="flex items-center text-green-600 animate-pulse">
                    <CheckCircle className="h-5 w-5 mr-2 animate-bounce" /> 
                    {multiple ? 'Files uploaded successfully!' : 'File uploaded successfully!'}
                  </span>
                )}
              </p>
              
              {uploadProgress === 100 && (
                <div className="mt-3 text-xs text-gray-500">
                  This message will disappear in a moment...
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}