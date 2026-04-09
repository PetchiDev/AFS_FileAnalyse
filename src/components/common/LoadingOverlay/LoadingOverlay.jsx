import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { LOADING_SENTENCES } from '@/config/constants';
import LoadingLogo from '@/assets/icons/Loading_Logo.png';
import styles from './LoadingOverlay.module.css';

const LoadingOverlay = ({ show }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const textRef = useRef(null);
    const overlayRef = useRef(null);
    const intervalRef = useRef(null);

    // Sync visibility with show prop to allow for exit animations
    useEffect(() => {
        if (show) {
            setIsVisible(true);
        }
    }, [show]);

    useEffect(() => {
        if (show && isVisible && overlayRef.current) {
            // Entrance animation
            gsap.to(overlayRef.current, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            });

            // Text cycling interval
            intervalRef.current = setInterval(() => {
                const nextIndex = (currentIndex + 1) % LOADING_SENTENCES.length;

                if (textRef.current) {
                    const tl = gsap.timeline();
                    tl.to(textRef.current, {
                        yPercent: -100,
                        rotateX: -45, // Roll up effect
                        opacity: 0,
                        duration: 0.5,
                        ease: 'power2.in',
                        onComplete: () => {
                            setCurrentIndex(nextIndex);
                            gsap.set(textRef.current, { yPercent: 100, rotateX: 45 });
                        }
                    }).to(textRef.current, {
                        yPercent: 0,
                        rotateX: 0,
                        opacity: 1,
                        duration: 0.7,
                        ease: 'back.out(1.7)'
                    });
                }
            }, 5000);

            return () => {
                if (intervalRef.current) clearInterval(intervalRef.current);
            };
        } else if (!show && isVisible && overlayRef.current) {
            // Exit animation
            gsap.to(overlayRef.current, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    setIsVisible(false);
                    setCurrentIndex(0);
                }
            });
        }
    }, [show, isVisible, currentIndex]);

    if (!isVisible) return null;

    return (
        <div className={styles.overlay} ref={overlayRef} style={{ opacity: 0 }}>
            <div className={styles.container}>
                <div className={styles.logoWrapper}>
                    <img src={LoadingLogo} alt="Loading..." className={styles.logo} />
                </div>
                <div className={styles.textContainer}>
                    <div className={styles.textWrapper} ref={textRef}>
                        <span className={styles.sentence}>
                            {LOADING_SENTENCES[currentIndex]}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
