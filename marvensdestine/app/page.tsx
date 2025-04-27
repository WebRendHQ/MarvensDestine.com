"use client";

import { useState, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import styles from './page.module.css';

// Array of Spline scene URLs with matching content
const splineContent = [
  {
    scene: "https://prod.spline.design/HcZu9MGXXX8KnuVk/scene.splinecode",
    title: "Operation Watchkeeper",
    description: "Reconnaissance of critical infrastructure with advanced geospatial mapping and satellite surveillance systems. Identified multiple access points and potential vulnerabilities in target area.",
    opCode: "OW-71225",
    status: "ACTIVE",
    clearance: "LEVEL 4",
    location: "SECTOR 7, GRID 19-A",
    priority: "ALPHA"
  },
  {
    scene: "https://prod.spline.design/i8eNphGELT2tDQVT/scene.splinecode",
    title: "Operation Deadbolt",
    description: "Deployment of tactical countermeasures and defensive perimeter systems following intelligence of hostile incursion. All strategic assets secured and monitoring systems operational.",
    opCode: "OD-85311",
    status: "STANDBY",
    clearance: "LEVEL 3",
    location: "SECTOR 2, GRID 08-C",
    priority: "BRAVO"
  },
  {
    scene: "https://prod.spline.design/pvM5sSiYV2ivWraz/scene.splinecode",
    title: "Operation Blacksite",
    description: "Extraction and containment of high-value intelligence assets from compromised facility. Data analysis indicates 86% success rate with current tactical approach.",
    opCode: "OB-42780",
    status: "PENDING",
    clearance: "LEVEL 5",
    location: "SECTOR 9, GRID 32-F",
    priority: "DELTA"
  },
];

// Extract just the scene URLs for the existing logic
const splineScenes = splineContent.map(item => item.scene);

// CodeLoader component to show a code loading animation
const CodeLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const codeLines = [
    "> INITIATING DOD SECURE BOOT PROTOCOL v3.11.5",
    "> VERIFYING KERNEL INTEGRITY... PASS",
    "> ESTABLISHING SATCOM LINK... CONNECTED",
    "> AUTHORIZATION REQUIRED...",
    "> BIOMETRIC SCAN COMPLETE",
    "> CLEARANCE VERIFIED: TIER-1 TACTICAL",
    "> ENCRYPTED COMM CHANNELS ACTIVE",
    "> BRIEFING DATABASE ACCESSED",
    "> SENSITIVE COMPARTMENTED INFORMATION LOADED",
    "> TACTICAL INTERFACE ONLINE"
  ];

  useEffect(() => {
    let currentLine = 0;
    let currentProgress = 0;

    const addLine = () => {
      if (currentLine < codeLines.length) {
        setLines(prev => [...prev, codeLines[currentLine]]);
        currentLine++;
        setTimeout(addLine, Math.random() * 250 + 200);
      }
    };

    const incrementProgress = () => {
      if (currentProgress < 100) {
        currentProgress += Math.floor(Math.random() * 3) + 1;
        if (currentProgress > 100) currentProgress = 100;
        setProgress(currentProgress);
        
        if (currentProgress === 100) {
          setTimeout(() => {
            onComplete();
          }, 800);
        } else {
          setTimeout(incrementProgress, Math.random() * 80 + 40);
        }
      }
    };

    addLine();
    incrementProgress();
  }, [onComplete]);

  return (
    <div className={styles.preloader}>
      <div className={styles.codeTerminal}>
        {lines.map((line, index) => (
          <div key={index} className={styles.codeLine}>
            {line}
          </div>
        ))}
      </div>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${progress}%` }}
        />
        <div className={styles.progressText}>SECURE INITIALIZATION {progress}%</div>
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
  const [visibleContent, setVisibleContent] = useState(splineContent[0]);
  const [loading, setLoading] = useState(true);
  
  // Mouse tracking for sway effect
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(-15); // Base rotation
  
  // References to track loaded Spline scenes
  const loadedScenes = useRef<{[key: number]: boolean}>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle scene transition
  const goToScene = (index: number) => {
    if (isTransitioning) return;
    
    // Wrap around if exceeding bounds
    const newIndex = ((index % splineScenes.length) + splineScenes.length) % splineScenes.length;
    
    if (newIndex !== activeIndex) {
      // Start transitions
      setIsTransitioning(true);
      setContentTransitioning(true);
      
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

  // Mouse movement handler for sway effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      const { clientX, clientY } = e;
      
      // Calculate mouse position relative to the center of the container
      const x = (clientX / clientWidth - 0.5) * 2; // -1 to 1
      const y = (clientY / clientHeight - 0.5) * 2; // -1 to 1
      
      // Apply smooth rotation based on mouse position
      setRotateX(-y * 5); // Tilt up/down based on Y position
      setRotateY(-15 + x * 8); // Swivel left/right based on X position
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

  // Calculate dynamic styles for sway effect
  const contentStyle = {
    transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    transition: 'transform 0.2s ease-out'
  };
  
  const controlsStyle = {
    transform: `perspective(1200px) rotateX(${rotateX * 0.8}deg) rotateY(${rotateY * 0.8}deg)`,
    transition: 'transform 0.2s ease-out'
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
          onMouseMove={handleMouseMove}
          ref={containerRef}
        >
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
          
          {/* Curved FOV Container for UI Elements */}
          <div className={styles.curvedFOVContainer}>
            {/* Fixed Position Content Section */}
            <div className={styles.contentContainer}>
              <div 
                className={`${styles.contentSection} ${styles.techContent}`}
                style={{ 
                  opacity: contentTransitioning ? 0 : 1,
                  ...contentStyle
                }}
              >
                <div className={styles.titleBox}>
                  <div className={styles.titleHeader}>
                    <span className={styles.titlePrefix}>&gt; MISSION BRIEF:</span>
                    <span className={styles.titleBlinker}></span>
                  </div>
                  <h1 className={styles.title}>{visibleContent.title}</h1>
                </div>
                <p className={styles.description}>
                  <span className={styles.descPrefix}>&gt; SITREP:</span> {visibleContent.description}
                </p>
                
                <div className={styles.missionData}>
                  <div className={styles.missionColumn}>
                    <div className={styles.missionLabel}>OPERATION CODE</div>
                    <div className={styles.missionValue}>{visibleContent.opCode}</div>
                  </div>
                  <div className={styles.missionColumn}>
                    <div className={styles.missionLabel}>STATUS</div>
                    <div className={styles.missionValue}>{visibleContent.status}</div>
                  </div>
                  <div className={styles.missionColumn}>
                    <div className={styles.missionLabel}>CLEARANCE</div>
                    <div className={styles.missionValue}>{visibleContent.clearance}</div>
                  </div>
                  <div className={styles.missionColumn}>
                    <div className={styles.missionLabel}>LOCATION</div>
                    <div className={styles.missionValue}>{visibleContent.location}</div>
                  </div>
                  <div className={styles.missionColumn}>
                    <div className={styles.missionLabel}>PRIORITY</div>
                    <div className={styles.missionValue}>{visibleContent.priority}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Controls - Centered at bottom */}
            <div className={styles.controlsContainer}>
              <div 
                className={styles.controls}
                style={controlsStyle}
              >
                <button 
                  className={styles.navButton} 
                  onClick={prevScene}
                  aria-label="Previous mission"
                >
                  ←
                </button>
                
                <div className={styles.indicators}>
                  {splineScenes.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.indicator} ${activeIndex === index ? styles.activeIndicator : ''}`}
                      onClick={() => goToScene(index)}
                      aria-label={`Mission ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button 
                  className={styles.navButton} 
                  onClick={nextScene}
                  aria-label="Next mission"
                >
                  →
                </button>
              </div>
            </div>
          </div>
          
          {/* Screen effects */}
          <div className={styles.scanlines}></div>
          <div className={styles.vignette}></div>
        </div>
      )}
    </>
  );
}
