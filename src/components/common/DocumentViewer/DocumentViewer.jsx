import React, { useState } from 'react';
import { X, ExternalLink, Download, Maximize2, Minimize2 } from 'lucide-react';
import { getSafeViewerUrl } from '@/utils/fileUtils';
import styles from './DocumentViewer.module.css';

const DocumentViewer = ({ file, onClose, isEmbedded = false }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!file) return null;

  const viewerUrl = getSafeViewerUrl(file.url);
  const isPdf = file.name.toLowerCase().endsWith('.pdf');

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`${styles.viewerOverlay} ${isFullscreen ? styles.fullscreen : ''} ${isEmbedded ? styles.embedded : ''}`}>
      <div className={styles.viewerHeader}>
        <div className={styles.fileInfo}>
          <span className={styles.fileName}>{file.name}</span>
          <span className={styles.fileSize}>{file.size}</span>
        </div>
        <div className={styles.viewerActions}>
          <button 
            className={styles.actionBtn} 
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button 
            className={styles.actionBtn} 
            onClick={() => window.open(file.url, '_blank')}
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
      </div>
    </div>
  );
};

export default DocumentViewer;
