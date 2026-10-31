import { initHeroCursorField } from './cursor-field.js';
import { initShowcaseLightbox } from './lightbox.js';
import { initRocketLaunch } from './rocket-launch.js';

// ================================================================
// CONFIGURAÇÃO CENTRAL & ENGENHARIA DE CONVERSÃO - LS TECNOLOGIA
// ================================================================
export const CONFIG = {
  whatsappNumber: '5591982102720',
  messages: {
    hero: 'Olá! Vim pelo site e gostaria de testar grátis os sistemas da LS Tecnologia.',
    header: 'Olá! Vim pelo site e gostaria de agendar uma demonstração gratuita das soluções da LS Tecnologia.',
    'mobile-menu': 'Olá! Vim pelo site e gostaria de agendar uma demonstração gratuita das soluções da LS Tecnologia.',
    final: 'Olá! Vim pelo site e quero solicitar uma demonstração gratuita dos sistemas da LS Tecnologia.',
    dock: 'Olá! Vim pelo site e gostaria de agendar uma demonstração gratuita das soluções da LS Tecnologia.',
    floating: 'Olá! Vim pelo site e gostaria de agendar uma demonstração gratuita das soluções da LS Tecnologia.',
    venda: 'Olá! Vim pelo site e gostaria de solicitar uma demonstração grátis do Venda+.',
    vendaMais: 'Olá! Vim pelo site e gostaria de solicitar uma demonstração grátis do Venda+.',
    vendaMei: 'Olá! Vim pelo site e gostaria de ativar o Plano Venda+ MEI (R$ 159/mês).',
    vendaSimples: 'Olá! Vim pelo site e gostaria de ativar o Plano Venda+ Simples (R$ 169/mês) com NFC-e.',
    gerente: 'Olá! Vim pelo site e gostaria de ativar o Gerente Virtual com IA.',
    gerenteVirtual: 'Olá! Vim pelo site e gostaria de ativar o Gerente Virtual com IA.',
    gerenteCompleto: 'Olá! Vim pelo site e gostaria de ativar o Gerente Virtual Completo (R$ 185/mês).',
    tiagenda: 'Olá! Vim pelo site e gostaria de experimentar o TiAgenda com IA.',
    tiagendaIA: 'Olá! Vim pelo site e gostaria de ativar o TiAgenda Inteligência Suprema (R$ 210/mês) com IA.',
    comboMei: 'Olá! Vim pelo site e quero garantir o Combo MEI de Sucesso com desconto.',
    geral: 'Olá! Vim pelo site e gostaria de agendar uma demonstração gratuita das soluções da LS Tecnologia.',
  }
};

