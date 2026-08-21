(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ───────────── brasas ───────────── */

  const emberContainer = document.getElementById('embers');
  if (emberContainer && !prefersReducedMotion) {
    const count = window.innerWidth < 600 ? 16 : 30;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i += 1) {
      const ember = document.createElement('span');
      ember.className = 'ember';
      ember.style.left = `${Math.random() * 100}%`;
      ember.style.setProperty('--size', `${1.5 + Math.random() * 3}px`);
      ember.style.setProperty('--duration', `${8 + Math.random() * 9}s`);
      ember.style.setProperty('--delay', `${-Math.random() * 15}s`);
      ember.style.setProperty('--drift', `${-65 + Math.random() * 130}px`);
      frag.appendChild(ember);
    }
    emberContainer.appendChild(frag);
  }

})();
