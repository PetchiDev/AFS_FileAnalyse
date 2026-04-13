import React, { useState } from 'react';
import { X, Download, Maximize2, Minimize2, Mail, FileText, AlertCircle } from 'lucide-react';
import { getSafeViewerUrl, getFileExtension, isViewableInline } from '@/utils/fileUtils';
import styles from './DocumentViewer.module.css';

const DocumentViewer = ({ file, onClose, isEmbedded = false }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!file) return null;

  const ext = getFileExtension(file.name);
  const isMsgFile = ext === 'msg';
  const canViewInline = isViewableInline(file.name);
  const viewerUrl = canViewInline ? getSafeViewerUrl(file.url) : '';

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    // Open SAS URL in new tab to trigger download
    window.open(file.url, '_blank');
  };

  return (
    <div className={`${styles.viewerOverlay} ${isFullscreen ? styles.fullscreen : ''} ${isEmbedded ? styles.embedded : ''}`}>
      <div className={styles.viewerHeader}>
        <div className={styles.fileInfo}>
          <span className={styles.fileName}>{file.name}</span>
          {file.size && <span className={styles.fileSize}>{file.size}</span>}
        </div>
        <div className={styles.viewerActions}>
          {canViewInline && (
            <button 
              className={styles.actionBtn} 
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          )}
          <button 
            className={styles.actionBtn} 
            onClick={handleDownload}
            title="Download"
          >
            <Download size={18} />
          </button>
          <button className={styles.closeBtn} onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>
      </div>
      
      <div className={styles.viewerContent}>
        {isMsgFile ? (
          /* MSG files cannot be rendered in browser – show a styled fallback */
          <div className={styles.msgFallback}>
            <div className={styles.msgIconContainer}>
              <Mail size={64} strokeWidth={1.2} />
            </div>
            <h3 className={styles.msgTitle}>Email Message File</h3>
            <p className={styles.msgFileName}>{file.name}</p>
            <p className={styles.msgDescription}>
              MSG files cannot be previewed in the browser. 
              Please download the file and open it in Microsoft Outlook or a compatible email client.
            </p>
            <button className={styles.msgDownloadBtn} onClick={handleDownload}>
              <Download size={18} />
              Download File
            </button>
          </div>
        ) : canViewInline ? (
          <>
            {loading && (
              <div className={styles.loaderWrapper}>
                <div className={styles.loader}></div>
                <p>Loading document...</p>
              </div>
            )}
            <iframe
              src={viewerUrl}
              className={styles.iframe}
              title={file.name}
              onLoad={() => setLoading(false)}
              frameBorder="0"
            >
              <p>Your browser does not support iframes.</p>
            </iframe>
          </>
        ) : (
          /* Unsupported file type fallback */
          <div className={styles.msgFallback}>
            <div className={styles.msgIconContainer}>
              <AlertCircle size={64} strokeWidth={1.2} />
            </div>
            <h3 className={styles.msgTitle}>Preview Not Available</h3>
            <p className={styles.msgFileName}>{file.name}</p>
            <p className={styles.msgDescription}>
              This file type cannot be previewed in the browser.
              Please download the file to view it.
            </p>
            <button className={styles.msgDownloadBtn} onClick={handleDownload}>
              <Download size={18} />
              Download File
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;
