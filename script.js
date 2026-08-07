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

  /* ─── videos de YouTube ─── */

  const mainYoutube = document.getElementById('mainYoutube');
  const youtubeVideos = document.getElementById('youtubeVideos');
  const playlistStatus = document.getElementById('playlistStatus');
  const playOrder = ['1tJVxlhWSMw', 'vUAYoTPSsqA', 'trrZucOYHcs', 'NIVytaFvD1E'];

  const playlistUrl = (videoId) => {
    const start = playOrder.indexOf(videoId);
    const queue = playOrder.slice(start + 1).concat(playOrder.slice(0, start + 1));
    const params = new URLSearchParams({
      autoplay: '1',
      loop: '1',
      playlist: queue.join(','),
      rel: '0',
      playsinline: '1',
      enablejsapi: '1'
    });
    return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
  };

  if (mainYoutube && youtubeVideos) {
    youtubeVideos.addEventListener('click', (event) => {
      const item = event.target.closest('.playlist-item');
      if (!item || !youtubeVideos.contains(item)) return;

      const videoId = item.dataset.videoId;
      const videoTitle = item.dataset.videoTitle || 'Video de La Casa 593';
      if (!/^[\w-]{11}$/.test(videoId || '')) return;

      youtubeVideos.querySelectorAll('.playlist-item').forEach((button) => {
        button.setAttribute('aria-pressed', button === item ? 'true' : 'false');
      });

      mainYoutube.src = playlistUrl(videoId);
      mainYoutube.title = `${videoTitle} — La Casa 593`;
      if (playlistStatus) playlistStatus.textContent = `Reproduciendo: ${videoTitle.replace('La Casa 593 | ', '')}`;
    });
  }

})();
