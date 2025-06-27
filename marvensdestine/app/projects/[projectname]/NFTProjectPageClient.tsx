'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Spline from '@splinetool/react-spline';
import { NFTProjectData } from '@/lib/projectData';
import styles from './page.module.css';

interface NFTProjectPageClientProps {
  project: NFTProjectData;
}

export default function NFTProjectPageClient({ project }: NFTProjectPageClientProps) {
  const [pageTransition, setPageTransition] = useState({
    blackScreen: true,
    blur: true,
    isActive: true
  });

  // Handle page fade-in effect
  useEffect(() => {
    // Start fade-in after component mounts
    const timer1 = setTimeout(() => {
      setPageTransition(prev => ({
        ...prev,
        blackScreen: false
      }));
    }, 300);

    const timer2 = setTimeout(() => {
      setPageTransition(prev => ({
        ...prev,
        blur: false
      }));
    }, 600);

    const timer3 = setTimeout(() => {
      setPageTransition({
        blackScreen: false,
        blur: false,
        isActive: false
      });
    }, 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);





  return (
    <main className={styles.container}>
      {/* Background Media */}
      <div 
        className={styles.backgroundViewer}
        style={{
          filter: pageTransition.blur ? 'blur(60px)' : 'blur(20px)',
          transition: 'filter 1s cubic-bezier(0.25, 0.1, 0.25, 1)'
        }}
      >
        {project.scene && project.scene.trim() !== '' ? (
          <Spline scene={project.scene} />
        ) : (
          <div className={styles.fallbackBackground}>
            <div className={styles.gradientBackground} />
          </div>
        )}
      </div>

      {/* Page Transition Overlay */}
      {pageTransition.isActive && (
        <div 
          className={`${styles.pageTransitionOverlay} ${
            pageTransition.blackScreen ? styles.blackScreen : ''
          }`}
        />
      )}

      {/* Content Overlay */}
      <div 
        className={styles.contentOverlay}
        style={{
          opacity: pageTransition.isActive ? 0 : 1,
          transition: 'opacity 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) 0.4s'
        }}
      >
        {/* Header Navigation */}
        <header className={styles.header}>
          <Link href="/" className={styles.backButton}>
            ← BACK TO PORTFOLIO
          </Link>
          <div className={styles.classification}>
            NFT COLLECTION
          </div>
        </header>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <div className={styles.briefingHeader}>
            <div className={styles.titleSection}>
              <span className={styles.prefix}>&gt; NFT COLLECTION:</span>
              <h1 className={styles.title}>{project.title}</h1>
              <div className={styles.statusBadge} data-status={project.status.toLowerCase()}>
                {project.status}
              </div>
            </div>
          </div>

          {/* Collection Overview */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>&gt; COLLECTION OVERVIEW</h2>
            <p className={styles.description}>
              {project.fullDescription || project.description}
            </p>
          </section>

          {/* Collection Details Grid */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>&gt; COLLECTION DETAILS</h2>
            <div className={styles.dataGrid}>
              <div className={styles.dataCard}>
                <div className={styles.dataLabel}>COLLECTION SIZE</div>
                <div className={styles.dataValue}>{project.collectionSize.toLocaleString()}</div>
              </div>
              <div className={styles.dataCard}>
                <div className={styles.dataLabel}>BLOCKCHAIN</div>
                <div className={styles.dataValue}>{project.blockchain}</div>
              </div>
              <div className={styles.dataCard}>
                <div className={styles.dataLabel}>MINT PRICE</div>
                <div className={styles.dataValue}>{project.mintPrice}</div>
              </div>
              <div className={styles.dataCard}>
                <div className={styles.dataLabel}>STATUS</div>
                <div className={styles.dataValue}>{project.status}</div>
              </div>
            </div>
          </section>

          {/* Rarity Distribution */}
          {project.rarity && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>&gt; RARITY DISTRIBUTION</h2>
              <div className={styles.rarityGrid}>
                <div className={styles.rarityCard}>
                  <div className={styles.rarityLabel}>COMMON</div>
                  <div className={styles.rarityValue}>{project.rarity.common.toLocaleString()}</div>
                  <div className={styles.rarityPercentage}>
                    {((project.rarity.common / project.collectionSize) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className={styles.rarityCard}>
                  <div className={styles.rarityLabel}>UNCOMMON</div>
                  <div className={styles.rarityValue}>{project.rarity.uncommon.toLocaleString()}</div>
                  <div className={styles.rarityPercentage}>
                    {((project.rarity.uncommon / project.collectionSize) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className={styles.rarityCard}>
                  <div className={styles.rarityLabel}>RARE</div>
                  <div className={styles.rarityValue}>{project.rarity.rare.toLocaleString()}</div>
                  <div className={styles.rarityPercentage}>
                    {((project.rarity.rare / project.collectionSize) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className={styles.rarityCard}>
                  <div className={styles.rarityLabel}>LEGENDARY</div>
                  <div className={styles.rarityValue}>{project.rarity.legendary.toLocaleString()}</div>
                  <div className={styles.rarityPercentage}>
                    {((project.rarity.legendary / project.collectionSize) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Utilities & Roadmap */}
          <div className={styles.twoColumnGrid}>
            {project.utilities && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>&gt; UTILITIES</h2>
                <ul className={styles.utilitiesList}>
                  {project.utilities.map((utility, index) => (
                    <li key={index} className={styles.utility}>
                      <span className={styles.utilityBullet}>›</span>
                      {utility}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {project.roadmap && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>&gt; ROADMAP</h2>
                <ul className={styles.roadmapList}>
                  {project.roadmap.map((milestone, index) => (
                    <li key={index} className={styles.roadmapItem}>
                      <span className={styles.roadmapNumber}>{String(index + 1).padStart(2, '0')}</span>
                      {milestone}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Artist Statement & Technical Specs */}
          <div className={styles.twoColumnGrid}>
            {project.artistStatement && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>&gt; ARTIST STATEMENT</h2>
                <div className={styles.artistStatement}>
                  {project.artistStatement}
                </div>
              </section>
            )}

            {project.technicalSpecs && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>&gt; TECHNICAL SPECS</h2>
                <div className={styles.technicalSpecs}>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>FORMAT:</span>
                    <span className={styles.specValue}>{project.technicalSpecs.format}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>RESOLUTION:</span>
                    <span className={styles.specValue}>{project.technicalSpecs.resolution}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>METADATA:</span>
                    <span className={styles.specValue}>{project.technicalSpecs.metadata}</span>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Screen Effects */}
      <div className={styles.scanlines}></div>
      <div className={styles.vignette}></div>
    </main>
  );
} 