'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Spline from '@splinetool/react-spline';
import { NFTProjectData } from '@/lib/projectData';
import styles from './page.module.css';

interface NFTProjectPageClientProps {
  project: NFTProjectData;
}

export default function NFTProjectPageClient({ project }: NFTProjectPageClientProps) {
  // Page transition handled globally; local state not needed

  // Handle page fade-in effect
  useEffect(() => {}, []);





  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      window.history.back();
    }
  };

  return (
    <main className={styles.brutWrap} onClick={handleBackgroundClick}>
      <header className={styles.brutHeader}>
        <Link href="/portfolio" className={styles.brutBack}>← Back</Link>
        <div className={styles.brutTag}>NFT Collection</div>
      </header>
      <div className={styles.brutMain}>
        <h1 className={styles.brutTitle}>{project.title}</h1>
        <p className={styles.brutDesc}>{project.fullDescription || project.description}</p>

        <section className={styles.brutHero}>
          {project.scene && project.scene.trim() !== '' ? (
            <Spline scene={project.scene} />
          ) : project.heroImage ? (
            project.heroImage.match(/\.(mp4|webm|mov)(\?.*)?$/i) ? (
              <video src={project.heroImage} className={styles.brutMedia} autoPlay muted loop playsInline />
            ) : (
              <img src={project.heroImage} alt={project.title} className={styles.brutMedia} />
            )
          ) : null}
        </section>

        <section className={styles.brutMeta}>
          <div className={styles.brutCell}><div className={styles.brutLabel}>Items</div><div className={styles.brutValue}>{project.collectionSize.toLocaleString()}</div></div>
          <div className={styles.brutCell}><div className={styles.brutLabel}>Mint Price</div><div className={styles.brutValue}>{project.mintPrice}</div></div>
          <div className={styles.brutCell}><div className={styles.brutLabel}>Blockchain</div><div className={styles.brutValue}>{project.blockchain}</div></div>
          <div className={styles.brutCell}><div className={styles.brutLabel}>Status</div><div className={styles.brutValue}>{project.status}</div></div>
        </section>

        {project.gallery?.length ? (
          <section className={styles.brutSection}>
            <h4 className={styles.brutH4}>Gallery</h4>
            <div className={styles.brutGrid}>
              {project.gallery.map((m, i)=> (
                <div key={i} className={styles.brutCard}>
                  {m.type === 'video' ? (
                    <video src={m.src as string} className={styles.brutMedia} controls playsInline />
                  ) : (
                    <img src={m.src as string} className={styles.brutMedia} alt={m.alt || ''} />
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {project.inspiration ? (
          <section className={styles.brutSection}>
            <h4 className={styles.brutH4}>Inspiration</h4>
            <p className={styles.brutDesc}>{project.inspiration}</p>
          </section>
        ) : null}

        {project.creationProcess?.length ? (
          <section className={styles.brutSection}>
            <h4 className={styles.brutH4}>Creation Process</h4>
            <ul className={styles.brutList}>{project.creationProcess.map((s,i)=>(<li key={i} className={styles.brutItem}>{s}</li>))}</ul>
          </section>
        ) : null}

        {project.utilities?.length || project.roadmap?.length ? (
          <section className={styles.brutSection}>
            <div className={styles.brutGrid}>
              {project.utilities?.length ? (
                <div className={styles.brutCard}><h4 className={styles.brutH4}>Utilities</h4><ul className={styles.brutList}>{project.utilities.map((u,i)=>(<li key={i} className={styles.brutItem}>{u}</li>))}</ul></div>
              ) : null}
              {project.roadmap?.length ? (
                <div className={styles.brutCard}><h4 className={styles.brutH4}>Roadmap</h4><ul className={styles.brutList}>{project.roadmap.map((u,i)=>(<li key={i} className={styles.brutItem}>{u}</li>))}</ul></div>
              ) : null}
            </div>
          </section>
        ) : null}

        {project.testimonial ? (
          <section className={styles.brutSection}>
            <h4 className={styles.brutH4}>Testimonial</h4>
            <div style={{ fontStyle:'italic', color:'#cfcfcf' }}>&quot;{project.testimonial.quote}&quot;</div>
            <div style={{ marginTop:6, color:'#a9a9a9' }}>{project.testimonial.author} · {project.testimonial.company}</div>
          </section>
        ) : null}

        <section className={styles.brutSection}>
          <div className={styles.brutGrid}>
            <a href="mailto:hello@marvensdestine.com" className={styles.brutCard}>Start Your Collection</a>
            <Link href="/" className={styles.brutCard}>View More Work</Link>
          </div>
        </section>
      </div>
    </main>
  );
} 