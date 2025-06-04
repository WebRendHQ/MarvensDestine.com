"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Spline from '@splinetool/react-spline';
import { projectsData } from '@/lib/projectData';
import styles from './page.module.css';

// Extract just the scene URLs for the existing logic
const splineScenes = projectsData.map(item => item.scene);

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
  const [visibleContent, setVisibleContent] = useState(projectsData[0]);
  const [loading, setLoading] = useState(true);
  
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
    const newIndex = ((index % splineScenes.length) + splineScenes.length) % splineScenes.length;
    
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
        setVisibleContent(projectsData[newIndex]);
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
          {/* Spline Scenes */}
          <div className={styles.scenesContainer}>
            {splineScenes.map((scene, index) => {
              // Only render active scene and adjacent scenes for better performance
              const shouldRender = 
                index === activeIndex || 
                index === (activeIndex + 1) % splineScenes.length || 
                index === ((activeIndex - 1 + splineScenes.length) % splineScenes.length);

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
                  aria-label={activeIndex === index ? `View ${projectsData[index].title} case study` : undefined}
                >
                  {shouldRender && (
                    <Spline 
                      scene={scene} 
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
                <div className={styles.minimalistContent}>
                  <h1 className={styles.projectTitle}>
                    {visibleContent.title}
                  </h1>
                  <p className={styles.projectDescription}>
                    {visibleContent.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Controls - Centered at bottom */}
            <div className={styles.controlsContainer}>
              <div className={styles.controls}>
                <div className={styles.indicators}>
                  {splineScenes.map((_, index) => (
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
