/**
 * CursorLens
 * Desktop-only cursor treatment inspired by open-source trailing-cursor and
 * ripple patterns and built from the PawClock materials: a cream lens with a
 * brass rim and teal core that trails the pointer, with brass ripple rings on
 * click. Falls back to the native cursor on touch devices and reduced motion.
 *
 * Usage:
 *   import { CursorLens } from './ui/CursorLens.js';
 *   CursorLens();
 */

const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)');
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');
const INTERACTIVE = 'a, button, [role="button"]';

export function CursorLens() {
  if (!FINE_POINTER.matches || REDUCED_MOTION.matches) return null;

  const lens = document.createElement('div');
  lens.className = 'cursor-lens';
  lens.setAttribute('aria-hidden', 'true');

  const core = document.createElement('div');
  core.className = 'cursor-core';
  core.setAttribute('aria-hidden', 'true');

  document.body.append(lens, core);
  document.documentElement.classList.add('has-cursor-lens');

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let lensX = targetX;
  let lensY = targetY;
  let visible = false;
  let hovered = null;
  let frame = 0;

  const setVisible = (next) => {
    if (visible === next) return;
    visible = next;
    lens.classList.toggle('is-visible', next);
    core.classList.toggle('is-visible', next);
  };

  const setHovered = (element) => {
    hovered = element;
    lens.classList.toggle('is-active', Boolean(element));
    core.classList.toggle('is-active', Boolean(element));
  };

  const spawnRipple = (x, y) => {
    const ripple = document.createElement('span');
    ripple.className = 'cursor-ripple';
    ripple.setAttribute('aria-hidden', 'true');
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  };

  const onPointerMove = (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!visible) {
      lensX = targetX;
      lensY = targetY;
      setVisible(true);
    }
    core.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
    const hit = event.target instanceof Element ? event.target.closest(INTERACTIVE) : null;
    if (hit !== hovered) setHovered(hit);
  };

  const onPointerDown = (event) => {
    core.classList.add('is-pressed');
    lens.classList.add('is-pressed');
    spawnRipple(event.clientX, event.clientY);
  };

  const onPointerUp = () => {
    core.classList.remove('is-pressed');
    lens.classList.remove('is-pressed');
  };

  const onPointerLeave = () => setVisible(false);

  const onVideoOpen = (event) => {
    if (!(event.target instanceof Element) || !event.target.closest('.phase__video-play')) return;
    setHovered(null);
    setVisible(false);
  };

  const tick = () => {
    lensX += (targetX - lensX) * 0.22;
    lensY += (targetY - lensY) * 0.22;
    lens.style.transform = `translate3d(${lensX.toFixed(2)}px, ${lensY.toFixed(2)}px, 0)`;
    frame = requestAnimationFrame(tick);
  };

  document.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('pointerdown', onPointerDown, { passive: true });
  document.addEventListener('pointerup', onPointerUp, { passive: true });
  document.addEventListener('pointerleave', onPointerLeave);
  document.addEventListener('click', onVideoOpen);
  frame = requestAnimationFrame(tick);

  return {
    lens,
    core,
    destroy() {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('click', onVideoOpen);
      document.documentElement.classList.remove('has-cursor-lens');
      lens.remove();
      core.remove();
    },
  };
}
