"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_CATALOG_TOP_OFFSET = 96;
const HEADER_HIDE_SCROLL_THRESHOLD = 96;

export function useHeaderState() {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [catalogTopOffset, setCatalogTopOffset] = useState(
    DEFAULT_CATALOG_TOP_OFFSET,
  );
  const lastScrollYRef = useRef(0);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (isCatalogOpen) {
        setIsHeaderHidden(false);
        lastScrollYRef.current = window.scrollY;
        return;
      }

      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollYRef.current;

      setIsHeaderHidden(
        isScrollingDown && currentScrollY > HEADER_HIDE_SCROLL_THRESHOLD,
      );
      lastScrollYRef.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isCatalogOpen]);

  useEffect(() => {
    const updateCatalogTopOffset = () => {
      const nextTopOffset =
        headerRef.current?.getBoundingClientRect().bottom ??
        DEFAULT_CATALOG_TOP_OFFSET;

      setCatalogTopOffset(nextTopOffset);
    };

    updateCatalogTopOffset();

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => updateCatalogTopOffset());

    if (headerRef.current && resizeObserver) {
      resizeObserver.observe(headerRef.current);
    }

    window.addEventListener("resize", updateCatalogTopOffset);
    window.addEventListener("scroll", updateCatalogTopOffset, {
      passive: true,
    });

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateCatalogTopOffset);
      window.removeEventListener("scroll", updateCatalogTopOffset);
    };
  }, []);

  const toggleCatalog = () => {
    setIsCatalogOpen((currentState) => !currentState);
  };

  return {
    catalogTopOffset,
    headerRef,
    isCatalogOpen,
    isHeaderHidden,
    toggleCatalog,
  };
}
