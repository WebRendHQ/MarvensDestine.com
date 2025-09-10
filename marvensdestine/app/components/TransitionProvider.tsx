"use client";

import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useRef } from "react";

type TransitionContextValue = {
  navigateWithFade: (href: string) => Promise<void>;
  overlayControls: ReturnType<typeof useAnimationControls>;
  pathname: string | null;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export const usePageTransition = (): TransitionContextValue => {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used within TransitionProvider");
  return ctx;
};

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const overlayControls = useAnimationControls();
  const hasPendingNavRef = useRef(false);

  useEffect(() => {
    if (hasPendingNavRef.current) {
      overlayControls.start({
        opacity: 0,
        backdropFilter: "blur(0px)",
        transition: { duration: 0.25, ease: "easeInOut" },
      });
      hasPendingNavRef.current = false;
    }
  }, [pathname, overlayControls]);

  const navigateWithFade = async (href: string) => {
    hasPendingNavRef.current = true;
    await overlayControls.start({
      opacity: 1,
      backdropFilter: "blur(10px)",
      transition: { duration: 0.18, ease: "easeInOut" },
    });
    router.push(href);
  };

  return (
    <TransitionContext.Provider value={{ navigateWithFade, overlayControls, pathname }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function ContentTransition({ children }: { children: React.ReactNode }) {
  const { overlayControls, pathname } = usePageTransition();

  return (
    <div style={{ position: "relative" }}>
      <AnimatePresence initial={false}>
        <motion.div
          key={pathname || "root"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          style={{ willChange: "opacity" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={overlayControls}
        style={{ position: "absolute", inset: 0, pointerEvents: "none", willChange: "opacity, backdrop-filter", zIndex: 40, background: "rgba(0,0,0,0.9)" }}
      />
    </div>
  );
}


