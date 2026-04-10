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
  Info
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
        <button onClick={() => navigate({ to: '/' })} className={styles.iconBtn}>
          <ArrowLeft size={20} />
        </button>
        <div className={styles.headerTitle}>
          <h1>Analysis Results</h1>
        </div>
        <div className={styles.headerActions}>
          {output_file?.sas_url && (
            <button
              className={styles.downloadBtn}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(getSafeViewerUrl(output_file.sas_url), '_blank');
              }}
            >
              <Download size={18} /> Download Result
            </button>
          )}
        </div>
      </header>

      <main className={styles.grid}>
        {/* Summary Card */}
        <section className={`${styles.card} ${styles.summaryCard}`}>
          <div className={styles.cardHeader}>
            <ShieldCheck className={styles.icon} />
            <h2>General Information</h2>
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Status</label>
              <span className={styles.statusBadge}>{status}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Created At</label>
              <div className={styles.withIcon}>
                <Calendar size={14} />
                <span>{new Date(created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <label>Filename</label>
              <span>{output_file?.original_filename}</span>
            </div>
          </div>
        </section>

        {/* Company Identity */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <Building2 className={styles.icon} />
            <h2>Company Identity</h2>
          </div>
          <div className={styles.fieldGroup}>
            <label>Legal Name</label>
            <p className={styles.mainValue}>{extracted_data?.company_name || 'N/A'}</p>
          </div>
          <div className={styles.fieldGroup}>
            <label>Address</label>
            <div className={styles.withIcon}>
              <MapPin size={16} />
              <p>{extracted_data?.company_address || 'N/A'}</p>
            </div>
          </div>
          <div className={styles.fieldGroup}>
            <label>Tax ID</label>
            <p>{extracted_data?.tax_id || 'N/A'}</p>
          </div>
        </section>

        {/* Financial Details */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <Banknote className={styles.icon} />
            <h2>Financial Details</h2>
          </div>
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <label>Principal Amount</label>
              <p className={styles.statValue}>{extracted_data?.principal_amount || 'N/A'}</p>
            </div>
            <div className={styles.statBox}>
              <label>Series</label>
              <p className={styles.statValue}>{extracted_data?.series || 'N/A'}</p>
            </div>
          </div>
          <div className={styles.fieldGroup}>
            <label>Security Description</label>
            <p>{extracted_data?.security_description || 'N/A'}</p>
          </div>
          <div className={styles.fieldGroup}>
            <label>CUSIP / PPN</label>
            <p>{extracted_data?.cusip_ppn || 'N/A'}</p>
          </div>
        </section>

        {/* Wire Transfer Instructions */}
        <section className={`${styles.card} ${styles.fullWidth}`}>
          <div className={styles.cardHeader}>
            <CreditCard className={styles.icon} />
            <h2>Wire Transfer Instructions</h2>
          </div>
          <div className={styles.wireGrid}>
            <div className={styles.fieldGroup}>
              <label>Bank Name</label>
              <p>{extracted_data?.wire_transfer?.bank_name || 'N/A'}</p>
            </div>
            <div className={styles.fieldGroup}>
              <label>ABA Number</label>
              <p>{extracted_data?.wire_transfer?.aba_number || 'N/A'}</p>
            </div>
            <div className={styles.fieldGroup}>
              <label>Account Number</label>
              <p>{extracted_data?.wire_transfer?.account_number || 'N/A'}</p>
            </div>
            <div className={styles.fieldGroup}>
              <label>Reference Info</label>
              <p>{extracted_data?.wire_transfer?.reference_info || 'N/A'}</p>
            </div>
          </div>
        </section>

        {/* Communication & Delivery */}
        <section className={`${styles.card} ${styles.fullWidth}`}>
          <div className={styles.cardHeader}>
            <Mail className={styles.icon} />
            <h2>Communications & Delivery</h2>
          </div>
          <div className={styles.commGrid}>
            <div className={styles.fieldGroup}>
              <label>Payment Notices Address</label>
              <p>{extracted_data?.payment_notices_address || 'N/A'}</p>
            </div>
            <div className={styles.fieldGroup}>
              <label>Delivery Instructions</label>
              <p>{extracted_data?.delivery_instructions || 'N/A'}</p>
            </div>
            <div className={styles.fieldGroup}>
              <label>Electronic Delivery Email</label>
              <div className={styles.withIcon}>
                <Mail size={16} />
                <p>{extracted_data?.email_electronic_delivery || 'N/A'}</p>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label>Other Communications</label>
              <p>{extracted_data?.other_communications_address || 'N/A'}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProcessingDetail;
