"use client";

import styles from "../page.module.css";

export default function TopSocials() {
  return (
    <div className={styles.socialsContainer}>
      <div className={styles.socialsIsland}>
        <a 
          href="https://linkedin.com/in/marv.os" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.toggleButton}
          aria-label="LinkedIn"
        >
          <svg className={styles.toggleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect x="2" y="9" width="4" height="12"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>
        </a>
        <a 
          href="https://instagram.com/marv.os" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.toggleButton}
          aria-label="Instagram"
        >
          <svg className={styles.toggleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
        </a>
        <a 
          href="https://x.com/marv.os" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.toggleButton}
          aria-label="X (Twitter)"
        >
          <svg className={styles.toggleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4l16 16"/>
            <path d="M20 4L4 20"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
