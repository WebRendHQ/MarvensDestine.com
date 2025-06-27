"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Spline from '@splinetool/react-spline';
import { projectsData, nftProjectsData, ProjectType, ProjectData, NFTProjectData } from '@/lib/projectData';
import styles from './page.module.css';

// CodeLoader component to show a minimal Apple-like loading animation
const CodeLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let currentProgress = 0;

    const incrementProgress = () => {
      if (currentProgress < 100) {
        currentProgress += Math.floor(Math.random() * 8) + 3; // Faster increment
        if (currentProgress > 100) currentProgress = 100;
        setProgress(currentProgress);
        
        if (currentProgress === 100) {
          setTimeout(() => {
            onComplete();
          }, 200); // Much faster completion
        } else {
          setTimeout(incrementProgress, Math.random() * 30 + 20); // Much faster timing
        }
      }
    };

    // Start immediately with faster timing
    setTimeout(incrementProgress, 100);
  }, [onComplete]);

  return (
    <div className={styles.preloader}>
      <div className={styles.loaderContent}>
        <div className={styles.loadingText}>
          Loading
        </div>
        <div className={styles.progressContainer}>
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressIndicator} 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [contentTransitioning, setContentTransitioning] = useState(false);
  const [projectType, setProjectType] = useState<ProjectType>('3d');
  const [loading, setLoading] = useState(true);
  
  // Get current projects based on selected type
  const currentProjects = projectType === '3d' ? projectsData : nftProjectsData;
  const [visibleContent, setVisibleContent] = useState<ProjectData | NFTProjectData>(currentProjects[0]);
  

  
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
  }, [activeIndex, visibleContent]);

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
    setVisibleContent(currentProjects[activeIndex] || currentProjects[0]);
  }, [projectType, currentProjects, activeIndex]);

  return (
    <>
      {loading ? (
        <CodeLoader onComplete={() => setLoading(false)} />
      ) : (
        <div 
          className={styles.container}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Project Content (Videos or Spline Scenes) */}
          <div className={styles.scenesContainer}>
            {currentProjects.map((project, index) => {
              // Only render active scene and adjacent scenes for better performance
              const shouldRender = 
                index === activeIndex || 
                index === (activeIndex + 1) % currentProjects.length || 
                index === ((activeIndex - 1 + currentProjects.length) % currentProjects.length);



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
                  {shouldRender && project.scene && project.scene.trim() !== '' && (
                    <Spline 
                      scene={project.scene} 
                      onLoad={() => handleSceneLoad(index)}
                    />
                  )}
                </div>
              );
            })}
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

            {/* Social Media Island - Top Right */}
            <div className={styles.socialsContainer}>
              <div className={styles.socialsIsland}>
                <a 
                  href="https://linkedin.com/in/yourprofile" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.socialButton}
                  aria-label="LinkedIn"
                >
                  <span className={styles.socialIcon}>in</span>
                </a>
                <a 
                  href="https://instagram.com/yourprofile" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.socialButton}
                  aria-label="Instagram"
                >
                  <span className={styles.socialIcon}>ig</span>
                </a>
                <a 
                  href="https://x.com/yourprofile" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.socialButton}
                  aria-label="X (Twitter)"
                >
                  <span className={styles.socialIcon}>𝕏</span>
                </a>
              </div>
            </div>

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
                            {(visibleContent as NFTProjectData).status}
                          </span>
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
                  {currentProjects.map((_, index) => (
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
      )}
    </>
  );
}
