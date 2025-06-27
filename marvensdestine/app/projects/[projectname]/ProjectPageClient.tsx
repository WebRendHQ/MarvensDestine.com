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

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      window.history.back();
    }
  };

  return (
    <main className={styles.container} onClick={handleBackgroundClick}>
      <div className={styles.modalContent}>
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
            3D PROJECT
          </div>
        </header>

        {/* Main Content */}
        <div className={styles.behanceContent}>
          {/* First hero media */}
          {project.gallery && project.gallery.length > 0 && (
            <div className={styles.mediaItem}>
              {project.gallery[0].type === 'image' ? (
                <img
                  src={project.gallery[0].src}
                  alt={project.gallery[0].alt || ''}
                  className={styles.fullWidthImage}
                />
              ) : (
                <video
                  src={project.gallery[0].src}
                  className={styles.fullWidthVideo}
                  controls
                  playsInline
                />
              )}
            </div>
          )}

          {/* Project title and description */}
          <div className={styles.textSection}>
            <h1 className={styles.projectTitle}>{project.title}</h1>
            <p className={styles.projectDescription}>
              {project.fullDescription || project.description}
            </p>
            
            {project.technologies && (
              <div className={styles.techList}>
                <span className={styles.techLabel}>Technologies:</span>
                <span className={styles.techText}>{project.technologies.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Remaining gallery media interspersed with process */}
          {project.gallery && project.gallery.length > 1 && (
            <>
              {/* Second media item */}
              <div className={styles.mediaItem}>
                {project.gallery[1].type === 'image' ? (
                  <img
                    src={project.gallery[1].src}
                    alt={project.gallery[1].alt || ''}
                    className={styles.fullWidthImage}
                  />
                ) : (
                  <video
                    src={project.gallery[1].src}
                    className={styles.fullWidthVideo}
                    controls
                    playsInline
                  />
                )}
              </div>
            </>
          )}

          {/* Process sections with media */}
          {project.process && project.process.length > 0 && (
            <>
              {project.process.map((step, index) => (
                <div key={index} className={styles.processBlock}>
                  {/* Process text */}
                  <div className={styles.textSection}>
                    <h3 className={styles.processTitle}>{step.title}</h3>
                    <p className={styles.processDescription}>{step.description}</p>
                  </div>
                  
                  {/* Process media */}
                  {step.media && step.media.length > 0 && (
                    <div className={styles.processMedia}>
                      {step.media.map((media, mediaIndex) => (
                        <div key={mediaIndex} className={styles.mediaItem}>
                          {media.type === 'image' ? (
                            <img
                              src={media.src}
                              alt={media.alt || ''}
                              className={styles.fullWidthImage}
                            />
                          ) : (
                            <video
                              src={media.src}
                              className={styles.fullWidthVideo}
                              controls
                              playsInline
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Intersperse remaining gallery items */}
                  {project.gallery && project.gallery.length > index + 2 && (
                    <div className={styles.mediaItem}>
                      {project.gallery[index + 2].type === 'image' ? (
                        <img
                          src={project.gallery[index + 2].src}
                          alt={project.gallery[index + 2].alt || ''}
                          className={styles.fullWidthImage}
                        />
                      ) : (
                        <video
                          src={project.gallery[index + 2].src}
                          className={styles.fullWidthVideo}
                          controls
                          playsInline
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* Project Meta Information */}
          <div className={styles.textSection}>
            <div className={styles.projectMeta}>
              {project.projectDuration && (
                <div className={styles.metaItem}>
                  <span className={styles.metaValue}>{project.projectDuration}</span>
                  <span className={styles.metaLabel}>Duration</span>
                </div>
              )}
              {project.budget && (
                <div className={styles.metaItem}>
                  <span className={styles.metaValue}>{project.budget}</span>
                  <span className={styles.metaLabel}>Budget Range</span>
                </div>
              )}
              {project.clientType && (
                <div className={styles.metaItem}>
                  <span className={styles.metaValue}>{project.clientType}</span>
                  <span className={styles.metaLabel}>Industry</span>
                </div>
              )}
            </div>
          </div>

          {/* Services Provided */}
          {project.services && (
            <div className={styles.textSection}>
              <h4 className={styles.sectionTitle}>Services Provided</h4>
              <ul className={styles.servicesList}>
                {project.services.map((service, index) => (
                  <li key={index} className={styles.serviceItem}>
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Deliverables */}
          {project.deliverables && (
            <div className={styles.textSection}>
              <h4 className={styles.sectionTitle}>Key Deliverables</h4>
              <ul className={styles.deliverablesList}>
                {project.deliverables.map((deliverable, index) => (
                  <li key={index} className={styles.deliverableItem}>
                    {deliverable}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Challenges & Solutions */}
          {(project.challenges || project.solutions) && (
            <div className={styles.textSection}>
              {project.challenges && (
                <div className={styles.clientSection}>
                  <h4 className={styles.sectionTitle}>Challenges</h4>
                  <ul className={styles.challengesList}>
                    {project.challenges.map((challenge, index) => (
                      <li key={index} className={styles.challengeItem}>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {project.solutions && (
                <div className={styles.clientSection}>
                  <h4 className={styles.sectionTitle}>Solutions</h4>
                  <ul className={styles.solutionsList}>
                    {project.solutions.map((solution, index) => (
                      <li key={index} className={styles.solutionItem}>
                        {solution}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {project.results && (
            <div className={styles.textSection}>
              <h4 className={styles.resultsTitle}>Results & Impact</h4>
              <ul className={styles.results}>
                {project.results.map((result, index) => (
                  <li key={index} className={styles.resultItem}>
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Client Testimonial */}
          {project.testimonial && (
            <div className={styles.testimonial}>
              <div className={styles.testimonialQuote}>"{project.testimonial.quote}"</div>
              <div className={styles.testimonialAuthor}>{project.testimonial.author}</div>
              <div className={styles.testimonialCompany}>{project.testimonial.company}</div>
            </div>
          )}

          {/* Any remaining gallery items */}
          {project.gallery && project.gallery.length > 2 && project.process && (
            <>
              {project.gallery.slice(2 + (project.process?.length || 0)).map((item, index) => (
                <div key={index + 2 + (project.process?.length || 0)} className={styles.mediaItem}>
                  {item.type === 'image' ? (
                    <img
                      src={item.src}
                      alt={item.alt || ''}
                      className={styles.fullWidthImage}
                    />
                  ) : (
                    <video
                      src={item.src}
                      className={styles.fullWidthVideo}
                      controls
                      playsInline
                    />
                  )}
                </div>
              ))}
            </>
          )}

          {/* Project Footer */}
          <div className={styles.projectFooter}>
            <h3 className={styles.footerTitle}>Ready to Start Your Project?</h3>
            <p className={styles.footerDescription}>
              Let's collaborate to bring your vision to life with cutting-edge 3D visualization and interactive experiences.
            </p>
            <div className={styles.footerActions}>
              <a href="mailto:hello@marvensdestine.com" className={`${styles.footerButton} ${styles.primary}`}>
                Start a Project
              </a>
              <a href="/" className={styles.footerButton}>
                View More Work
              </a>
            </div>
          </div>
        </div>
      </div>

        {/* Screen Effects */}
        <div className={styles.scanlines}></div>
        <div className={styles.vignette}></div>
      </div>
    </main>
  );
} 