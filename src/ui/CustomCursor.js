/**
 * CustomCursor
 * Desktop-only cursor treatment: a brass dot with a trailing ring that grows
 * over interactive elements and shows contextual labels from data-cursor-label.
 * Falls back to the native cursor on touch devices and reduced motion.
 *
 * Usage:
 *   import { CustomCursor } from './ui/CustomCursor.js';
 *   CustomCursor();
 */

const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)');
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');
const INTERACTIVE = 'a, button, [role="button"], [data-cursor-label]';

export function CustomCursor() {
  if (!FINE_POINTER.matches || REDUCED_MOTION.matches) return null;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');

  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span');
  label.className = 'cursor-ring__label';
  ring.appendChild(label);

  document.body.append(dot, ring);
  document.documentElement.classList.add('has-custom-cursor');

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let dotX = targetX;
  let dotY = targetY;
  let ringX = targetX;
  let ringY = targetY;
  let visible = false;
  let hovered = null;
  let frame = 0;

  const setVisible = (next) => {
    if (visible === next) return;
    visible = next;
    dot.classList.toggle('is-visible', next);
    ring.classList.toggle('is-visible', next);
  };

  const setHovered = (element) => {
    hovered = element;
    const labeled = Boolean(element?.dataset.cursorLabel);
    dot.classList.toggle('is-active', Boolean(element));
    ring.classList.toggle('is-active', Boolean(element) && !labeled);
    ring.classList.toggle('is-labeled', labeled);
    label.textContent = labeled ? element.dataset.cursorLabel : '';
  };

  const onPointerMove = (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!visible) {
      dotX = ringX = targetX;
      dotY = ringY = targetY;
      setVisible(true);
    }
    const hit = event.target instanceof Element ? event.target.closest(INTERACTIVE) : null;
    if (hit !== hovered) setHovered(hit);
  };

  const onPointerDown = () => ring.classList.add('is-pressed');
  const onPointerUp = () => ring.classList.remove('is-pressed');
  const onPointerLeave = () => setVisible(false);

  const onVideoOpen = (event) => {
    if (!(event.target instanceof Element) || !event.target.closest('.phase__video-play')) return;
    setHovered(null);
    setVisible(false);
  };

  const tick = () => {
    dotX += (targetX - dotX) * 0.55;
    dotY += (targetY - dotY) * 0.55;
    ringX += (targetX - ringX) * 0.16;
    ringY += (targetY - ringY) * 0.16;
    dot.style.transform = `translate3d(${dotX.toFixed(2)}px, ${dotY.toFixed(2)}px, 0)`;
    ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0)`;
    frame = requestAnimationFrame(tick);
  };

  document.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('pointerdown', onPointerDown, { passive: true });
  document.addEventListener('pointerup', onPointerUp, { passive: true });
  document.addEventListener('pointerleave', onPointerLeave);
  document.addEventListener('click', onVideoOpen);
  frame = requestAnimationFrame(tick);

  return {
    dot,
    ring,
    destroy() {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('click', onVideoOpen);
      document.documentElement.classList.remove('has-custom-cursor');
      dot.remove();
      ring.remove();
    },
  };
}
