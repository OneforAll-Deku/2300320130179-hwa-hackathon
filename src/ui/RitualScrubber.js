/**
 * RitualScrubber
 * Interactive 2-hour timeline scrubber for the PawClock ritual section.
 * Lets users click or drag across the 4 phases. When a phase is selected,
 * it shows the phase name, duration, canine neurological state, and a quick
 * link to jump to that phase card.
 *
 * Usage:
 *   import { RitualScrubber } from './ui/RitualScrubber.js';
 *   RitualScrubber({ el: document.querySelector('.ritual-scrubber') });
 */

const BRASS = '#b98a3c';
const TEAL = '#0c5a52';

export function RitualScrubber({ el } = {}) {
  const container = typeof el === 'string' ? document.querySelector(el) : el;
  if (!container) return null;

  const track = container.querySelector('.ritual-scrubber__track');
  const phases = Array.from(container.querySelectorAll('.ritual-scrubber__phase'));
  const detailCard = container.querySelector('.ritual-scrubber__detail-card');
  const detailName = detailCard.querySelector('.ritual-scrubber__detail-name');
  const detailDuration = detailCard.querySelector('.ritual-scrubber__detail-duration');
  const detailState = detailCard.querySelector('.ritual-scrubber__detail-state');
  const jumpLink = detailCard.querySelector('.ritual-scrubber__jump');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setActive(index) {
    phases.forEach((p, i) => {
      const active = i === index;
      p.classList.toggle('ritual-scrubber__phase--active', active);
      p.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    const p = phases[index];
    detailName.textContent = `${p.dataset.label || p.dataset.name}`;
    detailDuration.textContent = p.dataset.duration;
    detailState.textContent = `Canine state: ${p.dataset.state}`;
    jumpLink.textContent = `Jump to ${p.dataset.label || p.dataset.name}`;
    jumpLink.href = p.dataset.target;
  }

  phases.forEach((phase, index) => {
    phase.addEventListener('click', () => setActive(index));
    phase.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const next = Math.max(0, index - 1);
        phases[next]?.focus();
        setActive(next);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        const next = Math.min(phases.length - 1, index + 1);
        phases[next]?.focus();
        setActive(next);
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActive(index);
      }
    });
  });

  // Drag / scrub support across the track
  let isDragging = false;

  function handlePosition(clientX) {
    const rect = track.getBoundingClientRect();
    const relX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const index = Math.min(phases.length - 1, Math.round((relX / rect.width) * (phases.length - 1)));
    setActive(index);
  }

  track.addEventListener('pointerdown', (event) => {
    isDragging = true;
    handlePosition(event.clientX);
  });

  window.addEventListener('pointermove', (event) => {
    if (!isDragging) return;
    handlePosition(event.clientX);
  });

  window.addEventListener('pointerup', () => {
    isDragging = false;
  });

  window.addEventListener('pointercancel', () => {
    isDragging = false;
  });

  setActive(0);

  return {
    element: container,
    setActive,
    destroy() {
      phases.forEach((p) => {
        p.removeEventListener('click', setActive);
      });
      track.removeEventListener('pointerdown', handlePosition);
      window.removeEventListener('pointermove', handlePosition);
      window.removeEventListener('pointerup', () => {});
      window.removeEventListener('pointercancel', () => {});
    },
  };
}
