# Propuesta de Diseño - Portafolio Personal 2025

## Resumen Ejecutivo

Transformación de tu portafolio actual a una experiencia moderna de página única (SPA) utilizando las últimas tendencias en tecnología y UI/UX para 2025, integrando Next.js 15, Base UI + Shadcn/ui, y un diseño inmersivo con animaciones fluidas y accesibles.

**Prioridades de Diseño**: Rendimiento, Accesibilidad, Experiencia de Usuario, Implementación Práctica.

---

## Concepto de Diseño: "Infinite Canvas"

Un portafolio de scroll infinito con secciones que se revelan mediante animaciones cinematográficas, combinando glassmorphism, bento grids modernos, y micro-interacciones que crean una experiencia memorable y accesible.

### Tendencias UI/UX 2025 Implementadas:
- **Bento Grid 3.0**: Layouts asimétricos dinámicos que se adaptan al contenido
- **Glassmorphism Evolution**: Capas semi-transparentes con blur avanzado y tokens reutilizables
- **Scroll-Driven Animations**: Animaciones nativas del navegador sincronizadas con scroll
- **Micro-interactions**: Feedback visual en cada interacción con soporte para reduced-motion
- **AI-Enhanced Gradients**: Gradientes mesh animados como fondo
- **Mobile-First Design**: Diseño desde 320px con progressive enhancement
- **Dark Mode First**: Diseño optimizado para modo oscuro con transición suave
- **Accessibility Built-in**: WCAG 2.1 AA compliance desde el inicio

---

## Estructura de Secciones (Single Page)

### 1. Hero Section - "First Impact"
**Altura**: 100svh (mobile-safe viewport)
**Prioridad**: Fase 1 - CRÍTICO

**Componentes Base UI + Shadcn**:
- Shadcn `TypographyH1` con animación personalizada para tu nombre
- Custom gradient mesh background con CSS/Canvas
- Shadcn `Avatar` con tu foto/imagen

**Contenido**:
```
[Animated Background Mesh]

    Luis Cedeño
    Full-Stack Developer & Tech Lead

    [Scroll Indicator Animation]
    [Floating Navigation Dots]
```

**Interacciones**:
- Parallax sutil en fondo (deshabilitado con prefers-reduced-motion)
- Texto que aparece con fade-in progresivo
- Scroll indicator con bounce animation
- Navegación flotante con dots indicadores

**Responsive Behavior**:
- Mobile: Stack vertical, reducir tamaño de fuente 40%, simplificar animaciones
- Tablet: Layout intermedio, mantener animaciones esenciales
- Desktop: Experiencia completa con parallax sutil

**Accessibility**:
- Skip to content link visible en focus
- Aria-label descriptivo en elementos interactivos
- Keyboard navigation funcionando desde el inicio
- Focus trap management para navegación

---

### 2. Featured Work - "What I Build"
**Altura**: Auto (adaptable al contenido)
**Prioridad**: Fase 2 - ALTO

**Componentes Base UI + Shadcn**:
- Shadcn `Card` con hover effects personalizados
- Shadcn `Badge` para tech stack
- Custom modal/drawer con Shadcn `Dialog` para detalles del proyecto
- Shadcn `Tabs` o Custom pills para filtros

**Layout Propuesto**:
```
Featured Projects
[Filter Pills: All | iOS | Web | Backend]

┌───────────────────────────────────────┐
│  [Project Card - Dermaware Genesis]   │
│   └ Animated image preview            │
│   └ Tech stack badges                 │
│   └ Expand button                     │
├───────────────────────────────────────┤
│  [Project Card - Homecare Nemesis]    │
└───────────────────────────────────────┘
```

**Proyectos Destacados** (5 principales):
1. **Dermaware - Genesis**: iOS skin health app
2. **Homecare - Nemesis**: Energy monitoring + CV
3. **OxxoCorner**: Retail application
4. **UPocket**: Financial app
5. **StackUp**: Developer tools

