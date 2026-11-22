/**
 * SpotlightCard
 * Gives phase cards and product cards a tactile, machined-metallic feel on desktop.
 * Wraps each target card with a cursor-tracking spotlight overlay: a soft radial
 * gradient highlight (rgba(185,138,60,0.15)) that follows the pointer and fades
 * out smoothly on mouse leave.
 *
 * Usage:
 *   import { SpotlightCard } from './ui/SpotlightCard.js';
 *   SpotlightCard({ selector: '.phase' });
 *   SpotlightCard({ selector: '.buy__card' });
 */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');

export function SpotlightCard({ selector } = {}) {
  const cards = document.querySelectorAll(selector);
  if (!cards.length) return null;

  cards.forEach((card) => {
    if (card.classList.contains('spotlight-card')) return;

    card.classList.add('spotlight-card');
    card.style.position = 'relative';
    card.style.overflow = 'hidden';

    // Move existing children into an inner wrapper so the overlay can sit on top.
    const inner = document.createElement('div');
    inner.className = 'spotlight-card__inner';
    while (card.firstChild) {
      inner.appendChild(card.firstChild);
    }
    card.appendChild(inner);

    const overlay = document.createElement('div');
    overlay.className = 'spotlight-card__overlay';
    card.appendChild(overlay);

    const updatePosition = (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--sx', `${x}%`);
      card.style.setProperty('--sy', `${y}%`);
      if (!card.classList.contains('is-hovered')) {
        card.classList.add('is-hovered');
      }
    };

    const enter = () => {
      card.classList.add('is-hovered');
    };

    const leave = () => {
      if (REDUCED_MOTION.matches) {
        card.classList.remove('is-hovered');
        return;
      }
      card.classList.remove('is-hovered');
    };

    card._spotlightHandlers = { updatePosition, enter, leave };

    card.addEventListener('mousemove', updatePosition);
    card.addEventListener('mouseenter', enter);
    card.addEventListener('mouseleave', leave);
  });

  REDUCED_MOTION.addEventListener('change', () => {
    cards.forEach((card) => {
      if (REDUCED_MOTION.matches) {
        card.classList.remove('is-hovered');
      }
    });
  });

  return {
    cards,
    destroy() {
      cards.forEach((card) => {
        const h = card._spotlightHandlers;
        if (h) {
          card.removeEventListener('mousemove', h.updatePosition);
          card.removeEventListener('mouseenter', h.enter);
          card.removeEventListener('mouseleave', h.leave);
        }
        card.classList.remove('spotlight-card', 'is-hovered');
      });
    },
  };
}
