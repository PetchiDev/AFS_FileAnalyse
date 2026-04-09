
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/common/Button';
import CopyIcon from '@/assets/icons/Copy.svg';
import styles from './ShareReport.module.css';
import { toast } from 'react-toastify';

import { createPortal } from 'react-dom';

const ShareReport = ({ isOpen, onClose, reportId, type = 'chat' }) => {
  const [copied, setCopied] = useState(false);
  const path = type === 'research' ? 'public/research-report' : 'public/report';
  const shareLink = typeof window !== 'undefined' ? `${window.location.origin}/${path}/${reportId}` : '';

  const handleCopy = () => {
    if (shareLink && reportId) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } else if (!reportId) {
      toast.error('No report link available to copy.');
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Share Report</h2>
          <button className={styles.closeIconBtn} onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <p className={styles.subtitle}>Share this analysis with colleagues in your organization.</p>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Secure Link</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={shareLink}
              readOnly
              className={styles.input}
            />
            <button className={styles.copyButton} onClick={handleCopy}>
              <img src={CopyIcon} alt="Copy" style={{ width: 16, height: 16 }} className={styles.copyIcon} />
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

ShareReport.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  reportId: PropTypes.string,
  type: PropTypes.string
};

export default ShareReport;
