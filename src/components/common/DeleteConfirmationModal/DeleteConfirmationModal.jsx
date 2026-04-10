import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { AlertTriangle, X } from 'lucide-react';
import styles from './DeleteConfirmationModal.module.css';

const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete Processing?",
    itemTitle = "",
    isLoading = false
}) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const modalContent = (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal} role="dialog" aria-modal="true">
                <button 
                  className={styles.closeBtn} 
                  onClick={onClose}
                  disabled={isLoading}
                  title="Close"
                >
                  <X size={20} />
                </button>

                <div className={styles.content}>
                    <div className={styles.iconWrapper}>
                      <AlertTriangle size={32} />
                    </div>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.message}>
                        Are you sure you want to delete <span className={styles.itemName}>{itemTitle}</span>? This action cannot be undone.
                    </p>
                </div>

                <div className={styles.footer}>
                    <button
                        className={styles.cancelButton}
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Deleting...' : 'Delete Permanently'}
                    </button>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

DeleteConfirmationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string,
    itemTitle: PropTypes.string,
    isLoading: PropTypes.bool
};

export default DeleteConfirmationModal;
