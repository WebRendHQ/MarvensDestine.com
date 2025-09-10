"use client";

import { usePathname } from "next/navigation";
import { usePageTransition } from "./TransitionProvider";
import { useAuth } from "./AuthProvider";
import styles from "../page.module.css";

export default function BottomNav() {
  const pathname = usePathname();
  const { navigateWithFade } = usePageTransition();
  const { isAdmin } = useAuth();
  const isHome = pathname === "/";
  const isPortfolio = pathname?.startsWith("/portfolio") ?? false;
  const isDiscovery = pathname?.startsWith("/discovery") ?? false;
  const sliderClass = isHome ? "navPos0" : isPortfolio ? "navPos1" : isDiscovery ? "navPos2" : "navPos3";
  const isAdminPath = pathname?.startsWith('/admin') ?? false;

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.projectToggle}>
        <button
          onClick={() => navigateWithFade("/")}
          className={`${styles.toggleButton} ${isHome ? styles.active : ""}`}
          aria-label="Home"
          aria-current={isHome ? "page" : undefined}
        >
          <svg className={styles.toggleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12l9-7 9 7"/>
            <path d="M9 21V9h6v12"/>
          </svg>
        </button>
        <button
          onClick={() => navigateWithFade("/portfolio")}
          className={`${styles.toggleButton} ${isPortfolio ? styles.active : ""}`}
          aria-label="Portfolio"
          aria-current={isPortfolio ? "page" : undefined}
        >
          <svg className={styles.toggleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="14" rx="3" ry="3"/>
            <path d="M8 10h8"/>
          </svg>
        </button>
        <button
          onClick={() => navigateWithFade("/discovery")}
          className={`${styles.toggleButton} ${isDiscovery ? styles.active : ""}`}
          aria-label="Discovery"
          aria-current={isDiscovery ? "page" : undefined}
        >
          <svg className={styles.toggleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M14.31 8l5.74 9.94"/>
            <path d="M9.69 8h11.48"/>
            <path d="M7.38 12l5.74-9.94"/>
            <path d="M9.69 16L3.95 6.06"/>
            <path d="M14.31 16H2.83"/>
            <path d="M16.62 12l-5.74 9.94"/>
          </svg>
        </button>
        {/* Admin icon shown only to admins via env allow-list; link always present but discoverable by UI conditions (optional to guard in future) */}
        <button
          onClick={() => navigateWithFade("/admin")}
          className={`${styles.toggleButton} ${isAdminPath ? styles.active : ""}`}
          aria-label="Admin"
          aria-current={isAdminPath ? "page" : undefined}
          style={{ display: isAdmin ? 'flex' : 'none' }}
        >
          <svg className={styles.toggleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .66.26 1.3.73 1.77.47.47 1.11.73 1.77.73a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
        <a
          href="mailto:hello@marvensdestine.com"
          className={styles.toggleButton}
          aria-label="Email"
        >
          <svg className={styles.toggleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16v16H4z"/>
            <path d="M22 6l-10 7L2 6"/>
          </svg>
        </a>
        <div className={`${styles.toggleSlider} ${styles[sliderClass]}`} />
      </div>
    </nav>
  );
}


