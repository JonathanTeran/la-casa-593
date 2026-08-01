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

  /* ───────────── reproductor ───────────── */

  const feed = document.getElementById('feed');
  if (!feed) return;

  const swap = (button, shownClass, hiddenClass) => {
    const shown = button.querySelector(`.${shownClass}`);
    const hidden = button.querySelector(`.${hiddenClass}`);
    if (shown) shown.hidden = false;
    if (hidden) hidden.hidden = true;
  };

  // reproducir / pausar
  const btnPlay = document.getElementById('btnPlay');
  if (btnPlay) {
    btnPlay.addEventListener('click', () => {
      if (feed.paused) feed.play().catch(() => {});
      else feed.pause();
    });

    const reflectPlayState = () => {
      const paused = feed.paused;
      btnPlay.setAttribute('aria-label', paused ? 'Reproducir vídeo' : 'Pausar vídeo');
      if (paused) swap(btnPlay, 'ico-play', 'ico-pause');
      else swap(btnPlay, 'ico-pause', 'ico-play');
    };

    feed.addEventListener('play', reflectPlayState);
    feed.addEventListener('pause', reflectPlayState);
    reflectPlayState();
  }

  // sonido: arranca silenciado porque el navegador exige `muted` para
  // reproducir solo; quitarlo requiere que lo pida la persona
  const btnMute = document.getElementById('btnMute');
  if (btnMute) {
    btnMute.addEventListener('click', () => {
      feed.muted = !feed.muted;
      if (!feed.muted && feed.paused) feed.play().catch(() => {});
    });

    const reflectMuteState = () => {
      const silent = feed.muted;
      btnMute.setAttribute('aria-label', silent ? 'Activar sonido' : 'Silenciar');
      if (silent) swap(btnMute, 'ico-off', 'ico-on');
      else swap(btnMute, 'ico-on', 'ico-off');
    };

    feed.addEventListener('volumechange', reflectMuteState);
    reflectMuteState();
  }

  // miniatura: solo se muestra si el navegador la admite de verdad
  const btnPip = document.getElementById('btnPip');
  if (btnPip && document.pictureInPictureEnabled && !feed.disablePictureInPicture) {
    btnPip.hidden = false;
    btnPip.addEventListener('click', async () => {
      try {
        if (document.pictureInPictureElement) await document.exitPictureInPicture();
        else await feed.requestPictureInPicture();
      } catch (error) {
        /* el navegador puede rechazarlo; no hay nada que reportar */
      }
    });
  }

  // pantalla completa: iOS solo la permite sobre el propio vídeo
  const btnFull = document.getElementById('btnFull');
  if (btnFull) {
    const stage = feed.closest('.screen') || feed;
    btnFull.addEventListener('click', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else if (stage.requestFullscreen) {
        stage.requestFullscreen().catch(() => {});
      } else if (feed.webkitEnterFullscreen) {
        feed.webkitEnterFullscreen();
      }
    });
  }

  // si el navegador bloquea la reproducción automática, deja el póster
  // y muestra el botón en estado "reproducir" en vez de mentir
  const attempt = feed.play();
  if (attempt && typeof attempt.catch === 'function') {
    attempt.catch(() => {});
  }
})();
