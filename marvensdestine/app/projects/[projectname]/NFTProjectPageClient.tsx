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





  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      window.history.back();
    }
  };

  return (
    <main className={styles.container} onClick={handleBackgroundClick}>
      <div className={styles.modalContent}>
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
            
            {/* Collection Stats */}
            <div className={styles.collectionInfo}>
              <div className={styles.collectionStats}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{project.collectionSize.toLocaleString()}</span>
                  <span className={styles.statLabel}>Items</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{project.mintPrice}</span>
                  <span className={styles.statLabel}>Mint Price</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{project.blockchain}</span>
                  <span className={styles.statLabel}>Blockchain</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{project.status}</span>
                  <span className={styles.statLabel}>Status</span>
                </div>
              </div>
            </div>
          </div>

          {/* Second media item */}
          {project.gallery && project.gallery.length > 1 && (
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
          )}

          {/* Inspiration section */}
          {project.inspiration && (
            <div className={styles.textSection}>
              <h4 className={styles.sectionTitle}>Inspiration</h4>
              <p className={styles.inspirationText}>{project.inspiration}</p>
            </div>
          )}

          {/* Third media item */}
          {project.gallery && project.gallery.length > 2 && (
            <div className={styles.mediaItem}>
              {project.gallery[2].type === 'image' ? (
                <img
                  src={project.gallery[2].src}
                  alt={project.gallery[2].alt || ''}
                  className={styles.fullWidthImage}
                />
              ) : (
                <video
                  src={project.gallery[2].src}
                  className={styles.fullWidthVideo}
                  controls
                  playsInline
                />
              )}
            </div>
          )}

          {/* Artwork showcase sections with media */}
          {project.artworkShowcase && project.artworkShowcase.length > 0 && (
            <>
              {project.artworkShowcase.map((showcase, index) => (
                <div key={index} className={styles.processBlock}>
                  {/* Showcase text */}
                  <div className={styles.textSection}>
                    <h3 className={styles.processTitle}>{showcase.title}</h3>
                    <p className={styles.processDescription}>{showcase.description}</p>
                  </div>
                  
                  {/* Showcase media */}
                  {showcase.media && showcase.media.length > 0 && (
                    <div className={styles.processMedia}>
                      {showcase.media.map((media, mediaIndex) => (
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
                  {project.gallery && project.gallery.length > index + 3 && (
                    <div className={styles.mediaItem}>
                      {project.gallery[index + 3].type === 'image' ? (
                        <img
                          src={project.gallery[index + 3].src}
                          alt={project.gallery[index + 3].alt || ''}
                          className={styles.fullWidthImage}
                        />
                      ) : (
                        <video
                          src={project.gallery[index + 3].src}
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

          {/* Creation Process */}
          {project.creationProcess && project.creationProcess.length > 0 && (
            <div className={styles.textSection}>
              <h4 className={styles.sectionTitle}>Creation Process</h4>
              <ul className={styles.processList}>
                {project.creationProcess.map((step, index) => (
                  <li key={index} className={styles.processItem}>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rarity Distribution */}
          {project.rarity && (
            <div className={styles.textSection}>
              <h4 className={styles.sectionTitle}>Rarity Distribution</h4>
              <div className={styles.rarityInfo}>
                <span className={styles.rarityItem}>Common: {project.rarity.common.toLocaleString()} ({((project.rarity.common / project.collectionSize) * 100).toFixed(1)}%)</span>
                <span className={styles.rarityItem}>Uncommon: {project.rarity.uncommon.toLocaleString()} ({((project.rarity.uncommon / project.collectionSize) * 100).toFixed(1)}%)</span>
                <span className={styles.rarityItem}>Rare: {project.rarity.rare.toLocaleString()} ({((project.rarity.rare / project.collectionSize) * 100).toFixed(1)}%)</span>
                <span className={styles.rarityItem}>Legendary: {project.rarity.legendary.toLocaleString()} ({((project.rarity.legendary / project.collectionSize) * 100).toFixed(1)}%)</span>
              </div>
            </div>
          )}

          {/* Utilities & Roadmap */}
          {(project.utilities || project.roadmap) && (
            <div className={styles.textSection}>
              {project.utilities && (
                <div className={styles.utilitiesSection}>
                  <h4 className={styles.sectionTitle}>Utilities</h4>
                  <ul className={styles.featuresList}>
                    {project.utilities.map((utility, index) => (
                      <li key={index} className={styles.featureItem}>
                        {utility}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.roadmap && (
                <div className={styles.roadmapSection}>
                  <h4 className={styles.sectionTitle}>Roadmap</h4>
                  <ul className={styles.roadmapList}>
                    {project.roadmap.map((milestone, index) => (
                      <li key={index} className={styles.roadmapItem}>
                        {milestone}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
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
              {project.clientType && (
                <div className={styles.metaItem}>
                  <span className={styles.metaValue}>{project.clientType}</span>
                  <span className={styles.metaLabel}>Industry</span>
                </div>
              )}
              {project.communitySize && (
                <div className={styles.metaItem}>
                  <span className={styles.metaValue}>{project.communitySize}</span>
                  <span className={styles.metaLabel}>Community</span>
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

          {/* Marketing Strategy */}
          {project.marketingStrategy && (
            <div className={styles.textSection}>
              <h4 className={styles.sectionTitle}>Marketing Strategy</h4>
              <ul className={styles.marketingList}>
                {project.marketingStrategy.map((strategy, index) => (
                  <li key={index} className={styles.marketingItem}>
                    {strategy}
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
          {project.gallery && project.gallery.length > 3 && project.artworkShowcase && (
            <>
              {project.gallery.slice(3 + (project.artworkShowcase?.length || 0)).map((item, index) => (
                <div key={index + 3 + (project.artworkShowcase?.length || 0)} className={styles.mediaItem}>
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
            <h3 className={styles.footerTitle}>Ready to Launch Your NFT Collection?</h3>
            <p className={styles.footerDescription}>
              Let's create a unique digital art collection that resonates with your community and drives engagement.
            </p>
            <div className={styles.footerActions}>
              <a href="mailto:hello@marvensdestine.com" className={`${styles.footerButton} ${styles.primary}`}>
                Start Your Collection
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