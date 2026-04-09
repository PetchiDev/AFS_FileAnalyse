import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { gsap } from 'gsap';
import { toast } from 'react-toastify';
import {
  FILE_UPLOAD,
  PROCESSING_STEPS_LIST,
  MESSAGES
} from '@/config/constants';
import styles from './Upload.module.css';

const Upload = () => {
  const router = useRouterState();
  const resetKey = router.location.search?.t;

  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  const [processedFileName, setProcessedFileName] = useState('');
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const heroRef = useRef(null);
  const cardRef = useRef(null);
  const dropzoneRef = useRef(null);
  const stepsRef = useRef(null);
  const successRef = useRef(null);

  const handleReset = useCallback(() => {
    setFiles([]);
    setIsComplete(false);
    setIsProcessing(false);
    setCurrentStep(-1);
    setProcessedFileName('');
    setError(null);
  }, []);

  // Reset all state when navigating to this page via sidebar (custom event)
  useEffect(() => {
    const onReset = () => {
      handleReset();
    };
    window.addEventListener('page:reset', onReset);
    return () => window.removeEventListener('page:reset', onReset);
  }, [handleReset]);

  // Handle URL reset key if still present for any legacy reason
  useEffect(() => {
    if (resetKey) {
      handleReset();
    }
  }, [resetKey, handleReset]);

  // GSAP entrance animation
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (heroRef.current) {
      tl.fromTo(
        heroRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      );
    }

    if (cardRef.current) {
      tl.fromTo(
        cardRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.3'
      );
    }
  }, []);

  // Animate steps when processing starts
  useEffect(() => {
    if (isProcessing && stepsRef.current) {
      gsap.fromTo(
        stepsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [isProcessing]);

  // Animate success state
  useEffect(() => {
    if (isComplete && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  }, [isComplete]);

  const validateFile = useCallback((file) => {
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    const isValidType = FILE_UPLOAD.ALLOWED_EXTENSIONS.includes(extension);
    const isValidSize = file.size <= FILE_UPLOAD.MAX_FILE_SIZE;

    if (!isValidType) {
      return { valid: false, error: MESSAGES.ERROR.INVALID_FILE };
    }
    if (!isValidSize) {
      return { valid: false, error: MESSAGES.ERROR.FILE_TOO_LARGE };
    }
    return { valid: true, error: null };
  }, []);

  const addFiles = useCallback((newFiles) => {
    const validFiles = [];
    let hasError = false;

    Array.from(newFiles).forEach((file) => {
      const validation = validateFile(file);
      if (validation.valid) {
        // Avoid duplicates
        const isDuplicate = files.some(
          (f) => f.name === file.name && f.size === file.size
        );
        if (!isDuplicate) {
          validFiles.push(file);
        }
      } else {
        hasError = true;
        toast.error(validation.error);
      }
    });

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
      setError(null);
    }
  }, [files, validateFile]);

  const removeFile = useCallback((index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleFileSelect = useCallback((e) => {
    addFiles(e.target.files);
    // Reset input so same file can be selected again
    e.target.value = '';
  }, [addFiles]);

  const handleClick = useCallback(() => {
    if (!isProcessing) {
      fileInputRef.current?.click();
    }
  }, [isProcessing]);

  const getFileExtension = (fileName) => {
    return fileName.split('.').pop().toUpperCase();
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf':
        return (
          <svg className={`${styles.fileTypeIcon} ${styles.pdfIcon}`} viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 15h6M9 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      case 'doc':
      case 'docx':
        return (
          <svg className={`${styles.fileTypeIcon} ${styles.docIcon}`} viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      case 'xls':
      case 'xlsx':
        return (
          <svg className={`${styles.fileTypeIcon} ${styles.xlsIcon}`} viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 13l3 4M11 13l-3 4M13 13h3M13 17h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      default:
        return (
          <svg className={styles.fileTypeIcon} viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const simulateProcessing = useCallback(() => {
    if (files.length === 0) {
      toast.error('Please select at least one file to process.');
      return;
    }

    setIsProcessing(true);
    setIsComplete(false);
    setError(null);
    setCurrentStep(0);

    const stepDurations = [1500, 2500, 2000, 1000];

    let stepIndex = 0;
    const advanceStep = () => {
      if (stepIndex < PROCESSING_STEPS_LIST.length - 1) {
        stepIndex++;
        setCurrentStep(stepIndex);
        setTimeout(advanceStep, stepDurations[stepIndex]);
      } else {
        // Processing complete
        setTimeout(() => {
          setIsProcessing(false);
          setIsComplete(true);
          setProcessedFileName(
            files.length === 1
              ? files[0].name.replace(/\.[^/.]+$/, '') + '_processed.xlsx'
              : `batch_${files.length}_files_processed.xlsx`
          );
          toast.success(MESSAGES.SUCCESS.PROCESSING);
        }, 800);
      }
    };

    setTimeout(advanceStep, stepDurations[0]);
  }, [files]);

  const handleDownload = useCallback(() => {
    toast.success(MESSAGES.SUCCESS.DOWNLOAD);
    // Reset state for new upload
    setTimeout(() => {
      setFiles([]);
      setIsComplete(false);
      setIsProcessing(false);
      setCurrentStep(-1);
      setProcessedFileName('');
    }, 1000);
  }, []);

  const getStepIcon = (step, index) => {
    const isActive = index === currentStep;
    const isCompleted = index < currentStep;

    if (isCompleted) {
      return (
        <svg className={styles.stepCheckIcon} viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }

    switch (step.icon) {
      case 'upload':
        return (
          <svg className={styles.stepIconSvg} viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'ai':
        return (
          <svg className={styles.stepIconSvg} viewBox="0 0 24 24" fill="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'template':
        return (
          <svg className={styles.stepIconSvg} viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M3 9h18M9 3v18" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case 'download':
        return (
          <svg className={styles.stepIconSvg} viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div ref={heroRef} className={styles.hero}>
        <div className={styles.heroIcon}>
          <svg viewBox="0 0 24 24" fill="none" className={styles.lightningIcon}>
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className={styles.heroTitle}>AI File Processor</h1>
        <p className={styles.heroSubtitle}>
          Upload your files and let AI analyze, process, and generate output documents.
        </p>
      </div>

      {/* Main Card */}
      <div ref={cardRef} className={styles.card}>
        {!isProcessing && !isComplete && (
          <>
            {/* Upload Section Header */}
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{FILE_UPLOAD.UPLOAD_TITLE}</h2>
              <p className={styles.sectionSubtitle}>{FILE_UPLOAD.UPLOAD_SUBTITLE}</p>
            </div>

            {/* Dropzone */}
            <div
              ref={dropzoneRef}
              className={`${styles.dropzone} ${isDragging ? styles.dropzoneDragging : ''} ${files.length > 0 ? styles.dropzoneHasFiles : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
              role="button"
              tabIndex={0}
              aria-label="File upload dropzone"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
            >
              <input
                ref={fileInputRef}
                type="file"
                className={styles.fileInput}
                onChange={handleFileSelect}
                accept={FILE_UPLOAD.ALLOWED_EXTENSIONS.join(',')}
                multiple
                aria-hidden="true"
              />

              <div className={styles.dropzoneContent}>
                <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="17,8 12,3 7,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className={styles.dropzoneText}>{FILE_UPLOAD.DRAG_TEXT}</p>
                <p className={styles.dropzoneFormats}>{FILE_UPLOAD.SUPPORTED_TEXT}</p>
                <div className={styles.formatBadges}>
                  {FILE_UPLOAD.FORMAT_LABELS.map((format) => (
                    <span key={format} className={styles.formatBadge}>{format}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className={styles.fileList}>
                {files.map((file, index) => (
                  <div key={`${file.name}-${index}`} className={styles.fileItem}>
                    <div className={styles.fileInfo}>
                      {getFileIcon(file.name)}
                      <div className={styles.fileDetails}>
                        <span className={styles.fileName}>{file.name}</span>
                        <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                    <button
                      className={styles.removeButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      aria-label={`Remove ${file.name}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" className={styles.removeIcon}>
                        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className={styles.errorMessage}>
                <svg className={styles.errorIcon} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Upload Button */}
            <button
              className={styles.uploadButton}
              onClick={simulateProcessing}
              disabled={files.length === 0}
              id="upload-analyze-btn"
            >
              <svg className={styles.uploadBtnIcon} viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="17,8 12,3 7,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {FILE_UPLOAD.UPLOAD_BUTTON}
            </button>
          </>
        )}

        {/* Processing Steps */}
        {isProcessing && (
          <div ref={stepsRef} className={styles.processingSection}>
            <h2 className={styles.processingTitle}>Processing your files...</h2>
            <p className={styles.processingSubtitle}>Please wait while AI analyzes your documents</p>

            <div className={styles.stepsContainer}>
              {PROCESSING_STEPS_LIST.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <div
                    key={step.id}
                    className={`${styles.step} ${isActive ? styles.stepActive : ''} ${isCompleted ? styles.stepCompleted : ''}`}
                  >
                    <div className={styles.stepIndicator}>
                      <div className={`${styles.stepCircle} ${isActive ? styles.stepCircleActive : ''} ${isCompleted ? styles.stepCircleCompleted : ''}`}>
                        {getStepIcon(step, index)}
                      </div>
                      {index < PROCESSING_STEPS_LIST.length - 1 && (
                        <div className={`${styles.stepLine} ${isCompleted ? styles.stepLineCompleted : ''}`} />
                      )}
                    </div>
                    <span className={`${styles.stepLabel} ${isActive ? styles.stepLabelActive : ''} ${isCompleted ? styles.stepLabelCompleted : ''}`}>
                      {step.label}
                    </span>
                    {isActive && (
                      <div className={styles.pulseLoader}>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className={styles.progressBarContainer}>
              <div
                className={styles.progressBar}
                style={{ width: `${((currentStep + 1) / PROCESSING_STEPS_LIST.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Success / Download */}
        {isComplete && (
          <div ref={successRef} className={styles.successSection}>
            <div className={styles.successIcon}>
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className={styles.successTitle}>Processing Complete!</h2>
            <p className={styles.successSubtitle}>Your file has been successfully processed and is ready for download.</p>
            <div className={styles.successFileCard}>
              <svg className={styles.successFileIcon} viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className={styles.successFileName}>{processedFileName}</span>
            </div>
            <div className={styles.successActions}>
              <button
                className={styles.downloadButton}
                onClick={handleDownload}
                id="download-file-btn"
              >
                <svg className={styles.downloadBtnIcon} viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download File
              </button>
              <button
                className={styles.resetButton}
                onClick={handleReset}
              >
                Upload Another File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