**Interacción**:
- Click/Enter para expandir proyecto in-place
- Modal con galería de imágenes y descripción completa
- Animación de entrada staggered (con respeto a prefers-reduced-motion)
- Filtros con transiciones suaves

**Responsive Behavior**:
- Mobile: Stack vertical de cards, swipe gesture para navegación
- Tablet: Grid 2 columnas
- Desktop: Grid 2-3 columnas con hover effects

**Accessibility**:
- Cards son button elements o tienen role="button"
- Keyboard navigation para filtros y cards
- Alt text descriptivo en todas las imágenes
- Focus visible en todos los elementos interactivos

**Performance**:
- Lazy loading de imágenes con next/image
- Intersection Observer para animaciones de entrada
- Suspense boundaries para contenido dinámico

---

### 3. About - "Who I Am" (Bento Grid Simplificado)
**Altura**: Auto (min 100svh)
**Prioridad**: Fase 3 - MEDIO

**Componentes Base UI + Shadcn**:
- Custom Bento Grid con Shadcn `Card` como base
- Shadcn `Badge` para skills
- Custom timeline con scroll horizontal
- Counter animation para estadísticas

**Layout Propuesto** (Grid Simplificado):
```
┌─────────────┬─────────┬─────────┐
│             │  Stats  │ Profile │
│  Hero Card  │ Counter │  Card   │
│  "Mi Bio"   ├─────────┼─────────┤
│             │ Tech    │ Current │
│             │ Stack   │  Role   │
├─────────────┴─────────┴─────────┤
│   Experience Timeline            │
│   (Top 3-4 positions)            │
├──────────────────────────────────┤
│   Skills Suite (Animated Pills)  │
└──────────────────────────────────┘
```

**Contenido Mantenido**:
- Bio concisa (3-4 líneas) con "Leer más" opcional
- Timeline: Top 3-4 posiciones más relevantes
- Stats: 4+ años experiencia, 10+ proyectos, commits este año
- Skills: Agrupados por categoría (Backend, Frontend, Tools, Soft Skills)

**Nuevas Características**:
- Cards con hover tilt effect sutil
- Skill badges con animación de entrada staggered
- Timeline con scroll horizontal suave (snap points)
- Botón "Descargar CV" con estado de loading

**Responsive Behavior**:
- Mobile: Stack vertical completo, timeline horizontal con swipe
- Tablet: Grid 2 columnas, ajustar tamaños
- Desktop: Grid completo con efectos hover

**Accessibility**:
- Región landmark con role="region" aria-labelledby
- Timeline navegable con keyboard (arrow keys)
- Skip links para secciones largas
- Alternativas textuales para visualizaciones

**Simplificación Clave**:
- Eliminar GitHub contribution graph (datos externos, complejidad)
- Reducir número de cards en bento grid (5-6 máximo)
- Focus en información más relevante y reciente

---

### 4. Contact - "Let's Connect"
**Altura**: 100svh
**Prioridad**: Fase 4 - MEDIO

**Componentes Base UI + Shadcn**:
- Shadcn `Form` con `Input`, `Textarea`
- Shadcn `Button` con estados (loading, success, error)
- Shadcn `Toast` (Sonner) para confirmación
- Custom social links con iconos (Lucide)

**Layout Propuesto**:
```
┌─────────────────┬──────────────────┐
│                 │   Contact Form   │
│  Let's Work     │                  │
│  Together       │   [Name]         │
│                 │   [Email]        │
│  [Social Icons] │   [Message]      │
│   GitHub        │                  │
│   LinkedIn      │   [Send Button]  │
│   Instagram     │                  │
│                 │                  │
└─────────────────┴──────────────────┘
```

**Mejoras**:
- Formulario con validación en tiempo real (Zod + React Hook Form)
- Animación de envío con loading state
- Confirmación visual (toast notification)
- Social links con hover effects sutiles
- Email client fallback si JavaScript falla

**Responsive Behavior**:
- Mobile: Stack vertical, form primero
- Tablet: Layout lado a lado
- Desktop: Split 40/60 con animaciones

