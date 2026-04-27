/**
 * Generate a Microsoft Office Viewer URL for a given SAS URL
 * @param {string} sasUrl - The direct SAS URL to the blob
 * @returns {string} The wrapped Office Viewer URL or the original URL if not a document
 */
export const getSafeViewerUrl = (sasUrl) => {
    if (!sasUrl) return '';
    
    // Check if it's already a viewer URL
    if (sasUrl.includes('view.officeapps.live.com')) return sasUrl;

    // Extract the file path without query params to check extension
    const filePath = sasUrl.split('?')[0];
    
    // Check if it's an Office document (docx, doc, pptx, ppt, xlsx, xls)
    const isOfficeDoc = /\.(docx|doc|pptx|ppt|xlsx|xls)$/i.test(filePath);
    
    if (isOfficeDoc) {
        return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(sasUrl)}&wdMobileHost=2`;
    }
    
    // For PDFs, return the raw SAS URL - browser can render natively
    return sasUrl;
};

/**
 * Get file extension from a filename
 * @param {string} filename - File name string
 * @returns {string} Lowercase extension without dot
 */
export const getFileExtension = (filename) => {
    if (!filename) return '';
    return filename.split('.').pop().toLowerCase();
};

/**
 * Get file type category from filename
 * @param {string} filename - File name string
 * @returns {'pdf' | 'docx' | 'doc' | 'msg' | 'xlsx' | 'xls' | 'unknown'}
 */
export const getFileType = (filename) => {
    const ext = getFileExtension(filename);
    const supported = ['pdf', 'docx', 'doc', 'msg', 'xlsx', 'xls'];
    return supported.includes(ext) ? ext : 'unknown';
};

/**
 * Format file size from bytes or return a string directly
 * @param {number|string} size - Bytes number or already formatted string
 * @returns {string} Formatted size string
 */
export const formatFileSize = (size) => {
    if (typeof size === 'string') return size;
    if (!size || size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if a file type can be displayed inline in the viewer
 * @param {string} filename - File name string
 * @returns {boolean}
 */
export const isViewableInline = (filename) => {
    const ext = getFileExtension(filename);
    // PDF/MSG can be displayed natively/locally, DOCX/DOC via Office Online
    return ['pdf', 'docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt', 'msg'].includes(ext);
};
