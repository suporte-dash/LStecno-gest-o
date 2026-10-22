import { initHeroCursorField } from './cursor-field.js';
import { initShowcaseLightbox } from './lightbox.js';

// ================================================================
// CONFIGURAÇÃO CENTRAL & ENGENHARIA DE CONVERSÃO - LS TECNOLOGIA
// ================================================================
export const CONFIG = {
  // Número comercial oficial de atendimento (formato internacional: 55DDDNUMERO)
  whatsappNumber: '5591982221400',
  messages: {
    hero: 'Olá! Gostaria de agendar uma demonstração gratuita das soluções da LS Tecnologia.',
    header: 'Olá! Gostaria de agendar uma demonstração gratuita das soluções da LS Tecnologia.',
    'mobile-menu': 'Olá! Gostaria de agendar uma demonstração gratuita das soluções da LS Tecnologia.',
    final: 'Olá! Gostaria de agendar uma demonstração gratuita das soluções da LS Tecnologia.',
    dock: 'Olá! Gostaria de agendar uma demonstração gratuita das soluções da LS Tecnologia.',
    floating: 'Olá! Gostaria de agendar uma demonstração gratuita das soluções da LS Tecnologia.',
    venda: 'Quero testar o Venda+',
    vendaMais: 'Quero testar o Venda+',
    vendaMei: 'Olá! Tenho interesse no Plano Venda+ MEI (R$ 159,00/mês). Poderia me explicar como funciona o teste?',
    vendaSimples: 'Olá! Quero mais detalhes sobre o Plano Venda+ Simples (R$ 169,00/mês) para minha empresa.',
    gerente: 'Quero conhecer o Gerente Virtual',
    gerenteVirtual: 'Quero conhecer o Gerente Virtual',
    gerenteCompleto: 'Olá! Gostaria de ativar o Gerente Virtual Completo (R$ 185,00/mês) com relatórios no WhatsApp.',
    tiagenda: 'Quero conhecer o TiAgenda',
    tiagendaIA: 'Olá! Quero automatizar o atendimento e agendamento da minha empresa com o TiAgenda & IA (R$ 210,00/mês).',
    comboMei: 'Quero aproveitar o Combo MEI de Sucesso',
    geral: 'Olá! Gostaria de agendar uma demonstração gratuita das soluções da LS Tecnologia.',
  }
};

