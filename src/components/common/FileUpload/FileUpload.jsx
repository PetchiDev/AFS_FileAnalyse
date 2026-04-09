import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FILE_UPLOAD } from '@/config/constants';
import styles from './FileUpload.module.css';
import DeleteIcon from '@/assets/icons/Delete.svg';

const FileUpload = ({
  onFileSelect = null,
  onFileChange = null,
  accept = FILE_UPLOAD.ALLOWED_DOCUMENT_EXTENSIONS.join(','),
  multiple = false,
  maxSize = FILE_UPLOAD.MAX_FILE_SIZE,
  allowedTypes = FILE_UPLOAD.ALLOWED_DOCUMENT_TYPES,
  uploadText = FILE_UPLOAD.UPLOAD_TEXT,
  supportedFormatsText = FILE_UPLOAD.SUPPORTED_FORMATS_TEXT,
  disabled = false,
  width = null,
  height = null,
  radius = null,
  border = null,
  className = '',
  selectedFile = null,
  onRemove = null,
  ...rest
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  const validateFile = (file) => {
    if (file.size > maxSize) {
      setError(`File size exceeds ${(maxSize / 1048576).toFixed(0)}MB limit`);
      return false;
    }

    const fileType = file.type;
    const isValidType = allowedTypes.some((type) => fileType === type);

    if (!isValidType) {
      setError(`File type not supported. Allowed: ${supportedFormatsText}`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => validateFile(file));

    if (validFiles.length > 0) {
      if (onFileSelect) {
        onFileSelect(multiple ? validFiles : validFiles[0]);
      }
      if (onFileChange) {
        onFileChange(multiple ? validFiles : validFiles[0]);
      }
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current && !selectedFile) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (event) => {
    const files = event.target.files;
    handleFileSelect(files);
    event.target.value = '';
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled && !selectedFile) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (disabled || selectedFile) return;

    const files = event.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
    // Clear the input value so the same file can be selected again if needed
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const inlineStyles = {};

  if (width) inlineStyles.width = width;
  if (height) inlineStyles.height = height;
  if (radius !== null) inlineStyles.borderRadius = radius;
  if (border) inlineStyles.border = border;

  const containerClasses = [
    styles.fileUploadContainer,
    isDragging && styles.dragging,
    disabled && styles.disabled,
    selectedFile && styles.hasFile,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.wrapper}>
      <div
        className={containerClasses}
        style={Object.keys(inlineStyles).length > 0 ? inlineStyles : undefined}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        {...rest}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled || !!selectedFile}
          onChange={handleInputChange}
          className={styles.fileInput}
          aria-label={uploadText}
        />
        
        {selectedFile ? (
          <div className={styles.fileDisplay}>
            <span className={styles.fileName}>{selectedFile.name}</span>
            <button 
              type="button" 
              className={styles.removeButton} 
              onClick={handleRemove}
              aria-label="Remove file"
            >
              <img src={DeleteIcon} alt="Remove" />
            </button>
          </div>
        ) : (
          <div className={styles.uploadContent}>
            <div className={styles.uploadIcon}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 16V4M12 4L8 8M12 4L16 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 16.5C20 18.9853 17.9853 21 15.5 21H8.5C6.01472 21 4 18.9853 4 16.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className={styles.uploadText}>{uploadText}</p>
            <p className={styles.supportedFormats}>{supportedFormatsText}</p>
          </div>
        )}
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

FileUpload.propTypes = {
  onFileSelect: PropTypes.func,
  onFileChange: PropTypes.func,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  maxSize: PropTypes.number,
  allowedTypes: PropTypes.arrayOf(PropTypes.string),
  uploadText: PropTypes.string,
  supportedFormatsText: PropTypes.string,
  disabled: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  border: PropTypes.string,
  className: PropTypes.string
};

export default FileUpload;

