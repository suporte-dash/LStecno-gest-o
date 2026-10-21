# PROJECT_STATE.md — LS Tecnologia & Gestão

## 📌 Onde parámos
- **Execução Completa da Auditoria Técnica da Landing Page (Branch `fix/auditoria`):**
  - **Item 1 (Tipografia & Tailwind v4):** Adicionados tokens `--text-*` ao `@theme` do Tailwind v4 (`--text-display-lg`, `--text-headline-xl`, `--text-headline-sm`, `--text-title-sm`, `--text-body-md`, `--text-label-sm` etc.) e corrigida a pilha de fontes de corpo para `"Inter", "Montserrat", sans-serif`.
  - **Item 2 (Layers CSS):** Classes utilitárias customizadas (`.spotlight-card`, `.btn-shimmer`, `.border-beam-card`, badges, glows) envolvidas em `@layer components`, removendo o fundo fixo `#0f131d` de `.spotlight-card` para permitir que classes do HTML vençam.
  - **Item 3 (FAQ Accordion & A11y):** Regras de `.faq-answer-inner` movidas para fora de `@layer` para garantir transição suave de padding/borda sem vazamento de texto quando fechado; adicionados `aria-expanded`, `aria-controls` e `focus-visible:ring-2 focus-visible:ring-primary` aos botões do FAQ e ao menu mobile.
  - **Item 4 (CTAs WhatsApp & Resiliência):** Eliminados todos os `href="#"` dos 14 botões com links reais formatados com `https://wa.me/5591982221400?text=[MENSAGEM]`, `target="_blank"` e `rel="noopener noreferrer"`. Intents individualizados (`header`, `mobile-menu`, `hero`, `final`, `dock`, `floating`) mantendo fallback caso o JS não seja executado.
  - **Item 5 (Termos de Confiança & Dados Éticos):** Substituído termo "Interface Homologada & Intuitiva" por "Interface Intuitiva"; inseridos links de Política de Privacidade e Termos de Uso e identificador de CNPJ/Cidade no footer; adicionados comentários estruturados `<!-- TODO(cliente): ... -->` para validações pendentes sem inventar dados.
  - **Item 6 (Espaçamento de Seções):** Token `--spacing-section: 5rem` definido no `@theme` e aplicado via classe `py-section` em todas as seções (preservado `lg:py-24` no Hero).
  - **Item 7 (Legibilidade Sub-12px):** Classes `text-[10px]` e `text-[11px]` migradas para o padrão semântico `text-xs` (12px).
  - **Item 8 (UX & Responsividade):** CTA do Hero simplificado para "Testar grátis no WhatsApp"; pilares do Hero com `leading-tight` sem corte de reticências no mobile; menu de navegação desktop ajustado para breakpoint `lg:` (1024px) com padding proporcional; rodapé com `pb-28 sm:pb-space-xl` para proteção contra sobreposição do dock sticky de conversão.
  - **Item 9 (Performance & Movimento):** Material Symbols restrito aos 49 ícones efetivamente utilizados com eixos fixos (`display=block`); pesos de Google Fonts otimizados eliminando arquivos redundantes; reveal ativado sob `.js .reveal-fade-up` com fallback gracioso para navegadores sem JS; canvas WebGL do hero desativado automaticamente em telas touch (`pointer: coarse`) e sob `prefers-reduced-motion`.
  - **Item 10 (Tokens de Cor & Limpeza):** Classes `bg-[#070b14]`, `bg-[#0f131d]` e `text-[#070b14]` migradas para `bg-surface-floor`, `bg-surface` e `text-on-primary`; script do lightbox extraído do HTML para `src/scripts/lightbox.js` e orquestrado via `conversion.js`.
  - **Item 11 (SEO & Metadados):** Título e Open Graph otimizados para 57 caracteres (`LS Tecnologia & Gestão | PDV, Gerente Virtual e TiAgenda`); tags canônicas e URLs absolutas inseridas; meta tag obsoleta `keywords` removida; TODO registrado para schema JSON-LD.
  - **Item 12 (Acessibilidade do Lightbox):** Atributo `alt` alimentado dinamicamente com base em `data-lightbox-title`; implementado foco automático no botão fechar, focus trap cíclico via Tab/Shift+Tab e retorno de foco para o disparador original ao fechar.

## ⚙️ Estado atual
- **Branch Git:** `fix/auditoria` com 12 commits atômicos individuais (um por item auditado).
- **Compilação (`npm run build`):** 100% aprovada, 0 erros, tempo de build ~280ms, 6 módulos transformados.
- **Tokens Tailwind v4:** Classes utilitárias `.text-display-lg`, `.text-headline-xl`, `.text-headline-sm`, `.text-title-sm`, `.text-body-md` e `.text-label-sm` ativas no bundle CSS.

## 🎯 Próximos passos imediatos
1. Apresentar o relatório final detalhado com lista de commits, pendências `TODO(cliente)` e divergências para decisão de Sandreo / diretoria da LS Tecnologia.
2. Aguardar aprovação do cliente para merge da branch `fix/auditoria` na branch principal (`main`).