// ================================================================
// ABAS MOBILE DA SEÇÃO 02 (OS 3 SISTEMAS)
// ================================================================
function setupMobileSystemTabs() {
  const tabBtns = document.querySelectorAll('[data-system-tab]');
  const systemCards = {
    'venda-mais': document.getElementById('venda-mais'),
    'gerente-virtual': document.getElementById('gerente-virtual'),
    'tiagenda': document.getElementById('tiagenda')
  };

  if (tabBtns.length === 0 || !systemCards['venda-mais']) return;

  function switchTab(targetSystem) {
    tabBtns.forEach(btn => {
      const isTarget = btn.getAttribute('data-system-tab') === targetSystem;
      btn.classList.toggle('bg-primary-container', isTarget);
      btn.classList.toggle('text-on-primary', isTarget);
      btn.classList.toggle('font-bold', isTarget);
      btn.classList.toggle('bg-surface-container-high', !isTarget);
      btn.classList.toggle('text-on-surface-variant', !isTarget);
    });

    // No mobile aplica visibilidade por aba; no desktop todos continuam visíveis
    Object.keys(systemCards).forEach(key => {
      const card = systemCards[key];
      if (card) {
        if (window.innerWidth < 1024) {
          if (key === targetSystem) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        } else {
          card.classList.remove('hidden');
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

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      Object.values(systemCards).forEach(card => card && card.classList.remove('hidden'));
    } else {
      const activeBtn = document.querySelector('[data-system-tab].bg-primary-container') || tabBtns[0];
      if (activeBtn) switchTab(activeBtn.getAttribute('data-system-tab'));
    }
  });

  // Inicializa no mobile com o primeiro produto ativo
  if (window.innerWidth < 1024) {
    switchTab('venda-mais');
  }
}

// ================================================================
// MOTOR DA CALCULADORA INTERATIVA / SIMULADOR EM TEMPO REAL
// ================================================================
// MOTOR DA CALCULADORA INTERATIVA / SIMULADOR EM TEMPO REAL
// ================================================================
function setupInteractiveSimulator() {
  const simulatorContainer = document.getElementById('simulador-solucoes');
  if (!simulatorContainer) return;

  // Segmentos / Planos Base (Seleção Única)
  const segmentPrices = {
    'mei': { 
      name: 'MEI Inicial Essencial', 
      base: 159, 
      label: 'Plano Venda+ MEI Essencial' 
    },
    'varejo': { 
      name: 'Varejo & Lojas', 
      base: 159, 
      label: 'Plano Venda+ MEI' 
    },
    'mercado': { 
      name: 'Mercado & Mercearia', 
      base: 169, 
      label: 'Plano Venda+ Simples' 
    },
    'restaurante': { 
      name: 'Restaurante & Bar', 
      base: 169, 
      label: 'Plano Venda+ Simples + Mesas/Comandas' 
    },
    'servicos': { 
      name: 'Clínicas & Serviços', 
      base: 160, 
      label: 'Plano TiAgenda Conectado' 
    }
  };

  // Módulos Adicionais / Turbinadores (Multi-Seleção)
  const addonPrices = {
    'relatorios-whatsapp': { 
      name: 'Relatórios WhatsApp', 
      price: 60, 
      desc: 'Envio diário de fechamento de caixa e faturamento' 
    },
    'ia-atendimento': { 
      name: 'Robô IA 24/7 (TiAgenda)', 
      price: 50, 
      desc: 'Atende clientes, tira dúvidas e fecha pedidos' 
    },
    'pix-integrado': { 
      name: 'PIX Integrado', 
      price: 80, 
      desc: 'QR Code na tela com baixa automática no PDV' 
    },
    'pdv-movel': { 
      name: 'PDV Móvel', 
      price: 40, 
      desc: 'Venda no celular ou maquininha smart Android' 
    },
    'modulo-tef': { 
      name: 'Módulo TEF POS', 
      price: 80, 
      desc: 'Conexão multi-bandeiras com pinpad no caixa' 
    },
    'usuario-extra': { 
      name: '2 Usuários Extras', 
      price: 8, 
      desc: 'Acessos simultâneos adicionais para a equipe' 
    }
  };

  let currentSegment = 'mei';
  let selectedAddons = new Set(['relatorios-whatsapp']);
  let previousTotal = null;
  let activeAnimId = null;

  // Interpolação Numérica Contínua (Count-Up Animation ~400ms a 60 FPS)
  function animateValue(element, start, end, duration = 400) {
    if (activeAnimId) {
      cancelAnimationFrame(activeAnimId);
      activeAnimId = null;
    }

    if (start === end) {
      element.textContent = `R$ ${end.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      return;
    }

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing out cubic: curva suave de desaceleração
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = easeProgress * (end - start) + start;
      element.textContent = `R$ ${current.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      
      if (progress < 1) {
        activeAnimId = window.requestAnimationFrame(step);
      } else {
        element.textContent = `R$ ${end.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        activeAnimId = null;
      }
    };
    activeAnimId = window.requestAnimationFrame(step);
  }

  function renderSimulator() {
    const segmentData = segmentPrices[currentSegment] || segmentPrices['mei'];
    let addonsTotal = 0;
    const selectedAddonNames = [];

    selectedAddons.forEach((addonKey) => {
      if (addonPrices[addonKey]) {
        addonsTotal += addonPrices[addonKey].price;
        selectedAddonNames.push(addonPrices[addonKey].name);
      }
    });

    // Cálculo Reativo em Tempo Real: Plano Base + Módulos
    const finalTotal = segmentData.base + addonsTotal;

    // Elementos do DOM
    const segmentNameEl = document.getElementById('simulador-resumo-segmento');
    const segmentBaseEl = document.getElementById('simulador-resumo-base');
    const totalPriceEl = document.getElementById('simulador-preco-final');
    const addonsListEl = document.getElementById('simulador-lista-selecionados');
    const modulosCountEl = document.getElementById('simulador-modulos-count');
    const whatsappBtn = document.getElementById('simulador-whatsapp-btn');

    if (segmentNameEl) segmentNameEl.textContent = segmentData.name;
    if (segmentBaseEl) {
      segmentBaseEl.textContent = `${segmentData.label} (R$ ${segmentData.base.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
    }

    // Atualiza contagem de módulos
    if (modulosCountEl) {
      const count = selectedAddons.size;
      modulosCountEl.textContent = count === 0 
        ? 'Nenhum módulo ativo' 
        : `${count} ${count === 1 ? 'módulo ativo' : 'módulos ativos'}`;
    }

    // Animação Numérica (Count-Up) e Feedback Tátil
    if (totalPriceEl) {
      const startVal = previousTotal !== null ? previousTotal : finalTotal;
      animateValue(totalPriceEl, startVal, finalTotal, 400);
      previousTotal = finalTotal;

      totalPriceEl.classList.add('countup-glow');
      setTimeout(() => totalPriceEl.classList.remove('countup-glow'), 400);
    }

    // Tags Holográficas de Módulos Selecionados
    if (addonsListEl) {
      if (selectedAddonNames.length === 0) {
        addonsListEl.innerHTML = '<span class="text-xs text-on-surface-variant italic py-1">Plano Base Essencial (nenhum módulo extra)</span>';
      } else {
        addonsListEl.innerHTML = selectedAddonNames.map(name => 
          `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container text-[#00e5ff] text-xs font-semibold border border-[#00e5ff]/30 shadow-[0_0_10px_rgba(0,229,255,0.15)] transition-all">
            <span class="material-symbols-outlined text-[14px]">check_circle</span> ${name}
          </span>`
        ).join('');
      }
    }

    // Atualiza classes ativas e acessibilidade ARIA nos cards de segmento
    simulatorContainer.querySelectorAll('[data-segment-choice]').forEach((btn) => {
      const seg = btn.getAttribute('data-segment-choice');
      const isActive = seg === currentSegment;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
      
      const iconContainer = btn.querySelector('.segment-icon-box');
      if (iconContainer) {
        if (isActive) {
          iconContainer.classList.add('text-primary');
          iconContainer.classList.remove('text-on-surface-variant');
        } else {
          iconContainer.classList.remove('text-primary');
          iconContainer.classList.add('text-on-surface-variant');
        }
      }
    });

    // Atualiza classes ativas nos cards e toggles de módulos
    simulatorContainer.querySelectorAll('[data-addon-choice]').forEach((checkbox) => {
      const addonKey = checkbox.getAttribute('data-addon-choice');
      const isChecked = selectedAddons.has(addonKey);
      checkbox.checked = isChecked;
      const card = checkbox.closest('.simulator-addon-card');
      if (card) {
        card.classList.toggle('is-active', isChecked);
        const priceBadge = card.querySelector('.addon-price-badge');
        if (priceBadge) {
          if (isChecked) {
            priceBadge.classList.add('text-[#00e5ff]');
            priceBadge.classList.remove('text-on-surface-variant');
          } else {
            priceBadge.classList.remove('text-[#00e5ff]');
            priceBadge.classList.add('text-on-surface-variant');
          }
        }
      }
    });

    // Monta Link de Contratação Dinâmico no WhatsApp
    if (whatsappBtn) {
      const cleanNumber = CONFIG.whatsappNumber.replace(/\D/g, '');
      const formattedTotal = finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const modulosString = selectedAddonNames.length > 0 
        ? selectedAddonNames.join(', ')
        : 'sem módulos adicionais (Plano Base)';
      
      const msg = `Olá! Simulei no site o pacote para o segmento ${segmentData.name} com os módulos ${modulosString} ficando em R$ ${formattedTotal}/mês. Gostaria de ativar!`;
      whatsappBtn.setAttribute('href', `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`);
    }
  }

  // Event Listeners para botões de segmento (Radio)
  simulatorContainer.querySelectorAll('[data-segment-choice]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentSegment = btn.getAttribute('data-segment-choice');
      renderSimulator();
    });
  });

  // Event Listeners para checkboxes/toggles de módulos adicionais
  simulatorContainer.querySelectorAll('[data-addon-choice]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const addonKey = checkbox.getAttribute('data-addon-choice');
      if (checkbox.checked) {
        selectedAddons.add(addonKey);
      } else {
        selectedAddons.delete(addonKey);
      }
      renderSimulator();
    });
  });

  // Render inicial com animação e valores sincronizados
  renderSimulator();
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

  // 4. Card Spotlight & Radial Glow Mouse Tracking
  const spotlightCards = document.querySelectorAll('.spotlight-card, .venda-plus-container, .gerente-virtual-container, .tiagenda-container, .golden-voucher-container');
  spotlightCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 5. Hero Mockup 3D Tilt Effect (60 FPS com lerp suave e limite de +-5deg; desativado em touch)
  const tiltContainer = document.querySelector('.hero-tilt-container');
  const tiltCard = document.querySelector('.hero-tilt-card');
  if (tiltContainer && tiltCard) {
    const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    if (!isTouch) {
      let rafId = null;
      let targetRotateX = 0;
      let targetRotateY = 0;
      let currentRotateX = 0;
      let currentRotateY = 0;
      let isHovering = false;

      const updateTilt = () => {
        if (!isHovering) {
          currentRotateX += (0 - currentRotateX) * 0.12;
          currentRotateY += (0 - currentRotateY) * 0.12;
          tiltCard.style.transform = `perspective(1000px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg)`;
          if (Math.abs(currentRotateX) > 0.02 || Math.abs(currentRotateY) > 0.02) {
            rafId = requestAnimationFrame(updateTilt);
          } else {
            currentRotateX = 0;
            currentRotateY = 0;
            tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            rafId = null;
          }
          return;
        }

        currentRotateX += (targetRotateX - currentRotateX) * 0.15;
        currentRotateY += (targetRotateY - currentRotateY) * 0.15;
        tiltCard.style.transform = `perspective(1000px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
        rafId = requestAnimationFrame(updateTilt);
      };

      tiltContainer.addEventListener('mouseenter', () => {
        isHovering = true;
        tiltCard.style.transition = 'none';
        if (!rafId) rafId = requestAnimationFrame(updateTilt);
      });

      tiltContainer.addEventListener('mousemove', (e) => {
        const rect = tiltContainer.getBoundingClientRect();
        const xNorm = (e.clientX - rect.left) / rect.width - 0.5;
        const yNorm = (e.clientY - rect.top) / rect.height - 0.5;

        // Limita a rotação máxima suave rigorosamente entre -5deg e +5deg
        targetRotateX = Math.max(-5, Math.min(5, -yNorm * 10));
        targetRotateY = Math.max(-5, Math.min(5, xNorm * 10));
        if (!rafId) rafId = requestAnimationFrame(updateTilt);
      });

      tiltContainer.addEventListener('mouseleave', () => {
        isHovering = false;
        tiltCard.style.transition = 'transform 0.5s ease-out';
      });
    }
  }

  // 6. Scroll Reveal Observer
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

  // 7. Contadores Numéricos Animados
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
            const duration = 1600; // 1.6 segundos
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
      { threshold: 0.3 }
    );

    counterElements.forEach((el) => counterObserver.observe(el));
  }

  // 8. Interatividade Suave no FAQ
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('is-open');
            const otherHeader = other.querySelector('.faq-header');
            if (otherHeader) {
              otherHeader.setAttribute('aria-expanded', 'false');
            }
          }
        });

        if (isOpen) {
          item.classList.remove('is-open');
          header.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-open');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // 9. Abas Mobile para os 3 Sistemas (Seção 02)
  setupMobileSystemTabs();

  // 10. Inicializa o simulador interativo de soluções
  setupInteractiveSimulator();

  // 11. Inicializa o campo de partículas interativo no Hero
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isPointerCoarse = window.matchMedia('(pointer: coarse)').matches;
  if (!prefersReducedMotion && !isPointerCoarse) {
    initHeroCursorField();
  }

  // 12. Inicializa o modal lightbox de ampliação de showcases
  initShowcaseLightbox();
}

// Inicia imediatamente quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupConversionTracking);
} else {
  setupConversionTracking();
}
