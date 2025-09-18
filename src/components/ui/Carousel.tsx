"use client";

import React, { useRef, useEffect, useState } from "react";

type CarouselProps = {
  children: React.ReactNode;
  className?: string;
  itemMinWidth?: number; // px
  autoplay?: boolean;
  interval?: number; // ms (used to derive speed)
  pauseOnHover?: boolean;
  showControls?: boolean;
  speedFactor?: number; // multiplier to slow/speed up movement (1 = default)
};

export default function Carousel({
  children,
  className = "",
  itemMinWidth = 220,
  autoplay = true,
  interval = 4000,
  pauseOnHover = true,
  showControls = false,
  speedFactor = 0.6,
}: CarouselProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [itemWidth, setItemWidth] = useState(itemMinWidth);
  const items = React.Children.toArray(children);
  const [repeatCount, setRepeatCount] = useState(2);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // derive a pixel/second speed from interval (interval = ms per item roughly)
  // derive a pixel/second speed from interval (interval = ms per item roughly)
  // apply speedFactor to reduce/increase movement; default 0.6 to slow down
  const baseSpeed = Math.floor(
    (itemWidth || itemMinWidth) / Math.max(0.1, interval / 1000)
  );
  const speed = Math.max(6, Math.floor(baseSpeed * (speedFactor ?? 1)));

  // recompute item width on resize to fit a reasonable number of items
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const compute = () => {
      const w = el.clientWidth || window.innerWidth;
      let visible = 1;
      if (w >= 1200) visible = 4;
      else if (w >= 992) visible = 3;
      else if (w >= 640) visible = 2;
      else visible = 1;
      const calc = Math.max(Math.floor(w / visible) - 16, itemMinWidth);
      setItemWidth(calc);

      // ensure we have enough duplicated content to scroll continuously
      if (items.length > 0) {
        const totalOneSet = calc * items.length;
        const needed = Math.ceil((w * 2) / Math.max(1, totalOneSet));
        const clamped = Math.max(2, Math.min(10, needed));
        setRepeatCount(clamped);
      }
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [itemMinWidth, items.length]);

  // continuous scrolling via rAF (infinite loop by duplicating children)
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !autoplay) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return; // respect user preference

    const step = (time: number) => {
      if (isPaused) {
        lastTimeRef.current = time;
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      const last = lastTimeRef.current ?? time;
      const dt = Math.max(0, time - last);
      lastTimeRef.current = time;

      const dx = (speed * dt) / 1000; // pixels to move this frame
      viewport.scrollLeft += dx;

      const half = viewport.scrollWidth / 2;
      if (viewport.scrollLeft >= half) {
        viewport.scrollLeft = viewport.scrollLeft - half;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame((t) => {
      lastTimeRef.current = t;
      rafRef.current = requestAnimationFrame(step);
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = null;
    };
  }, [autoplay, isPaused, speed]);

  // pause handlers (mouse + touch + focus)
  const onPointerEnter = () => pauseOnHover && setIsPaused(true);
  const onPointerLeave = () => pauseOnHover && setIsPaused(false);
  const onTouchStart = () => pauseOnHover && setIsPaused(true);
  const onTouchEnd = () => pauseOnHover && setIsPaused(false);

  // duplicated children for seamless loop (repeatCount times)
  const duplicated = Array.from({ length: repeatCount }).flatMap(() => items);

  return (
    <div className={`relative ${className}`}>
      {/* left gradient overlay */}
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10 hidden sm:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
        }}
      />
      {/* right gradient overlay */}
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10 hidden sm:block"
        style={{
          background:
            "linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
        }}
      />

      {showControls ? (
        <button
          aria-label="Anterior"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-2 shadow-sm hidden sm:inline-flex"
          onClick={() => {
            const sc = scrollerRef.current;
            if (!sc) return;
            sc.scrollLeft = Math.max(0, sc.scrollLeft - (itemWidth + 12));
          }}
        >
          <i className="bi bi-chevron-left text-lg" />
        </button>
      ) : null}

      <div
        ref={viewportRef}
        className="relative overflow-x-auto hide-scrollbar"
        onMouseEnter={onPointerEnter}
        onMouseLeave={onPointerLeave}
        onFocus={onPointerEnter}
        onBlur={onPointerLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ scrollBehavior: "auto" }}
      >
        <div
          ref={scrollerRef}
          className="flex gap-3 items-stretch"
          style={{ alignItems: "stretch" }}
        >
          {duplicated.map((child, i) => (
            <div
              key={i}
              className="flex-shrink-0"
              style={{ width: itemWidth, minWidth: itemWidth }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {showControls ? (
        <button
          aria-label="Próximo"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-2 shadow-sm hidden sm:inline-flex"
          onClick={() => {
            const sc = scrollerRef.current;
            if (!sc) return;
            sc.scrollLeft = sc.scrollLeft + (itemWidth + 12);
          }}
        >
          <i className="bi bi-chevron-right text-lg" />
        </button>
      ) : null}
    </div>
  );
}
