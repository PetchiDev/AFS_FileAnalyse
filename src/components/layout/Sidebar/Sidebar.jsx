import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRouterState, useNavigate } from '@tanstack/react-router';
import { gsap } from 'gsap';
import { ROUTES, SIDEBAR_CONSTANTS } from '@/config/constants';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen = false, onClose }) => {
  const sidebarRef = useRef(null);
  const navItemsRef = useRef([]);
  const overlayRef = useRef(null);
  const router = useRouterState();
  const navigate = useNavigate();
  const currentPath = router.location.pathname;

  // GSAP entrance animation (desktop only)
  useEffect(() => {
    if (!sidebarRef.current) return;
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
      gsap.fromTo(
        sidebarRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, []);

  // Animate nav items on mount
  useEffect(() => {
    navItemsRef.current.forEach((item, index) => {
      if (item) {
        gsap.fromTo(
          item,
          { x: -15, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.3,
            delay: 0.05 * index,
            ease: 'power2.out'
          }
        );
      }
    });
  }, []);

  // Close sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, onClose]);

  // Overlay animation
  useEffect(() => {
    if (isOpen && overlayRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    } else if (!isOpen && overlayRef.current) {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
    }
  }, [isOpen]);

  // Mobile sidebar slide animation
  useEffect(() => {
    if (!sidebarRef.current) return;
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      if (isOpen) {
        gsap.to(sidebarRef.current, { x: 0, duration: 0.3, ease: 'power2.out' });
      } else {
        gsap.to(sidebarRef.current, { x: '-100%', duration: 0.3, ease: 'power2.in' });
      }
    }
  }, [isOpen]);

  const getActiveItemFromPath = () => {
    if (currentPath === '/' || currentPath === ROUTES.UPLOAD) return 'upload';
    if (currentPath === ROUTES.REPORTS) return 'reports';
    return null;
  };

  const handleNavClick = useCallback((e, item) => {
    e.preventDefault();

    // Animate click
    const clickedItem = navItemsRef.current.find(
      (ref) => ref?.dataset?.itemId === item.id
    );
    if (clickedItem) {
      gsap.to(clickedItem, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
    }

    const isAlreadyOnPage = currentPath === item.path || (currentPath === '/' && item.path === ROUTES.UPLOAD);

    if (isAlreadyOnPage) {
      // Dispatch custom event to reset page state
      window.dispatchEvent(new CustomEvent('page:reset'));
    } else {
      // Navigate to the new page
      navigate({ to: item.path, search: {} });
    }

    // Close on mobile
    if (window.innerWidth <= 768 && onClose) {
      onClose();
    }
  }, [navigate, currentPath, onClose]);

  const navigationItems = [
    {
      id: 'upload',
      label: SIDEBAR_CONSTANTS.UPLOAD,
      path: ROUTES.UPLOAD,
      icon: (
        <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="17,8 12,3 7,8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: 'reports',
      label: SIDEBAR_CONSTANTS.REPORTS,
      path: ROUTES.REPORTS,
      icon: (
        <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    }
  ];

  const currentActiveItem = getActiveItemFromPath();

  return (
    <>
      {/* Mobile Overlay */}
      <div
        ref={overlayRef}
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}
      >
        <nav className={styles.nav}>
          <div className={styles.navSection}>
            {navigationItems.map((item, index) => {
              const isActive = currentActiveItem === item.id;

              return (
                <a
                  key={item.id}
                  href={item.path}
                  ref={(el) => {
                    if (el) navItemsRef.current[index] = el;
                  }}
                  data-item-id={item.id}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                  onClick={(e) => handleNavClick(e, item)}
                  aria-label={item.label}
                >
                  {item.icon}
                  <span className={styles.navLabel}>{item.label}</span>
                </a>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default Sidebar;