**Accessibility**:
- Labels explícitos para todos los campos
- Error messages asociados con aria-describedby
- Focus management en validación
- Success message anunciado con aria-live

**Progressive Enhancement**:
- Form funciona sin JavaScript (mailto fallback)
- Loading states claros
- Error handling robusto

---

### 5. Footer - "Quick Nav"
**Altura**: Auto
**Prioridad**: Fase 4

**Componentes Base UI + Shadcn**:
- Custom floating navigation (siempre visible)
- Shadcn `Button` para back to top
- Theme toggle con Shadcn `Switch`

**Contenido**:
- Copyright y versión
- Quick links a secciones
- Theme toggle (dark/light)
- Language toggle (ES/EN)

**Floating Navigation Indicators**:
- Dots que indican sección actual
- Click para saltar a sección
- Animación de transición entre secciones
- Fixed position en desktop, bottom nav en mobile

**Accessibility**:
- Navigation landmark
- Keyboard shortcuts documentados
- Focus visible en todos los controles

---

## Sistema de Diseño

### Paleta de Colores (Evolución)
```css
/* Mantener tu verde característico pero con variaciones */
--primary: #29ae80;
--primary-light: #3dd49d;
--primary-dark: #1f8a64;
--accent: #6366f1; /* Indigo para CTAs */

/* Backgrounds con glassmorphism */
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.1);
--glass-blur: blur(20px);

/* Gradients animados */
--gradient-mesh: conic-gradient(from 180deg, #29ae80, #6366f1, #ec4899);

/* Semantic colors para accesibilidad */
--color-error: #ef4444;
--color-warning: #f59e0b;
--color-success: #10b981;
--color-info: #3b82f6;
```

### Glassmorphism Utility Classes
```css
/* Reutilizable en todo el proyecto */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
}

.glass-card-hover {
  transition: all 0.3s ease;
}

.glass-card-hover:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-4px);
}

/* Respeta prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .glass-card-hover:hover {
    transform: none;
  }
}
```

### Tipografía
```css
/* Fonts modernos 2025 */
--font-display: 'Geist', 'Inter', sans-serif; /* Para títulos */
--font-body: 'Geist', 'Inter', sans-serif;    /* Para texto */
--font-mono: 'JetBrains Mono', monospace;      /* Para código */

/* Scale armónica para jerarquía clara */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

### Animation Tokens
```css
/* Durations */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;

