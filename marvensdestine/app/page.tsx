"use client";

import { useState, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import styles from './page.module.css';

// Array of Spline scene URLs with matching content
const splineContent = [
  {
    scene: "https://prod.spline.design/HcZu9MGXXX8KnuVk/scene.splinecode",
    title: "Digital Landscape",
    description: "An abstract visualization of data flowing through digital networks, represented in a 3D spatial environment."
  },
  {
    scene: "https://prod.spline.design/i8eNphGELT2tDQVT/scene.splinecode",
    title: "Geometric Harmony",
    description: "A study in balance and form through precise geometric arrangements in three-dimensional space."
  },
  {
    scene: "https://prod.spline.design/pvM5sSiYV2ivWraz/scene.splinecode",
    title: "Fluid Dynamics",
    description: "Exploring the motion and interaction of abstract elements in a reactive environment."
  },
];

// Extract just the scene URLs for the existing logic
const splineScenes = splineContent.map(item => item.scene);

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [contentTransitioning, setContentTransitioning] = useState(false);
  const [visibleContent, setVisibleContent] = useState(splineContent[0]);
  const [nextContent, setNextContent] = useState(splineContent[0]);
  
  // References to track loaded Spline scenes
  const loadedScenes = useRef<{[key: number]: boolean}>({});

  // Handle scene transition
  const goToScene = (index: number) => {
    if (isTransitioning) return;
    
    // Wrap around if exceeding bounds
    const newIndex = ((index % splineScenes.length) + splineScenes.length) % splineScenes.length;
    
    if (newIndex !== activeIndex) {
      // Start transitions
      setIsTransitioning(true);
      setContentTransitioning(true);
      
      // Prepare next content
      setNextContent(splineContent[newIndex]);
      
      // Update active index immediately for scene transition
      setActiveIndex(newIndex);
      
      // After half the fade-out time, swap content
      setTimeout(() => {
        setVisibleContent(splineContent[newIndex]);
        setContentTransitioning(false);
      }, 400); // Half of the transition time
      
      // After full transition time, end scene transition
      setTimeout(() => {
        setIsTransitioning(false);
      }, 800);
    }
  };

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
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  // Track which scene is loaded
  const handleSceneLoad = (index: number) => {
    loadedScenes.current[index] = true;
  };

  return (
    <div 
      className={styles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Fixed Position Content Section */}
      <div className={styles.contentContainer}>
        <div 
          className={styles.contentSection}
          style={{ 
            opacity: contentTransitioning ? 0 : 1
          }}
        >
          <p className={styles.description}>{visibleContent.description}</p>
          <h1 className={styles.title}>{visibleContent.title}</h1>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className={styles.controlsContainer}>
        <div className={styles.controls}>
          <button 
            className={styles.navButton} 
            onClick={prevScene}
            aria-label="Previous background"
          >
            ←
          </button>
          
          <div className={styles.indicators}>
            {splineScenes.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${activeIndex === index ? styles.activeIndicator : ''}`}
                onClick={() => goToScene(index)}
                aria-label={`Go to background ${index + 1}`}
              />
            ))}
          </div>
          
          <button 
            className={styles.navButton} 
            onClick={nextScene}
            aria-label="Next background"
          >
            →
          </button>
        </div>
      </div>

      {/* Spline Scenes */}
      <div className={styles.scenesContainer}>
        {splineScenes.map((scene, index) => {
          // Only render active scene and adjacent scenes for better performance
          const shouldRender = 
            index === activeIndex || 
            index === (activeIndex + 1) % splineScenes.length || 
            index === ((activeIndex - 1 + splineScenes.length) % splineScenes.length);
            
          return (
            <div 
              key={index}
              className={`${styles.backgroundViewer} ${
                activeIndex === index ? styles.activeScene : ''
              } ${isTransitioning ? styles.transitioning : ''}`}
              style={{
                opacity: activeIndex === index ? 1 : 0,
                display: shouldRender ? 'block' : 'none'
              }}
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
    </div>
  );
}
