import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { gsap } from 'gsap';
import { useMsal } from '@azure/msal-react';
import { Link } from '@tanstack/react-router';
import LogoutIcon from '@/components/common/Icon/LogoutIcon';
import { MSAL_CONFIG, ROUTES } from '@/config/constants';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/common/ThemeToggle/ThemeToggle';
import LogoLight from '@/assets/icons/AFS-Logo-RGB_HR.jpg';
import LogoWhiteText from '@/assets/icons/AFS-Logo-White-Text.png';
import styles from './Header.module.css';

const Header = ({ userName = 'John Doe', userEmail = 'john@afs.com' }) => {
  const { instance } = useMsal();
  const { themeMode, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const headerRef = useRef(null);
  const profileRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!headerRef.current) return;

    gsap.fromTo(
      headerRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
  }, []);

  useEffect(() => {
    if (profileRef.current) {
      gsap.fromTo(
        profileRef.current,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          delay: 0.4,
          ease: 'power2.out'
        }
      );
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        profileRef.current && !profileRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: MSAL_CONFIG.auth.postLogoutRedirectUri,
    });
  };

  const getInitials = (name) => {
    if (!name) return 'JD';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header ref={headerRef} className={styles.header}>
      {/* Left Section: Mobile hamburger + Logo */}
      <div className={styles.leftSection}>

        <Link to={ROUTES.UPLOAD} search={{}} className={styles.logoLink}>
          {themeMode === 'dark' ? (
            <img src={LogoWhiteText} alt="AFS Logo" className={styles.logoImage} />
          ) : (
            <img src={LogoLight} alt="AFS Logo" className={styles.logoImage} />
          )}
        </Link>
      </div>

      {/* Right Section: Theme toggle + Profile */}
      <div className={styles.rightSection}>
        <div className={styles.iconsContainer}>
          <ThemeToggle />
        </div>

        <div
          ref={profileRef}
          className={`${styles.profileContainer} ${isDropdownOpen ? styles.active : ''}`}
          onClick={toggleDropdown}
        >
          <div className={styles.avatarCircle}>
            <span className={styles.avatarInitials}>{getInitials(userName)}</span>
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>{userName}</span>
            <span className={styles.profileEmail}>{userEmail}</span>
          </div>

          {isDropdownOpen && (
            <div ref={dropdownRef} className={styles.dropdownMenu}>
              <button className={styles.dropdownItem} onClick={handleLogout}>
                <LogoutIcon className={styles.logoutIcon} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  userName: PropTypes.string,
  userEmail: PropTypes.string
};

export default Header;
