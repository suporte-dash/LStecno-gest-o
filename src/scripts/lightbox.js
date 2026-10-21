/**
 * SHOWCASE LIGHTBOX MODULE (LS TECNOLOGIA & GESTÃO)
 * Gerencia a ampliação modal de telas e mockups do sistema com acessibilidade e trap de foco.
 */
export function initShowcaseLightbox() {
  const modal = document.getElementById('showcase-lightbox-modal');
  const modalImg = document.getElementById('showcase-lightbox-img');
  const modalCaption = document.getElementById('showcase-lightbox-caption');
  const closeBtn = document.getElementById('showcase-lightbox-close');
  const triggers = document.querySelectorAll('.showcase-lightbox-trigger');

  if (!modal || !modalImg) return;

  let lastActiveElement = null;

  function openLightbox(src, title, triggerElement) {
    lastActiveElement = triggerElement || document.activeElement;
    modalImg.src = src;
    const resolvedTitle = title || 'Visualização do Sistema';
    modalImg.alt = resolvedTitle;
    modalCaption.textContent = resolvedTitle;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
      modal.classList.remove('opacity-0');
      if (closeBtn) closeBtn.focus();
    }, 10);
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.add('opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      modalImg.src = '';
      modalImg.alt = '';
      document.body.style.overflow = '';
      if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
        lastActiveElement.focus();
      }
    }, 200);
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const src = trigger.getAttribute('data-lightbox-src');
      const title = trigger.getAttribute('data-lightbox-title');
      if (src) openLightbox(src, title, trigger);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('hidden')) return;

    if (e.key === 'Escape') {
      closeLightbox();
      return;
    }

    if (e.key === 'Tab') {
      const focusableElements = modal.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  });
}
