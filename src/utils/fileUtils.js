/**
 * Generate a Microsoft Office Viewer URL for a given SAS URL
 * @param {string} sasUrl - The direct SAS URL to the blob
 * @returns {string} The wrapped Office Viewer URL or the original URL if not a document
 */
export const getSafeViewerUrl = (sasUrl) => {
    if (!sasUrl) return '';
    
    // Check if it's already a viewer URL
    if (sasUrl.includes('view.officeapps.live.com')) return sasUrl;

    // Check if it's an Office document
    const isOfficeDoc = /\.(docx|doc|pptx|ppt|xlsx|xls)$/i.test(sasUrl.split('?')[0]);
    
    if (isOfficeDoc) {
        return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(sasUrl)}`;
    }
    
    return sasUrl;
};
