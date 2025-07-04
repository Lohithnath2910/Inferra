'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { uploadPDF } from '@/lib/api';

interface PDFUploaderProps {
  onUploadSuccess: (filename: string) => void;
}

export default function PDFUploader({ onUploadSuccess }: PDFUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 20;
      });
    }, 200);

    try {
      const response = await uploadPDF(file);
      setUploadProgress(100);
      // Accept any response with a filename as success
      if (response && response.filename) {
        setTimeout(() => {
          onUploadSuccess(response.filename!);
        }, 500);
      } else {
        setError(response.message || 'Upload succeeded but no filename returned.');
      }
    } catch (err: any) {
      setError(err?.message || 'Upload failed');
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div className="w-full" id="upload">
      <Card className={`relative overflow-hidden border-2 border-dashed transition-all duration-300 ${
        isDragActive 
          ? 'border-primary bg-primary/5 scale-105' 
          : 'border-border hover:border-primary/50 hover:bg-primary/2'
      } ${isUploading ? 'border-primary/50 bg-primary/5' : ''}`}>
        
        {/* Progress bar */}
        {isUploading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        <CardContent className="p-6 sm:p-8 lg:p-12">
          <div
            {...getRootProps()}
            className={`text-center cursor-pointer transition-all duration-300 ${
              isDragActive ? 'scale-105' : ''
            } ${isUploading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-102'}`}
          >
            <input {...getInputProps()} />
            
            <div className="flex flex-col items-center space-y-4 sm:space-y-6">
              {/* Icon Section */}
              <div className="relative">
                {isUploading ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-2xl sm:rounded-3xl blur-md sm:blur-lg animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-primary to-primary/80 p-4 sm:p-6 rounded-2xl sm:rounded-3xl">
                      <Loader2 className="h-8 w-8 sm:h-10 lg:h-12 sm:w-10 lg:w-12 text-primary-foreground animate-spin" />
                    </div>
                  </div>
                ) : uploadProgress === 100 ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-400/20 rounded-2xl sm:rounded-3xl blur-md sm:blur-lg"></div>
                    <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-4 sm:p-6 rounded-2xl sm:rounded-3xl">
                      <CheckCircle className="h-8 w-8 sm:h-10 lg:h-12 sm:w-10 lg:w-12 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 rounded-2xl sm:rounded-3xl blur-md sm:blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-br from-muted to-muted/80 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-dashed border-primary/30 group-hover:border-primary/50 transition-all duration-300">
                      <FileText className="h-8 w-8 sm:h-10 lg:h-12 sm:w-10 lg:w-12 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                      <Upload className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-6 sm:w-6 text-primary bg-background rounded-full p-0.5 sm:p-1 shadow-lg" />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Text Section */}
              <div className="space-y-3 sm:space-y-4 max-w-md px-2">
                <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                  {isUploading ? (
                    <span className="flex items-center justify-center gap-2 flex-wrap">
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 animate-spin flex-shrink-0" />
                      <span>Processing PDF...</span>
                    </span>
                  ) : uploadProgress === 100 ? (
                    'Upload Complete!'
                  ) : isDragActive ? (
                    'Drop your PDF here'
                  ) : (
                    'Upload your PDF document'
                  )}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {isUploading ? (
                    `Uploading... ${Math.round(uploadProgress)}%`
                  ) : uploadProgress === 100 ? (
                    'Your document has been processed successfully'
                  ) : isDragActive ? (
                    'Release to upload your PDF file'
                  ) : (
                    'Drag and drop your PDF file here, or click the button below to browse and select from your device'
                  )}
                </p>
              </div>
              
              {/* Button Section */}
              {!isUploading && uploadProgress !== 100 && (
                <Button 
                  size="lg" 
                  className="btn-primary h-10 sm:h-12 px-6 sm:px-8 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                >
                  <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                  <span>Choose PDF File</span>
                </Button>
              )}

              {/* File type info */}
              {!isUploading && uploadProgress !== 100 && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Supports PDF files up to 10MB</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {error && (
        <Alert variant="destructive" className="mt-4 sm:mt-6 border-2">
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          <AlertDescription className="text-sm sm:text-base font-medium">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}