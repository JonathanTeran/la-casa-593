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

  // Intenciones explícitas de la persona. Sirven para distinguir "lo silenció
  // porque quiso" de "el navegador lo silenció por su política".
  let userMuted = false;
  let userPaused = false;

  const swap = (button, shownClass, hiddenClass) => {
    const shown = button.querySelector(`.${shownClass}`);
    const hidden = button.querySelector(`.${hiddenClass}`);
    if (shown) shown.hidden = false;
    if (hidden) hidden.hidden = true;
  };

  /* ─── sonido ───
     Ningún navegador permite arrancar con sonido sin un gesto previo: o el
     vídeo va silenciado, o no se reproduce. Se intenta con sonido y, si lo
     rechazan, se cae a silencio y basta cualquier toque o tecla para
     activarlo, sin tener que buscar el botón.
     No se comprueba el resultado con un temporizador, porque el navegador
     puede revertirlo más tarde: se reacciona al estado real del vídeo.   */

  const soundCta = document.getElementById('soundCta');
  const gestures = ['pointerdown', 'touchstart', 'click', 'keydown'];

  function onGesture() {
    releaseGestures();
    requestSound();
  }

  function armGestures() {
    gestures.forEach((type) => document.addEventListener(type, onGesture, true));
  }

  function releaseGestures() {
    gestures.forEach((type) => document.removeEventListener(type, onGesture, true));
  }

  function offerSound() {
    if (soundCta) soundCta.hidden = false;
    armGestures();
  }

  function soundSettled() {
    if (soundCta) soundCta.hidden = true;
    releaseGestures();
  }

  // Sonar exige reproducirse: `muted = false` con el vídeo pausado no es
  // éxito, es quedarse sin imagen y sin audio.
  const hasSound = () => !feed.muted && !feed.paused;

  function fallbackMuted() {
    feed.muted = true;
    feed.play().catch(() => {});
    offerSound();
  }

  function requestSound() {
    userMuted = false;
    feed.muted = false;
    feed.volume = 1;
    const resume = feed.play();
    if (resume && typeof resume.then === 'function') {
      resume.then(() => { if (hasSound()) soundSettled(); }).catch(fallbackMuted);
    } else if (feed.paused) {
      fallbackMuted();
    }
  }

  // El estado real del vídeo es la única fuente fiable: si acaba silenciado
  // sin que nadie lo pidiera, es que el navegador lo impuso.
  feed.addEventListener('volumechange', () => {
    if (hasSound()) soundSettled();
    else if (feed.muted && !userMuted) offerSound();
  });

  feed.addEventListener('play', () => {
    if (hasSound()) soundSettled();
  });

  // Si el navegador pausa el vídeo por su cuenta (pasa al quitar el silencio
  // sin gesto), antes que dejarlo congelado se vuelve a silencio.
  feed.addEventListener('pause', () => {
    if (userPaused) return;
    if (!feed.muted) fallbackMuted();
    else feed.play().catch(() => {});
  });

  if (soundCta) {
    soundCta.addEventListener('click', (event) => {
      event.stopPropagation();
      releaseGestures();
      requestSound();
    });
  }

  /* ─── controles ─── */

  const btnPlay = document.getElementById('btnPlay');
  if (btnPlay) {
    btnPlay.addEventListener('click', () => {
      if (feed.paused) {
        userPaused = false;
        feed.play().catch(() => {});
      } else {
        userPaused = true;
        feed.pause();
      }
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

  const btnMute = document.getElementById('btnMute');
  if (btnMute) {
    btnMute.addEventListener('click', () => {
      if (feed.muted) {
        releaseGestures();
        requestSound();
      } else {
        userMuted = true;
        feed.muted = true;
        soundSettled();
      }
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

  // miniatura: solo si el navegador la admite de verdad
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

  requestSound();
})();
