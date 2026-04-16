import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  Save,
  ChevronRight,
  FileCode,
  Mail,
  CreditCard,
  Hash,
  User
} from 'lucide-react';
import { gsap } from 'gsap';
import DocumentViewer from '@/components/common/DocumentViewer';
import { getFileExtension } from '@/utils/fileUtils';
import styles from './AnalysisResult.module.css';

const AnalysisResult = ({ data, inputFiles = [], outputFile = null, onReset, onDownload }) => {
  const [formData, setFormData] = useState({
    purchaserName: data?.purchaserName || '',
    registeredNoteNo: data?.registeredNoteNo || '',
    principalAmount: data?.principalAmount || '',
    wireTransfer: data?.wireTransfer || '',
    noticesConfirmations: data?.noticesConfirmations || '',
    electronicDeliveryEmail: data?.electronicDeliveryEmail || '',
    otherCommunications: data?.otherCommunications || '',
    taxId: data?.taxId || '',
    registerNotesName: data?.registerNotesName || ''
  });

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Build docs list from API input_files and output_file
  const docs = [];
  
  // Add input files
  inputFiles.forEach((file, index) => {
    const ext = getFileExtension(file.original_filename);
    docs.push({
      id: `input-${index}`,
      name: file.original_filename,
      type: ext.toUpperCase(),
      url: file.sas_url,
      isOutput: false
    });
  });

  useEffect(() => {
    gsap.fromTo('.analysis-animate', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
    );
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDownload = () => {
    if (!outputFile?.sas_url) return;
    
    const link = document.createElement('a');
    link.href = outputFile.sas_url;
    link.download = outputFile.original_filename || 'generated_document.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate saving process
    setTimeout(() => {
      setIsSaving(false);
      handleDownload();
    }, 800);
  };

  const getFileIconComponent = (type) => {
    const normalizedType = type.toLowerCase();
    if (normalizedType === 'pdf') return <FileText size={24} />;
    if (normalizedType === 'docx' || normalizedType === 'doc') return <FileCode size={24} />;
    if (normalizedType === 'msg') return <Mail size={24} />;
    return <FileText size={24} />;
  };

  const getFileIconBgClass = (type) => {
    const normalizedType = type.toLowerCase();
    if (normalizedType === 'pdf') return styles.pdfbg;
    if (normalizedType === 'docx' || normalizedType === 'doc') return styles.docxbg;
    if (normalizedType === 'msg') return styles.msgbg;
    return '';
  };

  return (
    <div className={styles.analysisContainer}>
      {/* Left Pane - File Gallery / Viewer */}
      <div className={`${styles.rightPane} analysis-animate`}>
        {selectedDoc ? (
          <DocumentViewer 
            file={selectedDoc} 
            isEmbedded={true}
            onClose={() => setSelectedDoc(null)} 
          />
        ) : (
          <>
            <div className={styles.paneHeader}>
              <h2 className={styles.paneTitle}>Associated Files</h2>
              <div className={styles.headerActions}>
                <button className={styles.downloadBtn} onClick={onDownload}>
                  <Download size={16} /> Download All
                </button>
                <button className={styles.resetBtn} onClick={onReset}>
                  <RotateCcw size={16} /> New Upload
                </button>
              </div>
            </div>

            <div className={styles.fileGallery}>
              {docs.length > 0 ? (
                docs.map(file => (
                  <div 
                    key={file.id} 
                    className={styles.fileCard}
                    onClick={() => setSelectedDoc(file)}
                  >
                    <div className={`${styles.fileIconBox} ${getFileIconBgClass(file.type)}`}>
                      {getFileIconComponent(file.type)}
                    </div>
                    <div className={styles.fileCardContent}>
                      <div className={styles.fileCardHeader}>
                        <span className={styles.fileCardName}>{file.name}</span>
                        {file.isOutput && <span className={styles.outputBadge}>Generated</span>}
                      </div>
                      <span className={styles.fileCardMeta}>{file.type}</span>
                    </div>
                    <ChevronRight className={styles.fileCardArrow} size={18} />
                  </div>
                ))
              ) : (
                <div className={styles.emptyDocs}>
                  <FileText size={40} strokeWidth={1.2} />
                  <p>No source documents available</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right Pane - Editable Form */}
      <div className={`${styles.leftPane} analysis-animate`}>
        <div className={styles.paneHeader}>
          <div className={styles.paneTitleGroup}>
            <CheckCircle2 className={styles.successIconSmall} size={20} />
            <h2 className={styles.paneTitle}>Extracted Information</h2>
          </div>
        </div>

        <div className={styles.formContent}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <User size={14} /> NAME OF PURCHASER
            </label>
            <input
              type="text"
              name="purchaserName"
              value={formData.purchaserName}
              onChange={handleInputChange}
              className={styles.formInput}
              placeholder="Enter purchaser name"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <Hash size={14} /> REGISTERED NOTE NO.
              </label>
              <div className={styles.inputWithPrefix}>
                <span className={styles.prefix}>R:</span>
                <input
                  type="text"
                  name="registeredNoteNo"
                  value={formData.registeredNoteNo}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="[ ]"
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>PRINCIPAL AMOUNT</label>
              <div className={styles.inputWithPrefix}>
                <span className={styles.prefix}>$</span>
                <input
                  type="text"
                  name="principalAmount"
                  value={formData.principalAmount}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <CreditCard size={14} /> (1) WIRE TRANSFER INSTRUCTIONS
            </label>
            <textarea
              name="wireTransfer"
              value={formData.wireTransfer}
              onChange={handleInputChange}
              className={styles.formTextarea}
              rows={3}
              placeholder="All payments by wire transfer of immediately available funds to..."
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <Mail size={14} /> (2) NOTICES OF PAYMENTS & CONFIRMATIONS
            </label>
            <textarea
              name="noticesConfirmations"
              value={formData.noticesConfirmations}
              onChange={handleInputChange}
              className={styles.formTextarea}
              rows={3}
              placeholder="All notices of payments and written confirmations..."
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <Mail size={14} /> (3) E-MAIL FOR ELECTRONIC DELIVERY
            </label>
            <input
              type="email"
              name="electronicDeliveryEmail"
              value={formData.electronicDeliveryEmail}
              onChange={handleInputChange}
              className={styles.formInput}
              placeholder="example@company.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              (4) ALL OTHER COMMUNICATIONS
            </label>
            <textarea
              name="otherCommunications"
              value={formData.otherCommunications}
              onChange={handleInputChange}
              className={styles.formTextarea}
              rows={2}
              placeholder="Enter other communications details..."
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              (5) U.S. TAX IDENTIFICATION NUMBER
            </label>
            <input
              type="text"
              name="taxId"
              value={formData.taxId}
              onChange={handleInputChange}
              className={styles.formInput}
              placeholder="XX-XXXXXXX"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              (6) NAME IN WHICH TO REGISTER NOTES
            </label>
            <input
              type="text"
              name="registerNotesName"
              value={formData.registerNotesName}
              onChange={handleInputChange}
              className={styles.formInput}
              placeholder="Enter registration name"
            />
          </div>
        </div>

        <div className={styles.paneFooter}>
          <button 
            className={styles.saveBtn} 
            onClick={handleSave} 
            disabled={isSaving}
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
