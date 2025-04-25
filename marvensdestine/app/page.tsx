"use client";

import Spline from '@splinetool/react-spline';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.backgroundViewer}>
        <Spline scene="https://prod.spline.design/HcZu9MGXXX8KnuVk/scene.splinecode" />
      </div>
    </div>
  );
}
