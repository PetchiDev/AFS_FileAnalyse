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
  User,
  Truck,
  BookOpen
} from 'lucide-react';
import { gsap } from 'gsap';
import { toast } from 'react-toastify';
import analysisService from '@/services/analysis.service';
import DocumentViewer from '@/components/common/DocumentViewer';
import { getFileExtension } from '@/utils/fileUtils';
import styles from './AnalysisResult.module.css';

const AnalysisResult = ({ apiResponse, inputFiles = [], outputFile = null, onReset, onDownload }) => {
  const mapResponseToData = (response) => {
    const ext = response?.extracted_data || {};
    
    // Format wire_transfer object into a single text block (matching document template)
    const wt = ext.wire_transfer || {};
    let wireTransferText = '';
    if (wt.bank_name) {
      wireTransferText = wt.bank_name;
      if (wt.aba_number) wireTransferText += `\nABA # ${wt.aba_number}`;
      if (wt.account_number) {
        wireTransferText += `\nAccount # ${wt.account_number}`;
        if (wt.account_name) wireTransferText += `, ${wt.account_name}`;
      }
      if (wt.reference_info) wireTransferText += `\n${wt.reference_info}`;
      if (wt.additional_info) wireTransferText += `\n${wt.additional_info}`;
    }

    return {
      companyName: ext.company_name || '',
      principalAmount: ext.principal_amount || '',
      wireTransfer: wireTransferText,
      paymentNoticesAddress: ext.payment_notices_address || '',
      emailElectronicDelivery: ext.email_electronic_delivery || '',
      otherCommunicationsAddress: ext.other_communications_address || '',
      taxId: ext.tax_id || '',
      registerNotesName: ext.nominee_name || '',
      deliveryInstructions: ext.delivery_instructions || '',
      securityDescription: ext.security_description || '',
      cusipPpn: ext.cusip_ppn || ''
    };
  };

  const initialData = mapResponseToData(apiResponse);

  const [formData, setFormData] = useState({
    companyName: initialData.companyName,
    principalAmount: initialData.principalAmount,
    wireTransfer: initialData.wireTransfer,
    paymentNoticesAddress: initialData.paymentNoticesAddress,
    emailElectronicDelivery: initialData.emailElectronicDelivery,
    otherCommunicationsAddress: initialData.otherCommunicationsAddress,
    taxId: initialData.taxId,
    registerNotesName: initialData.registerNotesName,
    deliveryInstructions: initialData.deliveryInstructions,
    securityDescription: initialData.securityDescription,
    cusipPpn: initialData.cusipPpn
  });

  // Sync apiResponse into formData whenever it changes
  useEffect(() => {
    if (apiResponse) {
      setFormData(mapResponseToData(apiResponse));
    }
  }, [apiResponse]);

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Build docs list from API input_files
  const docs = [];
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

  const parseWireTransfer = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const wt = {
      bank_name: null,
      aba_number: null,
      account_number: null,
      account_name: null,
      reference_info: null,
      additional_info: null
    };

    if (lines.length === 0) return wt;

    // First line is bank name
    wt.bank_name = lines[0];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('ABA #')) {
        wt.aba_number = line.split('ABA #')[1]?.trim();
      } else if (line.includes('Account #')) {
        const accPart = line.split('Account #')[1]?.trim();
        const commaIndex = accPart.indexOf(',');
        if (commaIndex !== -1) {
          wt.account_number = accPart.substring(0, commaIndex).trim();
          wt.account_name = accPart.substring(commaIndex + 1).trim();
        } else {
          wt.account_number = accPart;
        }
      } else if (line.toUpperCase().includes('REFERENCE:')) {
        wt.reference_info = line;
      } else {
        // Fallback: if we haven't found reference info yet, assign it
        if (!wt.reference_info) {
          wt.reference_info = line;
        } else {
          wt.additional_info = line;
        }
      }
    }
    return wt;
  };

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

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const payload = {
        processing_id: apiResponse?.processing_id || apiResponse?.id,
        extracted_data: {
          company_name: formData.companyName,
          principal_amount: formData.principalAmount,
          wire_transfer: parseWireTransfer(formData.wireTransfer),
          payment_notices_address: formData.paymentNoticesAddress,
          email_electronic_delivery: formData.emailElectronicDelivery,
          other_communications_address: formData.otherCommunicationsAddress,
          tax_id: formData.taxId,
          nominee_name: formData.registerNotesName,
          delivery_instructions: formData.deliveryInstructions,
          security_description: formData.securityDescription,
          cusip_ppn: formData.cusipPpn,
          // Preserve other original fields if any
          ...apiResponse?.extracted_data,
          // Explicitly overwrite with form values
          company_name: formData.companyName,
          principal_amount: formData.principalAmount,
          wire_transfer: parseWireTransfer(formData.wireTransfer),
          payment_notices_address: formData.paymentNoticesAddress,
          email_electronic_delivery: formData.emailElectronicDelivery,
          other_communications_address: formData.otherCommunicationsAddress,
          tax_id: formData.taxId,
          nominee_name: formData.registerNotesName,
          delivery_instructions: formData.deliveryInstructions,
          security_description: formData.securityDescription,
          cusip_ppn: formData.cusipPpn
        }
      };

      const result = await analysisService.generateDocument(payload);
      
      if (result?.output_file?.sas_url) {
        toast.success('Document updated and generated successfully!');
        
        // Use the new SAS URL for download
        const link = document.createElement('a');
        link.href = result.output_file.sas_url;
        link.download = result.output_file.original_filename || 'updated_document.docx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.warning('Document generated but download link is missing.');
      }
    } catch (err) {
      console.error('Generation failure:', err);
      toast.error(err.message || 'Failed to generate updated document');
    } finally {
      setIsSaving(false);
    }
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

      {/* Right Pane - Extracted Form matching document template */}
      <div className={`${styles.leftPane} analysis-animate`}>
        <div className={styles.paneHeader}>
          <div className={styles.paneTitleGroup}>
            <CheckCircle2 className={styles.successIconSmall} size={20} />
            <h2 className={styles.paneTitle}>Extracted Information</h2>
          </div>
        </div>

        <div className={styles.formContent}>
          {/* ── Header: Company Name + Principal Amount ── */}
          <div className={styles.templateHeader}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <User size={14} /> NAME AND INFORMATION OF PURCHASER
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className={styles.formInput}
                placeholder="Enter purchaser name"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>PRINCIPAL AMOUNT</label>
              <input
                type="text"
                name="principalAmount"
                value={formData.principalAmount}
                onChange={handleInputChange}
                className={styles.formInput}
                placeholder="$0.00"
              />
            </div>
          </div>

          {/* ── (1) Wire Transfer ── */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <CreditCard size={14} /> (1) ALL PAYMENTS BY WIRE TRANSFER
            </label>
            <textarea
              name="wireTransfer"
              value={formData.wireTransfer}
              onChange={handleInputChange}
              className={styles.formTextarea}
              rows={5}
              placeholder={"Bank Name\nABA # 000000000\nAccount # 00000000, Account Name\nREFERENCE: (...)"}
            />
          </div>

          {/* ── (2) Notices of Payments ── */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <Mail size={14} /> (2) NOTICES OF PAYMENTS & WRITTEN CONFIRMATIONS
            </label>
            <textarea
              name="paymentNoticesAddress"
              value={formData.paymentNoticesAddress}
              onChange={handleInputChange}
              className={styles.formTextarea}
              rows={4}
              placeholder="All notices of payments and written confirmations..."
            />
          </div>

          {/* ── (3) E-mail for Electronic Delivery ── */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <Mail size={14} /> (3) E-MAIL ADDRESS FOR ELECTRONIC DELIVERY
            </label>
            <input
              type="email"
              name="emailElectronicDelivery"
              value={formData.emailElectronicDelivery}
              onChange={handleInputChange}
              className={styles.formInput}
              placeholder="example@company.com"
            />
          </div>

          {/* ── (4) All Other Communications ── */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              (4) ALL OTHER COMMUNICATIONS
            </label>
            <textarea
              name="otherCommunicationsAddress"
              value={formData.otherCommunicationsAddress}
              onChange={handleInputChange}
              className={styles.formTextarea}
              rows={3}
              placeholder="Enter other communications details..."
            />
          </div>

          {/* ── (5) Tax ID ── */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <Hash size={14} /> (5) U.S. TAX IDENTIFICATION NUMBER
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

          {/* ── (6) Name to Register Notes ── */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <User size={14} /> (6) NAME IN WHICH TO REGISTER NOTES
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

          {/* ── Delivery of the Notes ── */}
          <div className={styles.sectionDivider}>
            <Truck size={16} />
            <span>Delivery of the Notes</span>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              DELIVERY INSTRUCTIONS
            </label>
            <textarea
              name="deliveryInstructions"
              value={formData.deliveryInstructions}
              onChange={handleInputChange}
              className={styles.formTextarea}
              rows={3}
              placeholder="Enter delivery instructions..."
            />
          </div>

          {/* ── Security Description & CUSIP/PPN ── */}
          <div className={styles.sectionDivider}>
            <BookOpen size={16} />
            <span>Security Info</span>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              SECURITY DESCRIPTION
            </label>
            <input
              type="text"
              name="securityDescription"
              value={formData.securityDescription}
              onChange={handleInputChange}
              className={styles.formInput}
              placeholder="e.g. 4.35% Series A Guaranteed Senior Note"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              CUSIP / PPN
            </label>
            <input
              type="text"
              name="cusipPpn"
              value={formData.cusipPpn}
              onChange={handleInputChange}
              className={styles.formInput}
              placeholder="e.g. 26884U A*0"
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
