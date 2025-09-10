"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Spline from '@splinetool/react-spline';
import { projectsData, nftProjectsData, ProjectType, ProjectData, NFTProjectData } from '@/lib/projectData';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { adaptProject } from '@/lib/projectAdapter';
import styles from '../page.module.css';

// Preloader removed for portfolio page

export default function PortfolioPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [contentTransitioning, setContentTransitioning] = useState(false);
  const [projectType, setProjectType] = useState<ProjectType>('3d');
  // Preloader removed; always render content immediately
  const [loading] = useState(false);
  
  // Projects from Firestore (fallback to local if empty)
  const [remote3d, setRemote3d] = useState<(ProjectData | NFTProjectData)[]>([]);
  const [remoteNft, setRemoteNft] = useState<(ProjectData | NFTProjectData)[]>([]);
  const getCurrent = useCallback((): (ProjectData | NFTProjectData)[] => (
    projectType === '3d' ? (remote3d.length ? remote3d : projectsData) : (remoteNft.length ? remoteNft : nftProjectsData)
  ), [projectType, remote3d, remoteNft]);
  const [visibleContent, setVisibleContent] = useState<ProjectData | NFTProjectData>(getCurrent()[0]);
  
  // New states for scene transition effects
  const [sceneTransition, setSceneTransition] = useState({
    blackScreen: false,
    blur: false,
    isActive: false,
    phase: 'idle' as 'idle' | 'fadeOut' | 'switching' | 'fadeIn'
  });

  // New state for page transition effects
  const [pageTransition, setPageTransition] = useState({
    blackScreen: false,
    blur: false,
    isActive: false
  });
  
  const router = useRouter();
  // Read hash on mount and jump to matching project by slug
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash?.replace('#', '');
    if (!hash) return;
    const list = getCurrent();
    const idx = list.findIndex(p => p.slug === hash);
    if (idx >= 0) {
      setActiveIndex(idx);
      setVisibleContent(list[idx]);
    }
  }, [getCurrent]);

  
  // References to track loaded Spline scenes
  const loadedScenes = useRef<{[key: number]: boolean}>({});

  // Handle navigation to project page with transition
  const handleProjectClick = () => {
    // Start page transition effect
    setPageTransition({
      blackScreen: true,
      blur: true,
      isActive: true
    });

    // Navigate after transition effect starts
    setTimeout(() => {
      router.push(`/projects/${visibleContent.slug}`);
    }, 800);
  };

  // Handle scene transition with effects
  const goToScene = (index: number) => {
    if (isTransitioning) return;
    
    // Wrap around if exceeding bounds
    const currentProjects = getCurrent();
    const newIndex = ((index % currentProjects.length) + currentProjects.length) % currentProjects.length;
    
    if (newIndex !== activeIndex) {
      // Start transition effects - Phase 1: Fade out current scene
      setIsTransitioning(true);
      setContentTransitioning(true);
      setSceneTransition({
        blackScreen: true,
        blur: true,
        isActive: true,
        phase: 'fadeOut'
      });
      
      // Phase 2: Scene switching (complete fade out, prepare for switch)
      setTimeout(() => {
        setSceneTransition(prev => ({
          ...prev,
          phase: 'switching'
        }));
      }, 1000);
      
      // Actually switch the scene during peak darkness/blur
      setTimeout(() => {
        setActiveIndex(newIndex);
        setVisibleContent(currentProjects[newIndex]);
        // Update hash for indexing
        if (typeof window !== 'undefined') {
          const slug = currentProjects[newIndex]?.slug;
          if (slug) {
            history.replaceState(null, '', `#${slug}`);
          }
        }
        setSceneTransition(prev => ({
          ...prev,
          phase: 'fadeIn'
        }));
      }, 1400);
      
      // Phase 3: Start fading in new scene (black screen fade out)
      setTimeout(() => {
        setSceneTransition(prev => ({
          ...prev,
          blackScreen: false
        }));
      }, 1800);
      
      // Phase 4: Blur fade out for dramatic reveal of new scene
      setTimeout(() => {
        setSceneTransition(prev => ({
          ...prev,
          blur: false
        }));
      }, 2400);
      
      // Complete all transitions
      setTimeout(() => {
        setContentTransitioning(false);
        setIsTransitioning(false);
        setSceneTransition({
          blackScreen: false,
          blur: false,
          isActive: false,
          phase: 'idle'
        });
      }, 3600);
    }
  };

  // Handle initial scene load effect
  useEffect(() => {
    if (!loading) {
      // Trigger transition effect on initial load with dramatic timing
      setSceneTransition({
        blackScreen: true,
        blur: true,
        isActive: true,
        phase: 'fadeIn'
      });
      
      // Longer initial pause for dramatic effect
      setTimeout(() => {
        setSceneTransition(prev => ({
          ...prev,
          blackScreen: false
        }));
      }, 1000);
      
      // Slower blur fade for initial reveal
      setTimeout(() => {
        setSceneTransition(prev => ({
          ...prev,
          blur: false
        }));
      }, 1500);
      
      // Complete initial transition
      setTimeout(() => {
        setSceneTransition({
          blackScreen: false,
          blur: false,
          isActive: false,
          phase: 'idle'
        });
      }, 2200);
    }
  }, [loading]);

  // Navigation functions
  const nextScene = () => goToScene(activeIndex + 1);
  const prevScene = () => goToScene(activeIndex - 1);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left -> next scene
      nextScene();
    }
    
    if (touchEnd - touchStart > 100) {
      // Swipe right -> previous scene
      prevScene();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextScene();
      if (e.key === 'ArrowLeft') prevScene();
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleProjectClick();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, visibleContent, nextScene, prevScene, handleProjectClick]);

  // Track which scene is loaded
  const handleSceneLoad = (index: number) => {
    loadedScenes.current[index] = true;
  };

  // Handle project type switching
  const handleProjectTypeSwitch = (newType: ProjectType) => {
    if (newType !== projectType && !isTransitioning) {
      setIsTransitioning(true);
      setContentTransitioning(true);
      
      // Start transition effects
      setSceneTransition({
        blackScreen: true,
        blur: true,
        isActive: true,
        phase: 'fadeOut'
      });
      
      setTimeout(() => {
        setProjectType(newType);
        setActiveIndex(0);
        const newProjects = newType === '3d' ? projectsData : nftProjectsData;
        setVisibleContent(newProjects[0]);
        
        setSceneTransition(prev => ({
          ...prev,
          phase: 'fadeIn'
        }));
      }, 1000);
      
      // Complete transition
      setTimeout(() => {
        setSceneTransition({
          blackScreen: false,
          blur: false,
          isActive: false,
          phase: 'idle'
        });
        setContentTransitioning(false);
        setIsTransitioning(false);
      }, 2000);
    }
  };

  // Update visible content when project type changes
  useEffect(() => {
    const list = getCurrent();
    setVisibleContent(list[activeIndex] || list[0]);
  }, [projectType, remote3d, remoteNft, activeIndex]);

  // Load from Firestore once
  useEffect(() => {
    const load = async () => {
      try {
        const [a, b] = await Promise.all([
          getDocs(collection(db, 'projects')),
          getDocs(collection(db, 'nftProjects')),
        ]);
        const p3d = a.docs.map(d => adaptProject({ type: '3d', ...d.data() }));
        const pnft = b.docs.map(d => adaptProject({ type: 'nft', ...d.data() }));
        if (p3d.length) setRemote3d(p3d as (ProjectData | NFTProjectData)[]);
        if (pnft.length) setRemoteNft(pnft as (ProjectData | NFTProjectData)[]);
      } catch {
        // ignore – fallback to local data
      }
    };
    void load();
  }, [getCurrent]);

  return (
    <>
      {
        <div 
          className={styles.container}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Project Content (Videos or Spline Scenes) */}
          <div className={styles.scenesContainer}>
            {(() => { const currentList = getCurrent(); return currentList.map((project, index) => {
              // Only render active scene and adjacent scenes for better performance
              const shouldRender = 
                index === activeIndex || 
                index === (activeIndex + 1) % currentList.length || 
                index === ((activeIndex - 1 + currentList.length) % currentList.length);

              // Build class names safely
              let sceneClasses = `${styles.backgroundViewer}`;
              if (activeIndex === index) sceneClasses += ` ${styles.activeScene}`;
              if (isTransitioning) sceneClasses += ` ${styles.transitioning}`;
              if (sceneTransition.blur) sceneClasses += ` ${styles.blurred}`;
              if (sceneTransition.phase === 'fadeOut') sceneClasses += ` ${styles.phaseFadeOut}`;
              if (sceneTransition.phase === 'switching') sceneClasses += ` ${styles.phaseSwitching}`;
              if (sceneTransition.phase === 'fadeIn') sceneClasses += ` ${styles.phaseFadeIn}`;
              
              // Add clickable class to active scene
              if (activeIndex === index) sceneClasses += ` ${styles.clickableScene}`;
                
              const hero = (project as ProjectData | NFTProjectData).heroImage as string | undefined;
              const firstGallery = Array.isArray((project as ProjectData | NFTProjectData).gallery) && (project as ProjectData | NFTProjectData).gallery![0] ? (project as ProjectData | NFTProjectData).gallery![0] : null;
              const firstMediaSrc = firstGallery ? (firstGallery.src) : undefined;
              const firstMediaType = firstGallery ? firstGallery.type : undefined;

              return (
                <div 
                  key={index}
                  className={sceneClasses}
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    display: shouldRender ? 'block' : 'none',
                    filter: pageTransition.blur ? 'blur(60px)' : undefined
                  }}
                  onClick={activeIndex === index ? handleProjectClick : undefined}
                  role={activeIndex === index ? "button" : undefined}
                  tabIndex={activeIndex === index ? 0 : -1}
                  onKeyDown={activeIndex === index ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleProjectClick();
                    }
                  } : undefined}
                  aria-label={activeIndex === index ? `View ${project.title} case study` : undefined}
                >
                  {shouldRender && (
                    project.scene && project.scene.trim() !== '' ? (
                      <Spline 
                        scene={project.scene} 
                        onLoad={() => handleSceneLoad(index)}
                      />
                    ) : hero ? (
                      /\.(mp4|webm|mov)(\?.*)?$/i.test(hero) ? (
                        <video src={hero} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay muted loop playsInline />
                      ) : (
                        <img src={hero} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )
                    ) : firstMediaSrc ? (
                      firstMediaType === 'video' ? (
                        <video src={firstMediaSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay muted loop playsInline />
                      ) : (
                        <img src={firstMediaSrc} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )
                    ) : null
                  )}
                </div>
              );
            }); })()}
          </div>

          {/* Scene Transition Overlay */}
          {sceneTransition.isActive && (
            <div 
              className={`${styles.sceneTransitionOverlay} ${
                sceneTransition.blackScreen ? styles.blackScreen : ''
              } ${
                sceneTransition.phase === 'fadeOut' ? styles.overlayFadeOut : ''
              } ${
                sceneTransition.phase === 'switching' ? styles.overlaySwitching : ''
              } ${
                sceneTransition.phase === 'fadeIn' ? styles.overlayFadeIn : ''
              }`}
            />
          )}

          {/* Page Transition Overlay */}
          {pageTransition.isActive && (
            <div 
              className={`${styles.pageTransitionOverlay} ${
                pageTransition.blackScreen ? styles.blackScreen : ''
              }`}
            />
          )}
          
          {/* Curved FOV Container for UI Elements */}
          <div className={styles.curvedFOVContainer}>
            {/* Project Type Toggle - Bottom Left */}
            <div className={styles.toggleContainer}>
              <div className={styles.projectToggle}>
                <button
                  className={`${styles.toggleButton} ${projectType === '3d' ? styles.active : ''}`}
                  onClick={() => handleProjectTypeSwitch('3d')}
                  disabled={isTransitioning}
                  title="3D Projects"
                  aria-label="3D Projects"
                >
                  {/* 3D Cube Icon */}
                  <svg className={styles.toggleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </button>
                <button
                  className={`${styles.toggleButton} ${projectType === 'nft' ? styles.active : ''}`}
                  onClick={() => handleProjectTypeSwitch('nft')}
                  disabled={isTransitioning}
                  title="NFT Collections"
                  aria-label="NFT Collections"
                >
                  {/* Bored Ape Outline Icon */}
                  <svg className={styles.toggleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* Ape face outline */}
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="8" cy="10" r="1.5" fill="currentColor"/>
                    <circle cx="16" cy="10" r="1.5" fill="currentColor"/>
                    <path d="M9 16c1 1 3 1 6 0"/>
                    <path d="M6 8c0-2 2-3 6-3s6 1 6 3"/>
                    <path d="M7 15c0 1 1 2 2 2h6c1 0 2-1 2-2"/>
                  </svg>
                </button>
                <div className={`${styles.toggleSlider} ${projectType === 'nft' ? styles.nftPosition : ''}`} />
              </div>
            </div>

            {/* Socials moved to global layout */}

            {/* Fixed Position Content Section */}
            <div className={styles.contentContainer}>
              <div 
                className={styles.contentSection}
                style={{ 
                  opacity: contentTransitioning ? 0 : 1
                }}
              >
                <div className={`${styles.minimalistContent} ${projectType === 'nft' ? styles.nftContent : ''}`}>
                  <h1 className={styles.projectTitle}>
                    {visibleContent.title}
                  </h1>
                  <p className={styles.projectDescription}>
                    {visibleContent.description}
                  </p>
                  
                  {/* NFT-specific metadata */}
                  {projectType === 'nft' && (
                    <div className={styles.nftMetadata}>
                      <div className={styles.nftStats}>
                        <span className={styles.nftStat}>
                          <span className={styles.statLabel}>Supply:</span>
                          <span className={styles.statValue}>{(visibleContent as NFTProjectData).collectionSize?.toLocaleString()}</span>
                        </span>
                        <span className={styles.nftStat}>
                          <span className={styles.statLabel}>Blockchain:</span>
                          <span className={styles.statValue}>{(visibleContent as NFTProjectData).blockchain}</span>
                        </span>
                        <span className={styles.nftStat}>
                          <span className={styles.statLabel}>Price:</span>
                          <span className={styles.statValue}>{(visibleContent as NFTProjectData).mintPrice}</span>
                        </span>
                        <span className={styles.nftStat}>
                          <span className={styles.statLabel}>Status:</span>
                          <span className={`${styles.statValue} ${styles.statusBadge} ${styles[`status${(visibleContent as NFTProjectData).status.replace(/\s+/g, '').toLowerCase()}`] || ''}`}>
                            {(visibleContent as NFTProjectData).status
                          }</span>
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <button
                    className={styles.scheduleButton}
                    onClick={() => router.push('/discovery')}
                    aria-label="Schedule Discovery Call"
                  >
                    Schedule Discovery Call
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Controls - Centered at bottom */}
            <div className={styles.controlsContainer}>
              <div className={styles.controls}>
                <div className={styles.indicators}>
                  {getCurrent().map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.indicator} ${activeIndex === index ? styles.activeIndicator : ''}`}
                      onClick={() => goToScene(index)}
                      aria-label={`Project ${index + 1}`}
                      disabled={isTransitioning}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Arrows - Screen Edges */}
            <button 
              className={`${styles.navArrow} ${styles.navArrowLeft}`}
              onClick={prevScene}
              aria-label="Previous project"
              disabled={isTransitioning}
            >
              ←
            </button>
            
            <button 
              className={`${styles.navArrow} ${styles.navArrowRight}`}
              onClick={nextScene}
              aria-label="Next project"
              disabled={isTransitioning}
            >
              →
            </button>
          </div>
          
          {/* Screen effects */}
          <div className={styles.scanlines}></div>
          <div className={styles.vignette}></div>
        </div>
      }
    </>
  );
}


