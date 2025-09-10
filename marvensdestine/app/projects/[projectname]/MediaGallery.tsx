'use client';

import { useState, useRef } from 'react';
// Accept flexible media from Firestore: { type, src | url, alt, caption }
type FlexMediaItem = {
  type: 'image' | 'video';
  src?: string;
  url?: string;
  alt?: string;
  caption?: string;
};
import styles from './MediaGallery.module.css';

interface MediaGalleryProps {
  items: FlexMediaItem[];
  className?: string;
}

export default function MediaGallery({ items, className = '' }: MediaGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<{[key: number]: HTMLVideoElement | null}>({});

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    // Pause all videos when closing lightbox
    Object.values(videoRefs.current).forEach(video => {
      if (video) video.pause();
    });
  };

  const nextItem = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevItem = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleVideoRef = (index: number) => (ref: HTMLVideoElement | null) => {
    videoRefs.current[index] = ref;
  };

  if (!items || items.length === 0) return null;

  return (
    <>
      <div className={`${styles.gallery} ${className}`}>
        {items.map((item, index) => {
          const mediaSrc = item.src || item.url || '';
          return (
          <div
            key={index}
            className={styles.galleryItem}
            onClick={() => openLightbox(index)}
          >
            {item.type === 'image' ? (
              <div className={styles.imageContainer}>
                <img
                  src={mediaSrc}
                  alt={item.alt || ''}
                  className={styles.media}
                  loading="lazy"
                />
                <div className={styles.playOverlay}>
                  <div className={styles.expandIcon}>⚪</div>
                </div>
              </div>
            ) : (
              <div className={styles.videoContainer}>
                <video
                  ref={handleVideoRef(index)}
                  src={mediaSrc}
                  className={styles.media}
                  muted
                  loop
                  playsInline
                  onMouseEnter={(e) => {
                    const video = e.target as HTMLVideoElement;
                    video.play().catch(() => {});
                  }}
                  onMouseLeave={(e) => {
                    const video = e.target as HTMLVideoElement;
                    video.pause();
                    video.currentTime = 0;
                  }}
                />
                <div className={styles.playOverlay}>
                  <div className={styles.playIcon}>▶</div>
                </div>
              </div>
            )}
            {item.caption && (
              <div className={styles.caption}>{item.caption}</div>
            )}
          </div>
        );})}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeLightbox}>
              ✕
            </button>
            
            {currentIndex > 0 && (
              <button className={styles.navButton} style={{ left: '20px' }} onClick={prevItem}>
                ←
              </button>
            )}
            
            {currentIndex < items.length - 1 && (
              <button className={styles.navButton} style={{ right: '20px' }} onClick={nextItem}>
                →
              </button>
            )}

            <div className={styles.lightboxMedia}>
              {items[currentIndex].type === 'image' ? (
                <img
                  src={(items[currentIndex].src || items[currentIndex].url) as string}
                  alt={items[currentIndex].alt || ''}
                  className={styles.lightboxImage}
                />
              ) : (
                <video
                  src={(items[currentIndex].src || items[currentIndex].url) as string}
                  className={styles.lightboxVideo}
                  controls
                  autoPlay
                  loop
                  playsInline
                />
              )}
            </div>

            {items[currentIndex].caption && (
              <div className={styles.lightboxCaption}>
                {items[currentIndex].caption}
              </div>
            )}

            <div className={styles.lightboxCounter}>
              {currentIndex + 1} / {items.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 