import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorSection}>
          <div className={styles.errorCode}>404</div>
          <div className={styles.errorTitle}>MISSION NOT FOUND</div>
          <div className={styles.errorMessage}>
            &gt; ACCESS DENIED: The requested operation does not exist in our database.
          </div>
          <div className={styles.errorDetails}>
            This could be due to:
            <ul>
              <li>Invalid operation code</li>
              <li>Classified mission beyond your clearance level</li>
              <li>Operation has been terminated or archived</li>
            </ul>
          </div>
        </div>
        
        <div className={styles.actions}>
          <Link href="/" className={styles.returnButton}>
            ← RETURN TO MISSION OVERVIEW
          </Link>
        </div>
      </div>
      
      {/* Screen effects */}
      <div className={styles.scanlines}></div>
      <div className={styles.vignette}></div>
    </main>
  );
} 