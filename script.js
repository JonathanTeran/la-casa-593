(() => {
  const emberContainer = document.getElementById('embers');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && emberContainer) {
    const count = window.innerWidth < 600 ? 18 : 34;
    for (let i = 0; i < count; i += 1) {
      const ember = document.createElement('span');
      ember.className = 'ember';
      ember.style.left = `${Math.random() * 100}%`;
      ember.style.setProperty('--size', `${1.5 + Math.random() * 3.5}px`);
      ember.style.setProperty('--duration', `${6 + Math.random() * 8}s`);
      ember.style.setProperty('--delay', `${-Math.random() * 12}s`);
      ember.style.setProperty('--drift', `${-60 + Math.random() * 120}px`);
      emberContainer.appendChild(ember);
    }
  }

  const shareButton = document.getElementById('shareButton');
  const toast = document.getElementById('toast');
  let toastTimer;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  };

  shareButton?.addEventListener('click', async () => {
    const shareData = {
      title: 'La Casa 593',
      text: '24 horas, 7 días. Todo puede pasar. Muy pronto.',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      showToast('Enlace copiado');
    } catch (error) {
      if (error?.name !== 'AbortError') {
        showToast('Copia la dirección del navegador para compartir');
      }
    }
  });
})();
