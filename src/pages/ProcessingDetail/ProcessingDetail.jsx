import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft,
  Building2,
  MapPin,
  CreditCard,
  Mail,
  FileText,
  ShieldCheck,
  Banknote,
  Calendar,
  ExternalLink,
  Download,
  Info,
  Hash,
  FileCheck,
  Globe
} from 'lucide-react';
import { toast } from 'react-toastify';
import analysisService from '@/services/analysis.service';
import { getSafeViewerUrl } from '@/utils/fileUtils';
import styles from './ProcessingDetail.module.css';

const ProcessingDetail = () => {
  const { id } = useParams({ from: '/auth/processings/$id' });
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await analysisService.getProcessingDetail(id);
        setData(response.record);
      } catch (err) {
        toast.error('Failed to load processing details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loader}></div>
        <p>Fetching details...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.errorWrapper}>
        <Info size={48} />
        <h2>Record Not Found</h2>
        <button onClick={() => navigate({ to: '/' })} className={styles.backBtn}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </div>
    );
  }

  const { extracted_data, output_file, created_at, status } = data;

  return (
    <div className={styles.detailWrapper}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button onClick={() => navigate({ to: '/' })} className={styles.backBtn}>
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </button>
          <div className={styles.titleArea}>
            <h1>Analysis Results</h1>
            {/* <div className={styles.statusIndicator}>
              <div className={`${styles.statusDot} ${styles[status?.toLowerCase()]}`} />
              <span>{status}</span>
            </div> */}
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.headerActions}>
            {output_file?.sas_url && (
              <button
                className={styles.downloadBtn}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(output_file.sas_url, '_blank');
                }}
              >
                <Download size={18} />
                <span>Download Report</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className={styles.layoutContainer}>
        <div className={styles.mainGrid}>
          <div className={styles.leftColumn}>
            {/* Company Identity */}
            <section className={styles.glassCard}>
              <div className={styles.cardHeader}>
                <div className={styles.iconBg}>
                  <Building2 size={20} />
                </div>
                <h2>Company Identity</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.dataGroup}>
                  <label>Legal Name</label>
                  <div className={styles.legalNameHighlight}>
                    {extracted_data?.company_name || 'N/A'}
                  </div>
                </div>
                <div className={styles.dataGrid}>
                  <div className={styles.dataGroup}>
                    <label><MapPin size={14} /> Registered Address</label>
                    <p className={styles.addressValue}>{extracted_data?.company_address || 'N/A'}</p>
                  </div>
                  <div className={styles.dataGroup}>
                    <label><Hash size={14} /> Tax Identification</label>
                    <p className={styles.taxId}>{extracted_data?.tax_id || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Financial Details */}
            <section className={styles.glassCard}>
              <div className={styles.cardHeader}>
                <div className={styles.iconBg}>
                  <Banknote size={20} />
                </div>
                <h2>Financial Details</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.primeStatsGrid}>
                  <div className={styles.primeStatBadge}>
                    <label>Principal Amount</label>
                    <div className={styles.amountText}>{extracted_data?.principal_amount || 'N/A'}</div>
                  </div>
                  <div className={styles.primeStatBadge}>
                    <label>Series Designation</label>
                    <div className={styles.seriesText}>{extracted_data?.series || 'N/A'}</div>
                  </div>
                </div>
                <div className={styles.dataGrid}>
                  <div className={styles.dataGroup}>
                    <label>Security Description</label>
                    <p className={styles.descriptionText}>{extracted_data?.security_description || 'N/A'}</p>
                  </div>
                  <div className={styles.dataGroup}>
                    <label>CUSIP / PPN Number</label>
                    <p className={styles.cusipText}>{extracted_data?.cusip_ppn || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Wire Transfer Instructions */}
            <section className={styles.glassCard}>
              <div className={styles.cardHeader}>
                <div className={styles.iconBg}>
                  <CreditCard size={20} />
                </div>
                <h2>Wire Transfer Instructions</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.wireInstructionGrid}>
                  <div className={styles.dataGroup}>
                    <label>Receiving Bank</label>
                    <p className={styles.bankName}>{extracted_data?.wire_transfer?.bank_name || 'N/A'}</p>
                  </div>
                  <div className={styles.dataGroup}>
                    <label>ABA Routing Number</label>
                    <p className={styles.abaNumber}>{extracted_data?.wire_transfer?.aba_number || 'N/A'}</p>
                  </div>
                  <div className={styles.dataGroup}>
                    <label>Account Identifier</label>
                    <p className={styles.accNumber}>{extracted_data?.wire_transfer?.account_number || 'N/A'}</p>
                  </div>
                  <div className={styles.dataGroup}>
                    <label>Reference Information</label>
                    <p className={styles.refInfo}>{extracted_data?.wire_transfer?.reference_info || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className={styles.rightColumn}>
             {/* Document Gallery Section */}
             <section className={styles.glassCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconBg}>
                    <FileText size={20} />
                  </div>
                  <h2>Associated Files</h2>
                </div>
                <div className={styles.fileGallery}>
                  {[
                    ...(output_file ? [{ ...output_file, isOutput: true }] : []),
                    ...(data.input_files || []).map(f => ({ ...f, isOutput: false }))
                  ].map((file, idx) => (
                    <div 
                      key={idx} 
                      className={styles.fileCard}
                      onClick={() => window.open(getSafeViewerUrl(file.sas_url), '_blank')}
                    >
                      <div className={styles.fileCardInfo}>
                        <div className={styles.fileNameRow}>
                          <span className={styles.fileName}>{file.original_filename}</span>
                          {file.isOutput && <span className={styles.outputBadge}>Generated</span>}
                        </div>
                        <span className={styles.fileType}>{file.original_filename.split('.').pop().toUpperCase()}</span>
                      </div>
                      <ExternalLink size={16} className={styles.viewIcon} />
                    </div>
                  ))}
                </div>
             </section>

             {/* Metadata */}
             <section className={styles.glassCard}>
              <div className={styles.cardHeader}>
                <div className={styles.iconBg}>
                  <Info size={18} />
                </div>
                <h3>Processing Info</h3>
              </div>
              <div className={styles.metaList}>
                <div className={styles.metaItem}>
                  <Calendar size={14} />
                  <div className={styles.metaText}>
                    <label>Date</label>
                    <span>{new Date(created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className={styles.metaItem}>
                  <ShieldCheck size={14} />
                  <div className={styles.metaText}>
                    <label>Status</label>
                    <span className={styles.statusText}>{status}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Communications */}
            <section className={styles.glassCard}>
              <div className={styles.cardHeader}>
                <div className={styles.iconBg}>
                  <Globe size={18} />
                </div>
                <h3>Communications</h3>
              </div>
              <div className={styles.commStack}>
                <div className={styles.dataGroup}>
                  <label>E-Delivery</label>
                  <p className={styles.emailBadge}>{extracted_data?.email_electronic_delivery || 'N/A'}</p>
                </div>
                <div className={styles.dataGroup}>
                  <label>Notices</label>
                  <p className={styles.smallAddress}>{extracted_data?.payment_notices_address || 'N/A'}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProcessingDetail;
