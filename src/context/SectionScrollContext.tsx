import React, { createContext, useCallback, useContext, useRef } from 'react';
import { ScrollView } from 'react-native';

/**
 * The three report sections, all rendered on one scrollable page
 * (AllSectionsScreen) - the hamburger menu no longer navigates between
 * separate screens, it scrolls this shared ScrollView to the tapped
 * section instead.
 */
export type SectionKey = 'charts' | 'chartAnalysis' | 'dasha';

type ScrollViewRef = React.ElementRef<typeof ScrollView>;

interface SectionScrollContextValue {
  scrollViewRef: React.RefObject<ScrollViewRef | null>;
  registerSectionOffset: (key: SectionKey, y: number) => void;
  scrollToSection: (key: SectionKey) => void;
}

const SectionScrollContext = createContext<SectionScrollContextValue | undefined>(undefined);

export function SectionScrollProvider({ children }: { children: React.ReactNode }) {
  const scrollViewRef = useRef<ScrollViewRef>(null);
  // A plain ref (not state) - section offsets are written from onLayout on
  // every render but should never themselves trigger a re-render.
  const offsets = useRef<Partial<Record<SectionKey, number>>>({});

  const registerSectionOffset = useCallback((key: SectionKey, y: number) => {
    offsets.current[key] = y;
  }, []);

  const scrollToSection = useCallback((key: SectionKey) => {
    const y = offsets.current[key];
    if (y === undefined || !scrollViewRef.current) {
      return;
    }
    scrollViewRef.current.scrollTo({ y: Math.max(y - 8, 0), animated: true });
  }, []);

  const value: SectionScrollContextValue = { scrollViewRef, registerSectionOffset, scrollToSection };

  return <SectionScrollContext.Provider value={value}>{children}</SectionScrollContext.Provider>;
}

export function useSectionScroll(): SectionScrollContextValue {
  const ctx = useContext(SectionScrollContext);
  if (!ctx) {
    throw new Error('useSectionScroll must be used within a SectionScrollProvider');
  }
  return ctx;
}
