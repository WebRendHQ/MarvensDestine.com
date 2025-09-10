"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "../page.module.css";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [current, setCurrent] = useState(children);
  const [next, setNext] = useState<React.ReactNode | null>(null);
  const [enterActive, setEnterActive] = useState(false);
  const [exitActive, setExitActive] = useState(false);
  const prevPathRef = useRef(pathname);
  const DURATION_MS = 180;
  const stagedRef = useRef<React.ReactNode | null>(null);

  // On route change, cross-fade layers (absolute stack)
  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      stagedRef.current = children;
      setNext(children);        // mount next as hidden layer
      setEnterActive(false);    // ensure next starts invisible
      setExitActive(true);      // start fading out current
      const raf = requestAnimationFrame(() => setEnterActive(true)); // fade in next
      const done = setTimeout(() => {
        setCurrent(stagedRef.current as React.ReactNode); // commit
        setNext(null);
        setExitActive(false);
        prevPathRef.current = pathname;
      }, DURATION_MS);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(done);
      };
    }
  }, [pathname, children]);

  return (
    <div className={styles.pageStack}>
      <div className={`${styles.pageLayer} ${exitActive ? styles.pageExitActive : ""}`}>{current}</div>
      {next && (
        <div className={`${styles.pageLayer} ${enterActive ? styles.pageEnterActive : styles.pageEnterInit}`}>
          {next}
        </div>
      )}
    </div>
  );
}


