"use client";

import Spline from '@splinetool/react-spline';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.backgroundViewer} style={{ position: 'fixed', inset: 0 }}>
        <Spline scene="https://prod.spline.design/LCPLcgj8YV5dKCQH/scene.splinecode" />
      </div>
      <div className={styles.scanlines}></div>
      <div className={styles.vignette}></div>
    </div>
  );
}
