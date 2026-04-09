import React, { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import ShareReport from '@/components/common/ShareReport/ShareReport';
import ShareIcon from '@/components/common/Icon/ShareIcon';
import styles from './CompanyBriefing.module.css';

const SectionIcon = ({ sectionKey }) => {
  const icons = {
    what_they_do: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    business_model: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      </svg>
    ),
    key_numbers: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    competition: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    biggest_risk: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    misconception: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    )
  };
  return icons[sectionKey] || icons.what_they_do;
};

const CompanyBriefing = ({ briefing, researchSessionId }) => {
  const briefingRef = useRef(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (!briefing) return null;

  const sectionColors = {
    what_they_do: '#6366f1',
    business_model: '#10b981',
    key_numbers: '#f59e0b',
    competition: '#3b82f6',
    biggest_risk: '#ef4444',
    misconception: '#8b5cf6',
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    try { return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return iso; }
  };

  const handleDownloadPDF = () => {
    if (!briefingRef.current) return;
    
    const element = briefingRef.current;
    
    // Select both buttons and hide them
    const downloadBtn = element.querySelector(`.${styles.downloadBtn}`);
    const shareBtn = element.querySelector(`.${styles.shareBtn}`);
    
    if (downloadBtn) downloadBtn.style.display = 'none';
    if (shareBtn) shareBtn.style.display = 'none';

    // To prevent page breaks inside cards
    const cards = element.querySelectorAll(`.${styles.briefingCard}`);
    const originalStyles = [];
    cards.forEach(card => {
      originalStyles.push(card.style.pageBreakInside);
      card.style.pageBreakInside = 'avoid';
    });

    const opt = {
      margin:       [10, 10, 10, 10],
      filename:     `${briefing.company_name?.replace(/\s+/g, '_') || 'Company'}_Briefing.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      if (downloadBtn) downloadBtn.style.display = 'flex';
      if (shareBtn) shareBtn.style.display = 'flex';
      cards.forEach((card, index) => {
        card.style.pageBreakInside = originalStyles[index];
      });
    });
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setIsShareModalOpen(true);
  };

  return (
    <div className={styles.briefingWrapper} ref={briefingRef}>
      {/* Header */}
      <div className={styles.briefingHeader}>
        <div className={styles.briefingHeaderContent}>
          <div className={styles.briefingLogo}>
            {briefing.company_name?.charAt(0) || 'C'}
          </div>
          <div>
            <h2 className={styles.briefingCompanyName}>{briefing.company_name}</h2>
            {briefing.company_website && (
              <a href={briefing.company_website} target="_blank" rel="noopener noreferrer" className={styles.briefingWebsite}>
                {briefing.company_website}
              </a>
            )}
          </div>
        </div>
        <div className={styles.briefingHeaderActions}>
          <button className={styles.shareBtn} onClick={handleShare} data-html2canvas-ignore="true">
            <ShareIcon size={16} />
            Share
          </button>
          <button className={styles.downloadBtn} onClick={handleDownloadPDF} data-html2canvas-ignore="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Report
          </button>
        </div>
      </div>

      {/* Sections Grid */}
      <div className={styles.briefingSectionsGrid}>
        {briefing.sections?.map((section) => {
          const color = sectionColors[section.key] || '#6366f1';
          const hasContent = section.content && !section.content.startsWith('Limited public data');
          return (
            <div key={section.key} className={styles.briefingCard} style={{ '--section-color': color }}>
              <div className={styles.briefingCardHeader}>
                <div className={styles.briefingCardIcon} style={{ background: `${color}15`, color }}>
                  <SectionIcon sectionKey={section.key} />
                </div>
                <h3 className={styles.briefingCardTitle}>{section.title}</h3>
              </div>
              <p className={`${styles.briefingCardContent} ${!hasContent ? styles.briefingCardContentMuted : ''}`}>
                {section.content}
              </p>
              {section.sources?.length > 0 && (
                <div className={styles.briefingSources}>
                  {section.sources.slice(0, 2).map((src, i) => {
                    let displayName;
                    try {
                      displayName = new URL(src).hostname.replace('www.', '');
                    } catch {
                      displayName = typeof src === 'string' ? src.slice(0, 30) : 'Source';
                    }
                    return (
                      <a key={i} href={src} target="_blank" rel="noopener noreferrer" className={styles.briefingSourceChip}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        {displayName}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className={styles.briefingFooter}>
        {briefing.disclaimer && <p className={styles.briefingDisclaimer}>ℹ️ {briefing.disclaimer}</p>}
        {briefing.generated_at && <span className={styles.briefingTimestamp}>Generated: {formatDate(briefing.generated_at)}</span>}
      </div>

      <ShareReport
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          reportId={researchSessionId}
      />
    </div>
  );
};

export default CompanyBriefing;