// ================================================================
// ABAS UNIFICADAS DA SEÇÃO 02 (MOBILE & DESKTOP COM DEEP LINKING)
// ================================================================
function setupMobileSystemTabs() {
  const tabBtns = document.querySelectorAll('[data-system-tab]');
  const systemCards = {
    'venda-mais': document.getElementById('venda-plus') || document.getElementById('venda-mais'),
    'venda-plus': document.getElementById('venda-plus') || document.getElementById('venda-mais'),
    'gerente-virtual': document.getElementById('gerente-virtual'),
    'tiagenda': document.getElementById('tiagenda')
  };

  if (tabBtns.length === 0 || (!systemCards['venda-mais'] && !systemCards['venda-plus'])) return;

  const activeClasses = 'bg-gradient-to-r from-[#ffd700] via-[#f5b700] to-[#df9c00] text-slate-950 font-bold shadow-[0_0_20px_rgba(245,183,0,0.35)] scale-[1.02]';
  const inactiveClasses = 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50 font-medium';

  function switchTab(targetSystem) {
    const normalizedTarget = targetSystem === 'venda-plus' ? 'venda-mais' : targetSystem;

    tabBtns.forEach(btn => {
      const isTarget = btn.getAttribute('data-system-tab') === normalizedTarget;
      activeClasses.split(' ').forEach(cls => btn.classList.toggle(cls, isTarget));
      inactiveClasses.split(' ').forEach(cls => btn.classList.toggle(cls, !isTarget));
    });

    Object.keys(systemCards).forEach(key => {
      const card = systemCards[key];
      if (card) {
        const isTargetCard = (key === normalizedTarget) || (normalizedTarget === 'venda-mais' && key === 'venda-plus');
        if (isTargetCard) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-system-tab');
      switchTab(target);
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    const rawHref = anchor.getAttribute('href');
    if (!rawHref) return;
    const target = rawHref.replace('#', '');
    if (['venda-mais', 'venda-plus', 'gerente-virtual', 'tiagenda'].includes(target)) {
      anchor.addEventListener('click', () => {
        switchTab(target);
      });
    }
  });

  if (window.location.hash) {
    const currentHash = window.location.hash.replace('#', '');
    if (['venda-mais', 'venda-plus', 'gerente-virtual', 'tiagenda'].includes(currentHash)) {
      switchTab(currentHash);
    } else {
      switchTab('venda-mais');
    }
  } else {
    switchTab('venda-mais');
  }
}

// ================================================================
// CONTROLE CENTRAL DE EVENTOS & CONVERSÃO
// ================================================================
export function setupConversionTracking() {
  // 1. URLs dinâmicas para botões estáticos com data-whatsapp-intent
  document.querySelectorAll('[data-whatsapp-intent]').forEach((btn) => {
    const intent = btn.getAttribute('data-whatsapp-intent');
    const msg = CONFIG.messages[intent] || CONFIG.messages.geral;
    const cleanNumber = CONFIG.whatsappNumber.replace(/\D/g, '');
    const href = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
    btn.setAttribute('href', href);

    btn.addEventListener('click', () => {
      const trackEvent = btn.getAttribute('data-track');
      if (trackEvent) {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'generate_lead', {
            event_category: 'WhatsApp',
            event_label: trackEvent,
          });
        }
        if (typeof window.fbq === 'function') {
          window.fbq('track', 'Lead', { content_name: trackEvent });
        }
      }
    });
  });

  // 2. Triggers Flutuantes no Scroll (Mobile Dock e Desktop Trigger)
  const floatingDock = document.getElementById('mobile-sticky-dock');
  const desktopFloatingCta = document.getElementById('desktop-floating-cta');
  const floatingMsg = document.getElementById('desktop-floating-msg');
  const dismissBtn = document.getElementById('dismiss-floating-msg');

  if (floatingMsg && dismissBtn) {
    try {
      if (sessionStorage.getItem('ls_floating_msg_dismissed') === 'true') {
        floatingMsg.classList.add('hidden');
      }
    } catch (_) {}

    dismissBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      floatingMsg.classList.add('opacity-0', 'scale-90');
      setTimeout(() => {
        floatingMsg.classList.add('hidden');
      }, 300);
      try {
        sessionStorage.setItem('ls_floating_msg_dismissed', 'true');
      } catch (_) {}
    });
  }

  window.addEventListener('scroll', () => {
    const shouldShow = window.scrollY > 300;
    
    if (floatingDock) {
      if (shouldShow) {
        floatingDock.classList.remove('translate-y-28', 'opacity-0');
        floatingDock.classList.add('translate-y-0', 'opacity-100');
      } else {
        floatingDock.classList.add('translate-y-28', 'opacity-0');
        floatingDock.classList.remove('translate-y-0', 'opacity-100');
      }
    }

    if (desktopFloatingCta) {
      if (shouldShow) {
        desktopFloatingCta.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
        desktopFloatingCta.classList.add('translate-y-0', 'opacity-100');
      } else {
        desktopFloatingCta.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
        desktopFloatingCta.classList.remove('translate-y-0', 'opacity-100');
      }
    }
  }, { passive: true });

  // 3. Mobile Navigation Menu Toggle
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu-drawer');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      if (isOpen) {
        mobileMenu.classList.add('hidden');
        menuToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenu.classList.remove('hidden');
        menuToggle.setAttribute('aria-expanded', 'true');
      }
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.reveal-fade-up');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  // 5. Contadores Numéricos Animados (SLA & Métricas em 1.2s)
  const counterElements = document.querySelectorAll('[data-counter]');
  if ('IntersectionObserver' in window && counterElements.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const targetVal = parseFloat(el.getAttribute('data-counter'));
            const prefix = el.getAttribute('data-prefix') || '';
            const suffix = el.getAttribute('data-suffix') || '';
            const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
            const duration = parseInt(el.getAttribute('data-duration') || '1200', 10);
            const startTime = performance.now();

            function updateCounter(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeProgress = 1 - Math.pow(1 - progress, 3);
              const currentVal = targetVal * easeProgress;

              el.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                el.textContent = `${prefix}${targetVal.toFixed(decimals)}${suffix}`;
              }
            }

            requestAnimationFrame(updateCounter);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );

    counterElements.forEach((el) => counterObserver.observe(el));
  }

  // 6. Abas Unificadas para os 3 Sistemas (Seção 02)
  setupMobileSystemTabs();

  // 7. Inicializa o campo de partículas interativo no Hero
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isPointerCoarse = window.matchMedia('(pointer: coarse)').matches;
  if (!prefersReducedMotion && !isPointerCoarse) {
    initHeroCursorField();
  }

  // 8. Inicializa o modal lightbox de ampliação de showcases
  initShowcaseLightbox();

  // 9. Inicializa o componente de decolagem interativa do foguete 3D (#cta-final)
  initRocketLaunch();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupConversionTracking);
} else {
  setupConversionTracking();
}
