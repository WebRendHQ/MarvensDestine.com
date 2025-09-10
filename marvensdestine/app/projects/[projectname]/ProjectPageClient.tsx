'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Spline from '@splinetool/react-spline';
import { ProjectData } from '@/lib/projectData';
import styles from './page.module.css';

interface ProjectPageClientProps {
  project: ProjectData;
}

export default function ProjectPageClient({ project }: ProjectPageClientProps) {
  // Page transition handled globally; local state not needed

  // Handle page fade-in effect
  useEffect(() => {}, []);

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      window.history.back();
    }
  };

  const getMediaSrc = (s?: string) => s || '';
  const hero = project.heroImage || '';

  return (
    <main className={styles.brutWrap} onClick={handleBackgroundClick}>
      <header className={styles.brutHeader}>
        <Link href="/portfolio" className={styles.brutBack}>← Back</Link>
        <div className={styles.brutTag}>3D Project</div>
      </header>
      <div className={styles.brutMain}>
        <h1 className={styles.brutTitle}>{project.title}</h1>
        <p className={styles.brutDesc}>{project.fullDescription || project.description}</p>

        {/* Hero / Scene */}
        <section className={styles.brutHero}>
          {project.scene && project.scene.trim() !== '' ? (
            <Spline scene={project.scene} />
          ) : hero ? (
            hero.match(/\.(mp4|webm|mov)(\?.*)?$/i) ? (
              <video src={getMediaSrc(hero)} className={styles.brutMedia} autoPlay muted loop playsInline />
            ) : (
              <img src={getMediaSrc(hero)} alt={project.title} className={styles.brutMedia} />
            )
          ) : null}
        </section>

        {/* Meta grid */}
        <section className={styles.brutMeta}>
          {project.projectDuration && (
            <div className={styles.brutCell}>
              <div className={styles.brutLabel}>Duration</div>
              <div className={styles.brutValue}>{project.projectDuration}</div>
            </div>
          )}
          {project.budget && (
            <div className={styles.brutCell}>
              <div className={styles.brutLabel}>Budget</div>
              <div className={styles.brutValue}>{project.budget}</div>
            </div>
          )}
          {project.clientType && (
            <div className={styles.brutCell}>
              <div className={styles.brutLabel}>Client</div>
              <div className={styles.brutValue}>{project.clientType}</div>
            </div>
          )}
          {project.technologies?.length ? (
            <div className={styles.brutCell}>
              <div className={styles.brutLabel}>Tech</div>
              <div className={styles.brutValue}>{project.technologies.join(', ')}</div>
            </div>
          ) : null}
        </section>

        {/* Gallery simple grid */}
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

        {/* Copy sections */}
        {project.services?.length ? (
          <section className={styles.brutSection}>
            <h4 className={styles.brutH4}>Services</h4>
            <ul className={styles.brutList}>
              {project.services.map((s,i)=> <li key={i} className={styles.brutItem}>{s}</li>)}
            </ul>
          </section>
        ) : null}

        {project.deliverables?.length ? (
          <section className={styles.brutSection}>
            <h4 className={styles.brutH4}>Deliverables</h4>
            <ul className={styles.brutList}>
              {project.deliverables.map((s,i)=> <li key={i} className={styles.brutItem}>{s}</li>)}
            </ul>
          </section>
        ) : null}

        {(project.challenges?.length || project.solutions?.length) ? (
          <section className={styles.brutSection}>
            <h4 className={styles.brutH4}>Challenges / Solutions</h4>
            <div className={styles.brutGrid}>
              {project.challenges?.length ? (
                <div className={styles.brutCard}>
                  <h4 className={styles.brutH4}>Challenges</h4>
                  <ul className={styles.brutList}>{project.challenges.map((c,i)=> <li key={i} className={styles.brutItem}>{c}</li>)}</ul>
                </div>
              ) : null}
              {project.solutions?.length ? (
                <div className={styles.brutCard}>
                  <h4 className={styles.brutH4}>Solutions</h4>
                  <ul className={styles.brutList}>{project.solutions.map((c,i)=> <li key={i} className={styles.brutItem}>{c}</li>)}</ul>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {project.results?.length ? (
          <section className={styles.brutSection}>
            <h4 className={styles.brutH4}>Results</h4>
            <ul className={styles.brutList}>{project.results.map((r,i)=> <li key={i} className={styles.brutItem}>{r}</li>)}</ul>
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
            <a href="mailto:hello@marvensdestine.com" className={styles.brutCard}>Start a Project</a>
            <Link href="/" className={styles.brutCard}>View More Work</Link>
          </div>
        </section>
      </div>
    </main>
  );
} 