/* Easings */
--ease-out: cubic-bezier(0.33, 1, 0.68, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Espaciado & Grid
- Sistema de 8pt grid (8, 16, 24, 32, 40, 48, 64, 80, 96)
- Max-width: 1400px para contenido
- Padding responsivo:
  - Mobile: 16px (1rem)
  - Tablet: 32px (2rem)
  - Desktop: 48px (3rem)

---

## Stack Tecnológico

### Core
- **Framework**: Next.js 15 (App Router)
- **Package Manager**: pnpm
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0

### UI Components
**Decisión Técnica**: Base UI + Shadcn/ui

**Razón**:
- **Base UI**: Headless components de Material-UI con hooks accesibles
- **Shadcn/ui**: Componentes copiables, customizables, modernos
- **Combinación perfecta**: Base UI para lógica + Shadcn para estilos
- **Ventajas sobre React Bits**:
  - Más maduro y mantenido (Base UI es oficial de MUI)
  - Mejor documentación y ejemplos
  - Mayor flexibilidad para customización
  - Shadcn permite copiar componentes y modificar a necesidad
  - Mejor soporte para TypeScript
  - Comunidad más grande

**Componentes Shadcn a Utilizar**:
- Card, Button, Input, Textarea, Form
- Dialog, Sheet, Toast
- Badge, Avatar, Separator
- Tabs, Toggle, Switch

### Utilidades
- **next-intl**: Internacionalización (ES/EN)
- **React Hook Form + Zod**: Formularios validados
- **Sonner**: Toast notifications (integrado con Shadcn)
- **Lucide Icons**: Iconos modernos y tree-shakeable

### Animaciones
- **Framer Motion**: Animaciones React declarativas
- **Scroll-driven Animations** (CSS nativo donde sea posible)
- Custom hooks para animaciones reutilizables

### Performance & Monitoring
- **next/image**: Optimización de imágenes automática
- **Vercel Analytics**: Métricas y performance monitoring
- **Lighthouse CI**: 95+ score objetivo en CI/CD

---

## Responsive Design

### Breakpoints
```javascript
const breakpoints = {
  mobile: '320px',   // Mobile small
  sm: '640px',       // Mobile large
  md: '768px',       // Tablet
  lg: '1024px',      // Desktop
  xl: '1280px',      // Desktop large
  '2xl': '1536px'    // Desktop extra large
}
```

### Mobile-First Approach
Todos los componentes se desarrollan primero para mobile (320px) y se escalan hacia arriba.

### Adaptaciones por Dispositivo

#### Mobile (320px - 640px)
- Hero: 100svh (safe viewport), stack vertical
- Navigation: Bottom navigation con dots flotantes
- Bento Grid: Stack vertical completo
- Timeline: Horizontal scroll con snap points
- Projects: Vertical stack con swipe gestures
- Contact: Stack vertical, form primero
- Typography: Escala 85% de base

#### Tablet (641px - 1024px)
- Hero: 100svh, layout balanceado
- Navigation: Side dots o top bar
- Bento Grid: 2 columnas con wrapping inteligente
- Timeline: Horizontal scroll mantenido
- Projects: Grid 2 columnas
- Contact: Split 50/50
- Typography: Escala 92% de base

#### Desktop (1025px+)
- Hero: 100svh, experiencia completa
- Navigation: Fixed side dots con labels
- Bento Grid: Layout completo asimétrico
- Timeline: Horizontal scroll con preview
- Projects: Grid 2-3 columnas con hover
- Contact: Split 40/60
- Typography: Escala 100%

### Touch vs Mouse Interactions
- Touch: Tap areas mínimo 44x44px (WCAG)
- Mouse: Hover states, cursor personalizado opcional
- Hybrid: Detectar input method y adaptar

---

## Animaciones & Interacciones

### Hero Entrance
```javascript
// Secuencia de entrada cinematográfica
// Total: 2.5 segundos
1. Fade in background mesh (0-0.5s)
2. Scale up + fade in avatar (0.3-0.8s)
3. Fade in + slide up nombre (0.8-1.5s)
4. Fade in subtitle (1.5-2s)
5. Fade in scroll indicator (2-2.5s)

// Con prefers-reduced-motion: Todo aparece instantáneamente
```

### Scroll-Triggered Animations
```javascript
// Usando Intersection Observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
}

// Animaciones al entrar en viewport:
- Fade in + translateY(-20px to 0)
- Stagger para listas (delay: 100ms entre items)
- Counter animations para números
- Reveal masks para imágenes
```

### Micro-interactions
- **Buttons**: Scale 0.98 on press, ripple effect opcional
- **Cards**: Hover tilt 3D sutil (max 5deg), border glow
- **Links**: Underline animation de izquierda a derecha
- **Form fields**: Focus ring con escala suave, error shake
- **Navigation dots**: Active dot con scale + color change

### Performance Considerations
- GPU acceleration con `transform` y `opacity`
- Evitar `layout` y `paint` triggers
- `will-change` solo cuando sea necesario
- RequestAnimationFrame para animaciones custom
- Intersection Observer para trigger solo cuando sea visible

---

## Accessibility Requirements (WCAG 2.1 AA)

### Must-Haves

#### Keyboard Navigation
- Todos los elementos interactivos accesibles con Tab
- Focus visible con outline de 2px mínimo
- Skip to content link en primera posición
- Keyboard shortcuts documentados (opcional pero nice-to-have)
- Focus trap en modales y menús

#### Screen Readers
- Semantic HTML (nav, main, section, article, aside, footer)
- ARIA labels donde sea necesario
- ARIA-live regions para cambios dinámicos
- Alt text descriptivo en todas las imágenes
- Roles apropiados (button, navigation, complementary)

#### Color & Contrast
- Ratio mínimo 4.5:1 para texto normal
- Ratio mínimo 3:1 para texto grande (18pt+)
- No depender solo del color para información
- Dark mode con contraste adecuado

#### Motion & Animation
- Respeto a `prefers-reduced-motion`
- Alternativas sin animación funcionales
- Parallax deshabilitado en reduced-motion
- Autoplay solo para elementos decorativos

#### Forms & Validation
- Labels explícitos para todos los campos
- Error messages claros y asociados
- Validación en tiempo real sin spam
- Success states anunciados
- Focus management en errores

### Testing Checklist
- [ ] Navegación completa con keyboard solamente
- [ ] Screen reader (NVDA/JAWS/VoiceOver) en todas las secciones
- [ ] Lighthouse Accessibility score 95+
- [ ] axe DevTools sin errores críticos
- [ ] Zoom 200% sin pérdida de funcionalidad
- [ ] Prefers-reduced-motion respetado en todas las animaciones

---

## Performance Requirements

### Core Web Vitals Targets
```
LCP (Largest Contentful Paint): < 2.5s
FID (First Input Delay): < 100ms
CLS (Cumulative Layout Shift): < 0.1
FCP (First Contentful Paint): < 1.8s
TTI (Time to Interactive): < 3.5s
```

### Optimization Strategies

#### Images
- next/image para todas las imágenes
- WebP/AVIF formats con fallback
- Lazy loading por defecto
- Blur placeholder para images principales
- Responsive images con srcset

#### JavaScript
- Code splitting por ruta
- Dynamic imports para componentes pesados
- Tree shaking habilitado
- Bundle analysis en CI
- Target: < 100kb initial JS

#### CSS
- Tailwind CSS purge habilitado
- Critical CSS inline
- No CSS-in-JS runtime
- Target: < 30kb initial CSS

#### Fonts
- Self-hosted fonts (no Google Fonts CDN)
- Font subsetting
- font-display: swap
- Preload font files críticos

#### Caching & CDN
- Vercel Edge Network
- Static generation donde sea posible
- Cache-Control headers apropiados
- Service Worker opcional para offline

### Monitoring
- Vercel Analytics para métricas reales
- Lighthouse CI en cada PR
- Performance budgets configurados
- Alertas si métricas degradan

---

## Progressive Enhancement Strategy

### Layer 1: HTML Base (Core Functionality)
- Contenido visible y accesible
- Formulario de contacto funcional (mailto fallback)
- Links de navegación funcionando
- Imágenes con alt text

### Layer 2: CSS Enhancement (Visual Design)
- Glassmorphism y estilos avanzados
- Grid layouts responsivos
- Hover states y transiciones básicas
- Dark mode toggle

### Layer 3: JavaScript Enhancement (Interactions)
- Animaciones scroll-driven
- Smooth scrolling entre secciones
- Form validation en tiempo real
- Micro-interactions y parallax

### Graceful Degradation
- Sin JavaScript: Todo el contenido visible, navegación funcional
- Sin CSS moderno: Fallbacks para grid, backdrop-filter
- Conexión lenta: Loading states, optimistic UI
- Navegadores antiguos: Polyfills mínimos, feature detection

---

## Fases de Implementación (Revisadas)

### Fase 1: Foundation & Hero (Días 1-3)
**Objetivo**: Setup técnico + primera sección impresionante

**Tareas**:
- [ ] Inicializar Next.js 15 + pnpm + TypeScript
- [ ] Configurar Tailwind CSS 4.0 con design tokens
- [ ] Setup Shadcn/ui (npx shadcn-ui@latest init)
- [ ] Configurar next-intl (ES/EN)
- [ ] Crear design system base (colors, typography, spacing)
- [ ] Implementar Hero section completa:
  - Background mesh animado
  - Typography con animaciones
  - Scroll indicator
  - Responsive behavior
  - Accessibility basics
- [ ] Setup floating navigation dots (básico)

**Entregable**: Hero section funcional, responsive y accesible.

---

### Fase 2: Featured Work (Días 4-6)
**Objetivo**: Mostrar proyectos de forma impactante

**Tareas**:
- [ ] Diseñar y desarrollar project cards con Shadcn Card
- [ ] Implementar filtros con Shadcn Tabs
- [ ] Sistema de expansión con Shadcn Dialog
- [ ] Galería de imágenes en modal
- [ ] Lazy loading de imágenes con next/image
- [ ] Animaciones de entrada staggered
- [ ] Responsive grid (vertical → 2 col → 3 col)
- [ ] Keyboard navigation en filtros y cards
- [ ] Touch gestures para mobile

**Entregable**: Section Featured Work completa, datos hardcoded OK.

---

### Fase 3: About Section Simplificada (Días 7-9)
**Objetivo**: Bento grid ligero con info esencial

**Tareas**:
- [ ] Diseñar layout Bento Grid simplificado (5-6 cards)
- [ ] Implementar cards individuales:
  - Bio card con "Leer más" expandible
  - Stats counter con animación
  - Current role card
  - Tech stack badges
  - Timeline horizontal (top 3-4 posiciones)
  - Skills pills animados
- [ ] Hover effects sutiles (tilt 3D)
- [ ] Responsive: grid → stack vertical
- [ ] Timeline horizontal scrollable con snap
- [ ] Botón "Descargar CV" con estados
- [ ] Keyboard navigation en timeline

**Entregable**: About section funcional sin complejidad innecesaria.

---

### Fase 4: Contact & Footer (Días 10-11)
**Objetivo**: Forma de contacto funcional + navegación completa

**Tareas**:
- [ ] Implementar contact form con React Hook Form + Zod
- [ ] Integrar Shadcn Form components
- [ ] Validación en tiempo real
- [ ] Loading states, success/error con Sonner Toast
- [ ] Social links con iconos Lucide
- [ ] Email backend (API route Next.js)
- [ ] Footer con links rápidos
- [ ] Completar floating navigation dots:
  - Active section detection
  - Smooth scroll to section
  - Keyboard shortcuts (opcional)
- [ ] Theme toggle funcional (dark/light)
- [ ] Language toggle (ES/EN) completo
- [ ] Back to top button

**Entregable**: Portafolio completamente navegable y funcional.

---

### Fase 5: Polish, Performance & Deploy (Días 12-14)
**Objetivo**: Optimización y lanzamiento production-ready

**Tareas**:
- [ ] Lighthouse audit completo (target 95+ en todas las métricas)
- [ ] Optimización de imágenes:
  - Comprimir todas las imágenes
  - Generar WebP/AVIF
  - Añadir blur placeholders
- [ ] Performance optimizations:
  - Code splitting review
  - Bundle size analysis
  - Lazy loading components
- [ ] Accessibility audit:
  - Keyboard navigation completa
  - Screen reader testing
  - axe DevTools sin errores
  - Contrast checking
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Responsive testing (320px → 2560px)
- [ ] SEO optimization:
  - Meta tags
  - Open Graph
  - Twitter Cards
  - Sitemap
  - robots.txt
- [ ] Configurar Vercel Analytics
- [ ] Deploy a Vercel con dominio custom
- [ ] 404 page custom
- [ ] Loading states finales
- [ ] Error boundaries
- [ ] Documentación README.md

**Entregable**: Portfolio 100% funcional, optimizado y desplegado.

---

## Comparación: Actual vs Propuesto

| Aspecto | Actual | Propuesto | Mejora |
|---------|--------|-----------|--------|
| **Framework** | React + Vite | Next.js 15 | SSR, mejor SEO, optimizaciones |
| **Routing** | Multi-page (React Router) | Single page scroll | Experiencia más fluida |
| **Styling** | CSS Modules | Tailwind CSS 4.0 | Desarrollo más rápido, DX |
| **Components** | Custom + varias librerías | Base UI + Shadcn | Unificado, mantenible |
| **Animations** | Framer Motion + GSAP | Framer Motion + CSS | Más ligero, mejor performance |
| **i18n** | i18next | next-intl | Mejor integración Next.js |
| **Package Manager** | npm | pnpm | Más rápido, menos espacio |
| **Accessibility** | Básico | WCAG 2.1 AA | Inclusivo desde el inicio |
| **Performance** | Bueno | Excelente | < 2.5s LCP, 95+ Lighthouse |
| **Mobile** | Responsive | Mobile-first | Mejor UX en móviles |
| **Viewport** | 100vh | 100svh | Sin problemas mobile |
| **Motion** | No considerado | Prefers-reduced-motion | Accesible para todos |

---

## Diferenciadores Clave

### Lo que hace este portafolio único:

1. **Scroll Experience**: Narrativa fluida sin clicks innecesarios
2. **Mobile-First Real**: Diseñado desde 320px hacia arriba
3. **Accessibility Built-in**: No es un afterthought, es fundamental
4. **Performance Obsessed**: < 2.5s LCP, 95+ Lighthouse score
5. **Progressive Enhancement**: Funciona sin JavaScript, increíble con él
6. **Glassmorphism Moderno**: Con tokens reutilizables y consistentes
7. **Motion Respects Users**: prefers-reduced-motion en todas las animaciones
8. **Tech Stack Práctico**: Base UI + Shadcn = Flexibilidad + Calidad
9. **Bilingüe Nativo**: ES/EN sin recargas con next-intl
10. **Production Ready**: No es un demo, es un sistema escalable

---

## Próximos Pasos

1. **Revisión de propuesta**: Validar secciones, contenido y prioridades
2. **Preparar contenido**:
   - Textos finales (ES/EN)
   - Imágenes de proyectos optimizadas
   - CV actualizado para descarga
3. **Decisión sobre 3D**: ¿Mantener elementos 3D sutiles en hero o full 2D?
4. **Contenido adicional futuro**: Blog, testimonios, certificaciones (post-MVP)
5. **Inicio de desarrollo**: Setup proyecto Next.js según Fase 1

---

## Referencias & Recursos

### Documentación Oficial
- **Next.js 15**: https://nextjs.org/docs
- **Tailwind CSS 4.0**: https://tailwindcss.com/
- **Shadcn/ui**: https://ui.shadcn.com/
- **Base UI**: https://mui.com/base-ui/
- **next-intl**: https://next-intl-docs.vercel.app/

### Design Inspiration
- **Awwwards**: https://www.awwwards.com/
- **Glassmorphism Generator**: https://hype4.academy/tools/glassmorphism-generator
- **CSS Layout Patterns**: https://web.dev/patterns/layout/

### Accessibility Resources
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **A11y Project**: https://www.a11yproject.com/
- **WebAIM**: https://webaim.org/

### Performance Tools
- **Lighthouse**: https://developer.chrome.com/docs/lighthouse/
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **Vercel Analytics**: https://vercel.com/analytics

---

## Preguntas para Validación

1. **Scroll infinito vs navegación tradicional**: ¿Te convence la experiencia de scroll fluido?
2. **Sección más importante**: ¿Cuál debe tener más peso visual: Projects o About?
3. **Complejidad vs simplicidad**: ¿El bento grid simplificado mantiene tu visión?
4. **3D en hero**: ¿Quieres mantener elementos 3D sutiles o prefieres 2D puro?
5. **Contenido adicional**: ¿Necesitas blog o testimonios en MVP o son post-launch?
6. **Timeline de implementación**: ¿12-14 días es realista para tu disponibilidad?
7. **Referencias de diseño**: ¿Hay algún portafolio que te inspire especialmente?

---

**Versión del documento**: 2.0
**Última actualización**: 2025-12-19
**Status**: Implementation Ready
