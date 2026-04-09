import React from 'react';
import PropTypes from 'prop-types';
import styles from './DeleteConfirmationModal.module.css';

const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete chat?",
    chatTitle = "",
    isLoading = false
}) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal} role="dialog" aria-modal="true">
                <div className={styles.content}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.message}>
                        This will delete <span className={styles.chatName}>{chatTitle}</span>.
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
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

DeleteConfirmationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string,
    chatTitle: PropTypes.string,
    isLoading: PropTypes.bool
};

export default DeleteConfirmationModal;
