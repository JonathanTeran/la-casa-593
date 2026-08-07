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
  if (youtubeVideos) {
    let activeVideo = null;

    youtubeVideos.addEventListener('click', (event) => {
      const preview = event.target.closest('.video-preview');
      if (!preview || !youtubeVideos.contains(preview)) return;

      const videoId = preview.dataset.videoId;
      if (!/^[\w-]{11}$/.test(videoId || '')) return;

      if (activeVideo) {
        activeVideo.embed.replaceWith(activeVideo.preview);
      }

      if (mainYoutube && mainYoutube.contentWindow) {
        mainYoutube.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
          'https://www.youtube-nocookie.com'
        );
      }

      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
      iframe.title = preview.getAttribute('aria-label') || 'Video de La Casa 593';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;

      const embed = document.createElement('div');
      embed.className = 'video-embed';
      embed.appendChild(iframe);

      const originalPreview = preview.cloneNode(true);
      preview.replaceWith(embed);
      activeVideo = { embed, preview: originalPreview };
    });
  }

})();
