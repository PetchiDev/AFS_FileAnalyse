import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Maximize2, 
  Minimize2, 
  Mail, 
  AlertCircle, 
  User, 
  Clock, 
  Hash, 
  Paperclip, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import MsgReaderLib from '@kenjiuno/msgreader';
import { getSafeViewerUrl, getFileExtension, isViewableInline } from '@/utils/fileUtils';
import styles from './DocumentViewer.module.css';

// CJS interop: @kenjiuno/msgreader exports the class as `.default` on the module object
const MsgReader = MsgReaderLib?.default ?? MsgReaderLib;

/* ─── MSG Parser Hook ─────────────────────────────────────────── */
const useMsgParser = (file, isMsgFile) => {
  const [msgData, setMsgData] = useState(null);
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgError, setMsgError] = useState(null);

  useEffect(() => {
    if (!isMsgFile || !file?.url) return;

    let cancelled = false;
    setMsgLoading(true);
    setMsgData(null);
    setMsgError(null);

    (async () => {
      try {
        const response = await fetch(file.url);
        if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);
        const arrayBuffer = await response.arrayBuffer();

        const reader = new MsgReader(arrayBuffer);
        const info = reader.getFileData();

        if (!cancelled) setMsgData(info);
      } catch (err) {
        if (!cancelled) setMsgError(err.message || 'Failed to parse MSG file');
      } finally {
        if (!cancelled) setMsgLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [isMsgFile, file?.url]);

  return { msgData, msgLoading, msgError };
};

/* ─── MSG Viewer Sub-component ────────────────────────────────── */
const MsgViewer = ({ msgData }) => {
  const [showAttachments, setShowAttachments] = useState(false);

  const from = msgData.senderName
    ? `${msgData.senderName} <${msgData.senderEmail || ''}>`
    : (msgData.senderEmail || '—');

  const recipients = (msgData.recipients || [])
    .map(r => r.name ? `${r.name} <${r.email || ''}>` : (r.email || ''))
    .join(', ') || '—';

  const attachments = msgData.attachments || [];
  const bodyHtml = msgData.bodyHtml || '';
  const bodyText = msgData.body || '';

  return (
    <div className={styles.msgViewer}>
      {/* Email Header Card */}
      <div className={styles.msgHeaderCard}>
        <div className={styles.msgSubjectRow}>
          <Mail size={20} className={styles.msgSubjectIcon} />
          <h2 className={styles.msgSubject}>{msgData.subject || '(No Subject)'}</h2>
        </div>

        <div className={styles.msgMetaGrid}>
          <div className={styles.msgMetaItem}>
            <User size={14} className={styles.msgMetaIcon} />
            <span className={styles.msgMetaLabel}>From</span>
            <span className={styles.msgMetaValue}>{from}</span>
          </div>

          <div className={styles.msgMetaItem}>
            <User size={14} className={styles.msgMetaIcon} />
            <span className={styles.msgMetaLabel}>To</span>
            <span className={styles.msgMetaValue}>{recipients}</span>
          </div>

          {msgData.creationTime && (
            <div className={styles.msgMetaItem}>
              <Clock size={14} className={styles.msgMetaIcon} />
              <span className={styles.msgMetaLabel}>Date</span>
              <span className={styles.msgMetaValue}>
                {new Date(msgData.creationTime).toLocaleString()}
              </span>
            </div>
          )}

          {msgData.messageId && (
            <div className={styles.msgMetaItem}>
              <Hash size={14} className={styles.msgMetaIcon} />
              <span className={styles.msgMetaLabel}>Message-ID</span>
              <span className={`${styles.msgMetaValue} ${styles.msgMetaSmall}`}>{msgData.messageId}</span>
            </div>
          )}

          {attachments.length > 0 && (
            <div className={styles.msgMetaItem}>
              <Paperclip size={14} className={styles.msgMetaIcon} />
              <span className={styles.msgMetaLabel}>Attachments</span>
              <button
                className={styles.msgAttachToggle}
                onClick={() => setShowAttachments(!showAttachments)}
              >
                {attachments.length} file{attachments.length !== 1 ? 's' : ''}
                {showAttachments ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>
          )}
        </div>

        {/* Attachments list */}
        {showAttachments && attachments.length > 0 && (
          <div className={styles.msgAttachList}>
            {attachments.map((att, i) => (
              <div key={i} className={styles.msgAttachItem}>
                <Paperclip size={12} />
                <span>{att.fileName || att.name || `Attachment ${i + 1}`}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Email Body */}
      <div className={styles.msgBody}>
        {bodyHtml ? (
          <iframe
            srcDoc={bodyHtml}
            className={styles.msgBodyFrame}
            title="Email Body"
            sandbox="allow-same-origin"
          />
        ) : bodyText ? (
          <pre className={styles.msgBodyText}>{bodyText}</pre>
        ) : (
          <p className={styles.msgEmptyBody}>This email has no body content.</p>
        )}
      </div>
    </div>
  );
};

/* ─── Main DocumentViewer ─────────────────────────────────────── */
const DocumentViewer = ({ file, onClose, isEmbedded = false }) => {
  // ── All hooks MUST be declared before any conditional return ──
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Derive values safely
  const ext = file ? getFileExtension(file.name) : '';
  const isMsgFile = ext === 'msg';
  const canViewInline = file ? isViewableInline(file.name) : false;
  const viewerUrl = canViewInline ? getSafeViewerUrl(file?.url) : '';

  const { msgData, msgLoading, msgError } = useMsgParser(file, isMsgFile);

  // Safe to early-return AFTER all hooks
  if (!file) return null;

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  const handleDownload = () => window.open(file.url, '_blank');

  return (
    <div className={`${styles.viewerOverlay} ${isFullscreen ? styles.fullscreen : ''} ${isEmbedded ? styles.embedded : ''}`}>
      <div className={styles.viewerHeader}>
        <div className={styles.fileInfo}>
          <span className={styles.fileName}>{file.name}</span>
          {file.size && <span className={styles.fileSize}>{file.size}</span>}
        </div>
        <div className={styles.viewerActions}>
          {(canViewInline || isMsgFile) && (
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
          msgLoading ? (
            <div className={styles.loaderWrapper}>
              <div className={styles.loader}></div>
              <p>Parsing email...</p>
            </div>
          ) : msgError ? (
            <div className={styles.msgFallback}>
              <div className={styles.msgIconContainer}>
                <AlertCircle size={64} strokeWidth={1.2} />
              </div>
              <h3 className={styles.msgTitle}>Could Not Parse Email</h3>
              <p className={styles.msgFileName}>{file.name}</p>
              <p className={styles.msgDescription}>{msgError}</p>
              <button className={styles.msgDownloadBtn} onClick={handleDownload}>
                <Download size={18} />
                Download File
              </button>
            </div>
          ) : msgData ? (
            <MsgViewer msgData={msgData} />
          ) : null
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
              allow="fullscreen"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              width="100%"
              height="100%"
              loading="lazy"
            >
              <p>Your browser does not support iframes.</p>
            </iframe>
          </>
        ) : (
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
