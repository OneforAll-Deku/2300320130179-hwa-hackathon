/**
 * MaskedHeading
 * Vanilla JS component for a text-masked heading that reveals a background
 * (metallic gradient by default; swap the --mask-heading-bg custom property
 * for a video URL if needed) through the letters.
 *
 * Features:
 * - Accepts a headline string
 * - CSS background-clip text mask with metallic gradient reveal
 * - Cursor-following spotlight
 * - Subtle 1px brass (#b98a3c) outline for readability on bright/dark frames
 * - Fully responsive, text-wrap: balance
 * - Respects prefers-reduced-motion
 *
 * Usage:
 *   import { MaskedHeading } from './ui/MaskedHeading.js';
 *   MaskedHeading({ el: document.querySelector('.hero-title'), text: 'PawClock' });
 */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');
const BRASS = '#b98a3c';

export function MaskedHeading({
  el,
  text,
  tag = 'h1',
  background = 'gradient', // 'gradient' | 'video'
  videoSrc,
} = {}) {
  const container = typeof el === 'string' ? document.querySelector(el) : el;
  if (!container) return null;

  // Build DOM
  const heading = document.createElement(tag);
  heading.className = 'masked-heading';
  heading.setAttribute('data-masked-heading', '');
  heading.style.textWrap = 'balance';

  const textSpan = document.createElement('span');
  textSpan.className = 'masked-heading__text';
  textSpan.textContent = text;
  textSpan.style.textWrap = 'balance';
  heading.appendChild(textSpan);

  const spotlight = document.createElement('div');
  spotlight.className = 'masked-heading__spotlight';
  heading.appendChild(spotlight);

  // Optional video layer behind the text mask
  if (background === 'video' && videoSrc) {
    const video = document.createElement('video');
    video.src = videoSrc;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.className = 'masked-heading__bg-video';
    video.setAttribute('aria-hidden', 'true');
    video.play().catch(() => { /* autoplay may be blocked */ });
    heading.prepend(video);
  }

  container.innerHTML = '';
  container.appendChild(heading);

  const motionObserver =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          ([entry]) => {
            heading.classList.toggle('is-paused', !entry.isIntersecting)
          },
          { rootMargin: '120px' }
        )
      : null;
  motionObserver?.observe(heading);

  const reduced = REDUCED_MOTION.matches;
  let raf = null;

  const updateSpotlight = (event) => {
    if (reduced) return;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const rect = heading.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      spotlight.style.left = `${x}px`;
      spotlight.style.top = `${y}px`;
      spotlight.style.opacity = '0.55';
    });
  };

  const hideSpotlight = () => {
    if (reduced) return;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      spotlight.style.opacity = '0';
    });
  };

  heading.addEventListener('mousemove', updateSpotlight);
  heading.addEventListener('mouseleave', hideSpotlight);

  REDUCED_MOTION.addEventListener('change', () => {
    spotlight.style.transition = reduced ? 'none' : '';
  });

  return {
    element: heading,
    destroy() {
      heading.removeEventListener('mousemove', updateSpotlight);
      heading.removeEventListener('mouseleave', hideSpotlight);
      motionObserver?.disconnect();
      REDUCED_MOTION.removeEventListener('change', () => {});
    },
  };
}
