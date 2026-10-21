import { initHeroCursorField } from './cursor-field.js';

// ================================================================
// CONFIGURAÇÃO CENTRAL & ENGENHARIA DE CONVERSÃO - LS TECNOLOGIA
// ================================================================
export const CONFIG = {
  // Número comercial oficial de atendimento (formato internacional: 55DDDNUMERO)
  whatsappNumber: '5591982221400',
  messages: {
    hero: 'Olá! Gostaria de agendar uma demonstração gratuita das soluções da LS Tecnologia.',
    venda: 'Olá! Tenho interesse no Plano Venda+ para minha empresa.',
    vendaMei: 'Olá! Tenho interesse no Plano Venda+ MEI (R$ 159,00/mês). Poderia me explicar como funciona o teste?',
    vendaSimples: 'Olá! Quero mais detalhes sobre o Plano Venda+ Simples (R$ 169,00/mês) para minha empresa.',
    gerente: 'Olá! Gostaria de conhecer o Gerente Virtual com IA para minha empresa.',
    gerenteCompleto: 'Olá! Gostaria de ativar o Gerente Virtual Completo (R$ 185,00/mês) com relatórios no WhatsApp.',
    tiagenda: 'Olá! Quero testar o TiAgenda com agendamento automático via WhatsApp.',
    tiagendaIA: 'Olá! Quero automatizar o atendimento e agendamento da minha empresa com o TiAgenda & IA (R$ 210,00/mês).',
    comboMei: 'Olá! Quero aproveitar a oferta especial do COMBO MEI DE SUCESSO por R$ 239,90/mês!',
    geral: 'Olá! Gostaria de conversar com um consultor da LS Tecnologia & Gestão.',
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
function setupInteractiveSimulator() {
  const simulatorContainer = document.getElementById('simulador-solucoes');
  if (!simulatorContainer) return;

  const segmentPrices = {
    'varejo': { name: 'Varejo & Lojas', base: 169, label: 'Plano Venda+ Simples Comercial' },
    'mercado': { name: 'Mercado & Mercearia', base: 169, label: 'Plano Venda+ com Frente de Caixa' },
    'restaurante': { name: 'Restaurante & Bar', base: 169, label: 'Plano Venda+ com Comandas & Cardápio' },
    'servicos': { name: 'Clínicas & Serviços', base: 210, label: 'Plano TiAgenda + WhatsApp + IA' },
    'mei': { name: 'MEI Inicial', base: 159, label: 'Plano Venda+ MEI Essencial' }
  };

  const addonPrices = {
    'relatorios-whatsapp': { name: 'Relatórios no WhatsApp', price: 50 },
    'ia-atendimento': { name: 'Robô IA de Atendimento 24/7', price: 70 },
    'pix-integrado': { name: 'PIX Integrado com Baixa Automática', price: 80 },
    'pdv-movel': { name: 'PDV Móvel (Celular/Maquininha)', price: 40 },
    'modulo-tef': { name: 'Módulo TEF POS para Cartão', price: 80 },
    'usuario-extra': { name: '2 Usuários Extras', price: 8 }
  };

  let currentSegment = 'mei';
  let selectedAddons = new Set(['relatorios-whatsapp']);

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

    let subtotal = segmentData.base + addonsTotal;
    let discount = 0;
    if (selectedAddons.size >= 2) {
      discount = 20; // Desconto progressivo de combo
    }
    const finalTotal = subtotal - discount;

    // Atualiza elementos visuais do DOM
    const segmentNameEl = document.getElementById('simulador-resumo-segmento');
    const segmentBaseEl = document.getElementById('simulador-resumo-base');
    const totalPriceEl = document.getElementById('simulador-preco-final');
    const discountEl = document.getElementById('simulador-badge-desconto');
    const addonsListEl = document.getElementById('simulador-lista-selecionados');
    const whatsappBtn = document.getElementById('simulador-whatsapp-btn');

    if (segmentNameEl) segmentNameEl.textContent = segmentData.name;
    if (segmentBaseEl) segmentBaseEl.textContent = `${segmentData.label} (R$ ${segmentData.base.toFixed(2).replace('.', ',')})`;
    
    // Efeito de pulso suave e transição de preço
    if (totalPriceEl) {
      totalPriceEl.textContent = `R$ ${finalTotal.toFixed(2).replace('.', ',')}`;
      totalPriceEl.classList.add('scale-105', 'text-surface-tint');
      setTimeout(() => {
        totalPriceEl.classList.remove('scale-105', 'text-surface-tint');
      }, 200);
    }

    if (discountEl) {
      if (discount > 0) {
        discountEl.classList.remove('hidden');
        discountEl.textContent = `Economia de R$ ${discount.toFixed(2).replace('.', ',')}/mês aplicada`;
      } else {
        discountEl.classList.add('hidden');
      }
    }

    if (addonsListEl) {
      if (selectedAddonNames.length === 0) {
        addonsListEl.innerHTML = '<span class="text-xs text-on-surface-variant italic">Nenhum módulo opcional selecionado</span>';
      } else {
        addonsListEl.innerHTML = selectedAddonNames.map(name => 
          `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container text-secondary text-xs font-semibold border border-secondary/20">
            <span class="material-symbols-outlined text-[14px]">check</span> ${name}
          </span>`
        ).join('');
      }
    }

    // Monta URL de WhatsApp personalizada
    if (whatsappBtn) {
      const cleanNumber = CONFIG.whatsappNumber.replace(/\D/g, '');
      const addonsText = selectedAddonNames.length > 0 ? `\nMódulos adicionais: ${selectedAddonNames.join(', ')}` : '\nSem adicionais extras';
      const msg = `Olá! Montei meu pacote personalizado no site da LS Tecnologia:\n• Segmento: ${segmentData.name}\n• Base: ${segmentData.label}${addonsText}\n• Valor estimado: R$ ${finalTotal.toFixed(2).replace('.', ',')}/mês.\nGostaria de agendar a ativação deste plano!`;
      whatsappBtn.setAttribute('href', `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`);
    }
  }

  // Event Listeners para botões de segmento
  simulatorContainer.querySelectorAll('[data-segment-choice]').forEach((btn) => {
    btn.addEventListener('click', () => {
      simulatorContainer.querySelectorAll('[data-segment-choice]').forEach(b => {
        b.classList.remove('border-primary', 'bg-surface-container-high', 'text-primary');
        b.classList.add('border-surface-variant/30', 'bg-surface-container-low', 'text-on-surface');
      });
      btn.classList.remove('border-surface-variant/30', 'bg-surface-container-low', 'text-on-surface');
      btn.classList.add('border-primary', 'bg-surface-container-high', 'text-primary');
      currentSegment = btn.getAttribute('data-segment-choice');
      renderSimulator();
    });
  });

  // Event Listeners para checkboxes de adicionais
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

  // Render inicial
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
  const spotlightCards = document.querySelectorAll('.spotlight-card');
  spotlightCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 5. Hero Mockup 3D Tilt Effect
  const tiltContainer = document.querySelector('.hero-tilt-container');
  const tiltCard = document.querySelector('.hero-tilt-card');
  if (tiltContainer && tiltCard) {
    let isHovering = false;

    tiltContainer.addEventListener('mouseenter', () => {
      isHovering = true;
    });

    tiltContainer.addEventListener('mousemove', (e) => {
      if (!isHovering) return;
      const rect = tiltContainer.getBoundingClientRect();
      const xNorm = (e.clientX - rect.left) / rect.width - 0.5;
      const yNorm = (e.clientY - rect.top) / rect.height - 0.5;

      const rotateX = -yNorm * 8; // Max 8 graus
      const rotateY = xNorm * 8;

      tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
    });

    tiltContainer.addEventListener('mouseleave', () => {
      isHovering = false;
      tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
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
  initHeroCursorField();
}

// Inicia imediatamente quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupConversionTracking);
} else {
  setupConversionTracking();
}
