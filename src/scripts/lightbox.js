/**
 * SHOWCASE LIGHTBOX MODULE (LS TECNOLOGIA & GESTÃO)
 * Gerencia a ampliação modal de telas e mockups do sistema.
 */
export function initShowcaseLightbox() {
  const modal = document.getElementById('showcase-lightbox-modal');
  const modalImg = document.getElementById('showcase-lightbox-img');
  const modalCaption = document.getElementById('showcase-lightbox-caption');
  const closeBtn = document.getElementById('showcase-lightbox-close');
  const triggers = document.querySelectorAll('.showcase-lightbox-trigger');

  if (!modal || !modalImg) return;

  function openLightbox(src, title) {
    modalImg.src = src;
    modalCaption.textContent = title || 'Visualização do Sistema';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
      modal.classList.remove('opacity-0');
    }, 10);
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.add('opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      modalImg.src = '';
      document.body.style.overflow = '';
    }, 200);
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const src = trigger.getAttribute('data-lightbox-src');
      const title = trigger.getAttribute('data-lightbox-title');
      if (src) openLightbox(src, title);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeLightbox();
    }
  });
}
