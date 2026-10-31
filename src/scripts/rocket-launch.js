/**
 * ROCKET LAUNCH COMPONENT (LS TECNOLOGIA & GESTÃO)
 * Animação de propulsão e decolagem interativa para a Seção Aberta Final (#cta-final).
 * Fases: Ignição (tremor e chama) -> Decolagem (aceleração na diagonal e fuga completa) -> Saída Cósmica -> Retorno suave -> Repouso flutuante.
 */

export function initRocketLaunch(selector = '.rocket-stage') {
  const stage = document.querySelector(selector);
  if (!stage) return;

  const img = stage.querySelector('img');
  const cv = stage.querySelector('canvas');
  if (!img || !cv) return;

  const ctx = cv.getContext('2d');
  if (!ctx) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Direção do voo (cima/direita) e do escapamento (baixo/esquerda)
  const M = { x: 0.63, y: -0.78 };
  const D = { x: -0.63, y: 0.78 };

  // Saída dos propulsores em coordenadas da imagem 1024x1024
  const EMIT = [
    { x: 245, y: 672, w: 30, c: '80,225,255' }, // Ciano neon esquerdo
    { x: 322, y: 752, w: 46, c: '255,200,90' },  // Dourado central principal
    { x: 440, y: 815, w: 32, c: '80,225,255' }  // Ciano neon direito
  ];

  // Duração de cada fase em segundos
  const T = { ignite: 1.3, climb: 1.5, away: 0.5, back: 1.7 };

  // Multiplicador de distância de fuga calibrado para Seção Aberta (garante saída 100% limpa)
  const TRAVEL_MULT = 3.0;

  // Se o usuário preferir redução de movimento, mantém em repouso estático absoluto
  if (reduce) {
    img.style.transform = 'translate(0px, 0px)';
    img.style.opacity = '1';
    cv.style.display = 'none';
    return;
  }

  let S = 0;
  let dpr = 1;

  function resize() {
    S = stage.clientWidth;
    if (S === 0) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = cv.height = Math.round(S * 2 * dpr);
  }

  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(resize).observe(stage);
  }
  resize();

  const ease = {
    in: (u) => Math.pow(u, 2.4),
    out: (u) => 1 - Math.pow(1 - u, 3),
    s: (u) => u * u * (3 - 2 * u)
  };

  let phase = 'idle';
  let t0 = 0;
  let pos = 0;
  let alpha = 1;
  let inten = 0.35;
  let shake = 0;
  let idleSince = performance.now() / 1000;
  let last = 0;
  let inView = false;
  let isTabVisible = !document.hidden;
  let played = false;
  let rafId = null;

  const parts = [];

  const go = (p) => {
    phase = p;
    t0 = performance.now() / 1000;
  };

  function launch() {
    if (!reduce && phase === 'idle') {
      go('ignite');
    }
  }

  function step(now) {
    const el = now - t0;
    let u;

    switch (phase) {
      case 'ignite':
        u = Math.min(el / T.ignite, 1);
        inten = 0.35 + 0.65 * ease.s(u);
        shake = ease.s(u);
        pos = 0;
        alpha = 1;
        if (u >= 1) go('climb');
        break;

      case 'climb':
        u = Math.min(el / T.climb, 1);
        inten = 1;
        shake = 1 - 0.6 * u;
        pos = ease.in(u) * S * TRAVEL_MULT;
        // Dissolve suavemente nos últimos 18% da subida antes de entrar no espaço
        alpha = u > 0.82 ? Math.max(0, 1 - (u - 0.82) / 0.18) : 1;
        if (u >= 1) go('away');
        break;

      case 'away':
        inten = 0;
        shake = 0;
        pos = S * TRAVEL_MULT;
        alpha = 0; // Invisibilidade absoluta enquanto está no espaço sideral
        if (el >= T.away) go('back');
        break;

      case 'back':
        u = Math.min(el / T.back, 1);
        inten = 1 - 0.65 * ease.s(u);
        shake = 0;
        pos = -S * TRAVEL_MULT * (1 - ease.out(u));
        // Rematerializa suavemente nos primeiros 25% da descida do cosmos
        alpha = u < 0.25 ? Math.min(1, u / 0.25) : 1;
        if (u >= 1) {
          phase = 'idle';
          idleSince = now;
          alpha = 1;
        }
        break;

      default:
        // Estado de repouso: chama pulsando e levitação sutil
        inten = 0.35 + 0.04 * Math.sin(now * 9);
        shake = 0;
        pos = Math.sin(now * 1.6) * 5 * (S / 520);
        alpha = 1;

        // Disparo automático em repouso se data-loop estiver ativo
        if (stage.hasAttribute('data-loop') && now - idleSince > 8 && inView) {
          launch();
        }
        break;
    }
  }

  function spawn(dt, ox, oy) {
    if (phase === 'away' || S === 0 || alpha <= 0.05) return;
    const k = S / 1024;
    const sc = S / 520;

    for (const e of EMIT) {
      let n = inten * 2.5 * dt * 60;
      n = Math.floor(n) + (Math.random() < n % 1 ? 1 : 0);

      for (let i = 0; i < n && parts.length < 600; i++) {
        const a = Math.atan2(D.y, D.x) + (Math.random() - 0.5) * 0.45;
        const sp = (90 + Math.random() * 180) * (0.5 + inten) * sc;
        const smoke = inten > 0.7 && Math.random() < 0.25;
        const life = (0.5 + Math.random() * 0.7) * (0.6 + inten) * (smoke ? 1.6 : 1);

        parts.push({
          x: (e.x - 512) * k + ox + (Math.random() - 0.5) * 8 * sc,
          y: (e.y - 512) * k + oy + (Math.random() - 0.5) * 8 * sc,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life,
          max: life,
          r: (3 + Math.random() * 6) * sc,
          smoke,
          c: e.c
        });
      }
    }
  }

  function draw(dt, ox, oy) {
    if (S === 0) return;
    ctx.setTransform(dpr, 0, 0, dpr, S * dpr, S * dpr);
    ctx.clearRect(-S, -S, S * 2, S * 2);
    const k = S / 1024;
    const ang = Math.atan2(D.y, D.x);

    // Chamas alongadas nos propulsores (sincronizadas com alpha da nave)
    if (phase !== 'away' && alpha > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      for (const e of EMIT) {
        const L = (60 + 150 * inten) * k * 1.6 * (0.92 + Math.random() * 0.16);
        const w = e.w * k * 1.6 * (0.6 + 0.5 * inten);
        const g = ctx.createLinearGradient(0, 0, L, 0);
        const a = Math.min(1, Math.pow(inten, 1.3) * 0.85) * alpha;

        g.addColorStop(0, `rgba(255,255,255,${a})`);
        g.addColorStop(0.25, `rgba(${e.c},${a * 0.8})`);
        g.addColorStop(1, `rgba(${e.c},0)`);

        ctx.save();
        ctx.translate((e.x - 512) * k + ox, (e.y - 512) * k + oy);
        ctx.rotate(ang);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(L / 2, 0, L / 2, w / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Partículas de exaustão e fumaça cibernética
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life -= dt;
      if (p.life <= 0) {
        parts.splice(i, 1);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.985;
      p.vy *= 0.985;
      const a = p.life / p.max;

      if (p.smoke) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = `rgba(170,185,215,${a * 0.1})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (2.5 - a * 1.5), 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = `rgba(${p.c},${a * 0.7})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * a + 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  function frame(ms) {
    if (!inView || !isTabVisible) {
      rafId = null;
      return;
    }

    const now = ms / 1000;
    const dt = Math.min(now - (last || now), 0.05);
    last = now;

    step(now);

    const sc = S / 520;
    const sx = (Math.random() - 0.5) * shake * 5 * sc;
    const sy = (Math.random() - 0.5) * shake * 5 * sc;
    const ox = M.x * pos + sx;
    const oy = M.y * pos + sy;

    img.style.transform = `translate(${ox}px, ${oy}px)`;
    img.style.opacity = alpha;

    spawn(dt, ox, oy);
    draw(dt, ox, oy);

    rafId = requestAnimationFrame(frame);
  }

  function updateLoopState() {
    const shouldRun = inView && isTabVisible;
    if (shouldRun && !rafId) {
      last = performance.now() / 1000;
      rafId = requestAnimationFrame(frame);
    } else if (!shouldRun && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Pausa automática quando a aba do navegador fica oculta
  document.addEventListener('visibilitychange', () => {
    isTabVisible = !document.hidden;
    updateLoopState();
  });

  // Dispara a decolagem inicial quando a seção entra em visão
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView && !played) {
      played = true;
      setTimeout(launch, 500);
      idleSince = performance.now() / 1000;
    }
    updateLoopState();
  }, { threshold: 0.35 });

  observer.observe(stage);

  // Interação via Clique (sem conflito com a lupa do Lightbox)
  stage.addEventListener('click', (e) => {
    if (e.target.closest('.showcase-lightbox-trigger')) return;
    launch();
  });

  // Acessibilidade via Teclado (Enter / Espaço)
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      launch();
    }
  });

  // Início imediato do monitoramento
  updateLoopState();
}
