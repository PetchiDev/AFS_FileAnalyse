import React, { useState, useEffect, useRef } from 'react';
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

  const fetchedIdRef = useRef(null);

  useEffect(() => {
    // Prevent double fetch for same ID (common during route transitions or StrictMode)
    if (fetchedIdRef.current === id && data) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await analysisService.getProcessingDetail(id);
        setData(response.record);
        fetchedIdRef.current = id;
      } catch (err) {
        toast.error('Failed to load processing details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, data]);

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
          {output_file?.sas_url && (
            <button
              className={styles.downloadBtn}
              onClick={(e) => {
                e.preventDefault();
                const link = document.createElement('a');
                link.href = output_file.sas_url;
                link.setAttribute('download', output_file.original_filename || 'report.docx');
                link.setAttribute('target', '_blank');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success('Download initiated');
              }}
            >
              <Download size={18} />
              <span>Download Report</span>
            </button>
          )}
        </div>
      </header>

      <main className={styles.layoutContainer}>
        <div className={styles.mainContent}>
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
              <div className={styles.wireInstructionBlock}>
                {extracted_data?.wire_transfer ? (
                  <>
                    <p className={styles.bankName}>{extracted_data.wire_transfer.bank_name}</p>
                    {extracted_data.wire_transfer.aba_number && <p className={styles.metaRow}>ABA # {extracted_data.wire_transfer.aba_number}</p>}
                    {extracted_data.wire_transfer.account_number && (
                      <p className={styles.metaRow}>
                        Account # {extracted_data.wire_transfer.account_number}
                        {extracted_data.wire_transfer.account_name && `, ${extracted_data.wire_transfer.account_name}`}
                      </p>
                    )}
                    {extracted_data.wire_transfer.reference_info && <p className={styles.metaRow}>{extracted_data.wire_transfer.reference_info}</p>}
                    {extracted_data.wire_transfer.additional_info && <p className={styles.metaRow}>{extracted_data.wire_transfer.additional_info}</p>}
                  </>
                ) : (
                  <p className={styles.noData}>N/A</p>
                )}
              </div>
            </div>
          </section>
        </div>

        <aside className={styles.sideRail}>
          {/* General Metadata */}
          <section className={styles.sideCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconBg}>
                <FileCheck size={18} />
              </div>
              <h3>Document Metadata</h3>
            </div>
            <div className={styles.metaList}>
              <div className={styles.metaItem}>
                <Calendar size={14} />
                <div className={styles.metaText}>
                  <label>Analyzed On</label>
                  <span>{new Date(created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
              <div className={styles.metaItem}>
                <FileText size={14} />
                <div className={styles.metaText}>
                  <label>Source Filename</label>
                  <span title={output_file?.original_filename}>{output_file?.original_filename}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Communications */}
          <section className={styles.sideCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconBg}>
                <Globe size={18} />
              </div>
              <h3>Delivery & Comm.</h3>
            </div>
            <div className={styles.commStack}>
              <div className={styles.dataGroup}>
                <label>Electronic Delivery</label>
                <div className={styles.emailBadge}>
                  <Mail size={12} />
                  <span>{extracted_data?.email_electronic_delivery || 'N/A'}</span>
                </div>
              </div>
              <div className={styles.dataGroup}>
                <label>Notices Address</label>
                <p className={styles.smallAddress}>{extracted_data?.payment_notices_address || 'N/A'}</p>
              </div>
              <div className={styles.dataGroup}>
                <label>Delivery Instructions</label>
                <p className={styles.smallAddress}>{extracted_data?.delivery_instructions || 'N/A'}</p>
              </div>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
};

export default ProcessingDetail;