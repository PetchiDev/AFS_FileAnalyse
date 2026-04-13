import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  RotateCcw, 
  ExternalLink, 
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
import styles from './AnalysisResult.module.css';

const AnalysisResult = ({ data, onReset, onDownload }) => {
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

  // Static sample files from public/sample-docs
  const sampleDocs = [
    {
      id: 1,
      name: 'memo re EPR Properties 7_001.pdf',
      size: '174 KB',
      type: 'PDF',
      url: '/sample-docs/memo re EPR Properties 7_001.pdf'
    },
    {
      id: 2,
      name: 'Purchaser Schedule - Americo.docx',
      size: '17 KB',
      type: 'DOCX',
      url: '/sample-docs/Purchaser Schedule - Americo.docx'
    },
    {
      id: 3,
      name: 'RE EPR Properties Circle Letter.msg',
      size: '65 KB',
      type: 'MSG',
      url: '/sample-docs/RE  EPR Properties Circle Letter.msg'
    }
  ];

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

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // In a real app, we'd trigger a toast here
    }, 1000);
  };

  return (
    <div className={styles.analysisContainer}>
      {/* Left Pane - Editable Form */}
      <div className={`${styles.leftPane} analysis-animate`}>
        <div className={styles.paneHeader}>
          <div className={styles.paneTitleGroup}>
            <CheckCircle2 className={styles.successIconSmall} size={20} />
            <h2 className={styles.paneTitle}>Extracted Information</h2>
          </div>
          <button 
            className={styles.saveBtn} 
            onClick={handleSave} 
            disabled={isSaving}
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
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
      </div>

      {/* Right Pane - File Gallery / Viewer */}
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
              <h2 className={styles.paneTitle}>Source Documents</h2>
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
              {sampleDocs.map(file => (
                <div 
                  key={file.id} 
                  className={styles.fileCard}
                  onClick={() => setSelectedDoc(file)}
                >
                  <div className={`${styles.fileIconBox} ${styles[file.type.toLowerCase() + 'bg']}`}>
                    {file.type === 'PDF' ? <FileText size={24} /> : file.type === 'DOCX' ? <FileCode size={24} /> : <Mail size={24} />}
                  </div>
                  <div className={styles.fileCardContent}>
                    <span className={styles.fileCardName}>{file.name}</span>
                    <span className={styles.fileCardMeta}>{file.type} • {file.size}</span>
                  </div>
                  <ChevronRight className={styles.fileCardArrow} size={18} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalysisResult;
