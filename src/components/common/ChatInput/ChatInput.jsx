import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './ChatInput.module.css';
import SearchIcon from '@/assets/icons/Search.svg';
import PlusIcon from '@/assets/icons/Plus.svg';
import SettingsIcon from '@/assets/icons/Settings.svg';

const ChatInput = ({
  onSend,
  onSettingsClick,
  placeholder = "Type a message...",
  disabled = false,
  maxLength = 1000,
  hasMessages = false,
  showActions = true
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  // Auto-grow textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [inputValue]);

  // Handle click outside of upload menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUploadMenu(false);
      }
    };

    if (showUploadMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUploadMenu]);

  const handleSend = () => {
    const hasContent = inputValue.trim().length > 0 || selectedFiles.length > 0;
    if (hasContent && !disabled) {
      onSend(inputValue.trim(), selectedFiles);
      setInputValue('');
      setSelectedFiles([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = files.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        name: file.name
      }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
      setShowUploadMenu(false);
    }
    e.target.value = '';
  };

  const removeFile = (id) => {
    setSelectedFiles(prev => {
      const removed = prev.find(f => f.id === id);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return prev.filter(f => f.id !== id);
    });
  };

  return (
    <div className={`${styles.chatInputContainer} ${hasMessages ? styles.chatInputContainerWithMessages : ''}`}>
      {selectedFiles.length > 0 && (
        <div className={styles.filePreviewContainer}>
          {selectedFiles.map(file => (
            <div key={file.id} className={styles.filePreviewItem}>
              {file.preview ? (
                <img src={file.preview} alt="preview" className={styles.fileThumbnail} />
              ) : (
                <div className={styles.filePlaceholder}>{file.name.split('.').pop().toUpperCase()}</div>
              )}
              <button
                className={styles.removeFileButton}
                onClick={() => removeFile(file.id)}
                aria-label="Remove file"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.inputWrapper}>
        {showActions && (
          <div className={styles.leftActions} ref={menuRef}>
            <button
              className={styles.plusButton}
              onClick={() => setShowUploadMenu(!showUploadMenu)}
              disabled={disabled}
              type="button"
              aria-label="Upload options"
            >
              <img src={PlusIcon} alt="Add" className={styles.plusIcon} />
            </button>

            <button
              className={styles.settingsButton}
              onClick={onSettingsClick}
              disabled={disabled}
              aria-label="Analysis settings"
            >
              <img src={SettingsIcon} alt="Settings" className={styles.settingsIcon} />
            </button>

            {showUploadMenu && (
              <div className={styles.uploadMenu}>
                <button className={styles.menuItem} onClick={() => fileInputRef.current.click()}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"></path>
                  </svg>
                  <span>Upload files</span>
                </button>
              </div>
            )}
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          multiple
          onChange={handleFileChange}
        />

        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={styles.inputField}
          disabled={disabled}
          maxLength={maxLength}
          rows={1}
        />

        <button
          className={styles.sendButton}
          onClick={handleSend}
          disabled={disabled || (!inputValue.trim() && selectedFiles.length === 0)}
          aria-label="Send message"
        >
          <img src={SearchIcon} alt="Send" className={styles.searchIcon} />
        </button>
      </div>
    </div >
  );
};

ChatInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  onSettingsClick: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
  hasMessages: PropTypes.bool,
  showActions: PropTypes.bool
};

export default ChatInput;

