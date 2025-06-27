'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Spline from '@splinetool/react-spline';
import { ProjectData } from '@/lib/projectData';
import styles from './page.module.css';

interface ProjectPageClientProps {
  project: ProjectData;
}

export default function ProjectPageClient({ project }: ProjectPageClientProps) {
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
      {/* Spline Background */}
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
            CASE STUDY
          </div>
        </header>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <div className={styles.briefingHeader}>
            <div className={styles.titleSection}>
              <span className={styles.prefix}>&gt; PROJECT CASE STUDY:</span>
              <h1 className={styles.title}>{project.title}</h1>
              <div className={styles.statusBadge} data-status={project.status.toLowerCase()}>
                {project.status}
              </div>
            </div>
          </div>

          {/* Project Overview */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>&gt; PROJECT OVERVIEW</h2>
            <p className={styles.description}>
              {project.fullDescription || project.description}
            </p>
          </section>

          {/* Project Data Grid */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>&gt; PROJECT DETAILS</h2>
            <div className={styles.dataGrid}>
              <div className={styles.dataCard}>
                <div className={styles.dataLabel}>PROJECT CODE</div>
                <div className={styles.dataValue}>{project.opCode}</div>
              </div>
              <div className={styles.dataCard}>
                <div className={styles.dataLabel}>PRIORITY LEVEL</div>
                <div className={styles.dataValue}>{project.priority}</div>
              </div>
              <div className={styles.dataCard}>
                <div className={styles.dataLabel}>SCOPE</div>
                <div className={styles.dataValue}>{project.clearance}</div>
              </div>
              <div className={styles.dataCard}>
                <div className={styles.dataLabel}>TIMELINE</div>
                <div className={styles.dataValue}>{project.timeline || 'ONGOING'}</div>
              </div>
            </div>
          </section>

          {/* Objectives */}
          {project.objectives && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>&gt; PROJECT GOALS</h2>
              <ul className={styles.objectivesList}>
                {project.objectives.map((objective, index) => (
                  <li key={index} className={styles.objective}>
                    <span className={styles.objectiveNumber}>{String(index + 1).padStart(2, '0')}</span>
                    {objective}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Team & Technologies */}
          <div className={styles.twoColumnGrid}>
            {project.personnel && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>&gt; TEAM</h2>
                <div className={styles.personnelInfo}>
                  <div className={styles.personnelItem}>
                    <span className={styles.personnelLabel}>PROJECT LEAD:</span>
                    <span className={styles.personnelValue}>{project.personnel.commander}</span>
                  </div>
                  <div className={styles.personnelItem}>
                    <span className={styles.personnelLabel}>TEAM SIZE:</span>
                    <span className={styles.personnelValue}>{project.personnel.operatives}</span>
                  </div>
                  <div className={styles.personnelItem}>
                    <span className={styles.personnelLabel}>EXPERTISE:</span>
                    <div className={styles.specializationTags}>
                      {project.personnel.specialization.map((spec, index) => (
                        <span key={index} className={styles.specializationTag}>
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {project.assets && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>&gt; TECHNOLOGIES USED</h2>
                <ul className={styles.assetsList}>
                  {project.assets.map((asset, index) => (
                    <li key={index} className={styles.asset}>
                      {asset}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Location & Challenge */}
          <div className={styles.twoColumnGrid}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>&gt; PROJECT CONTEXT</h2>
              <div className={styles.locationInfo}>
                <div className={styles.locationItem}>
                  <span className={styles.locationLabel}>INDUSTRY:</span>
                  <span className={styles.locationValue}>{project.location}</span>
                </div>
                {project.coordinates && (
                  <>
                    <div className={styles.locationItem}>
                      <span className={styles.locationLabel}>SCALE:</span>
                      <span className={styles.locationValue}>
                        {project.coordinates.latitude}, {project.coordinates.longitude}
                      </span>
                    </div>
                    <div className={styles.locationItem}>
                      <span className={styles.locationLabel}>COMPLEXITY:</span>
                      <span className={styles.locationValue}>{project.coordinates.elevation}</span>
                    </div>
                  </>
                )}
              </div>
            </section>

            {project.riskAssessment && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>&gt; CHALLENGES FACED</h2>
                <div className={styles.riskAssessment}>
                  {project.riskAssessment}
                </div>
              </section>
            )}
          </div>

          {/* Project Classification Footer */}
          {project.classification && (
            <footer className={styles.classificationFooter}>
              <div className={styles.classificationLevel}>
                {project.classification.level}
              </div>
              <div className={styles.classificationDetails}>
                <div className={styles.compartments}>
                  CATEGORIES: {project.classification.compartments.join(', ')}
                </div>
                <div className={styles.distribution}>
                  VISIBILITY: {project.classification.distribution}
                </div>
              </div>
            </footer>
          )}
        </div>
      </div>

      {/* Screen Effects */}
      <div className={styles.scanlines}></div>
      <div className={styles.vignette}></div>
    </main>
  );
} 