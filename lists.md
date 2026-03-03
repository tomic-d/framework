# OneType Transforms - Master List

Total: 74 transforms (24 completed, 50 planned)

---

## Completed

| # | ID | Category | Tier | Deps |
|---|-----|----------|------|------|
| 1 | accordion | Navigation | Free | - |
| 2 | anime | Animation | Pro | anime.js |
| 3 | before-after | Interaction | Free | - |
| 4 | count-up | Animation | Pro | countup.js |
| 5 | cursor | Interaction | Pro | - |
| 6 | horizontal-scroll | Layout | Pro | - |
| 7 | leaflet | Data | Pro | leaflet |
| 8 | lightbox | Media | Pro | - |
| 9 | lottie | Media | Pro | lottie-web |
| 10 | magnetic | Interaction | Free | - |
| 11 | marquee | Animation | Free | - |
| 12 | morph | Animation | Free | flubber |
| 13 | orbit | Animation | Free | - |
| 14 | particles | Animation | Pro | particles.js |
| 15 | ripple | Interaction | Free | - |
| 16 | scramble | Text | Free | - |
| 17 | signature | Media | Pro | signature_pad |
| 18 | split | Text | Free | - |
| 19 | spotlight | Interaction | Free | - |
| 20 | swiper | Layout | Pro | swiper |
| 21 | tabs | Navigation | Free | - |
| 22 | tilt | Interaction | Free | - |
| 23 | toc | Navigation | Free | - |
| 24 | typewriter | Text | Free | - |

---

## Planned

### 1. scroll-reveal

- **Category:** Animation
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Elements animate into view on scroll - fade, slide, zoom, or flip - with optional stagger for groups of children. Uses IntersectionObserver for zero-cost idle performance. Supports per-element animation type via attribute, per-group stagger via parent, and once-only or repeat triggers. The single most requested effect across all no-code platforms. Covers the most common scroll animation patterns: cards fading up, stats sliding in, hero sections zooming. CSS classes drive animations keeping JS minimal and everything GPU-accelerated via transform and opacity.

---

### 2. text-reveal

- **Category:** Text
- **Tier:** Pro
- **Deps:** None
- **Completed:** No

Scroll-driven text reveal where content starts dim and fills with color as it enters the viewport. Each word, character, or line progressively transitions from muted to full opacity/color as the user scrolls - the signature Apple-style reading experience. Uses IntersectionObserver with scroll progress tracking to map scroll position to individual element opacity. Splits text into spans (word, character, or line mode), calculates scroll progress through the element, and maps that to each span's index with stagger offset. Word-level splitting is the default for the classic Apple feel.

---

### 3. parallax

- **Category:** Animation
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Multi-layer depth effect where elements scroll at different speeds relative to the viewport. Each element gets a speed multiplier - negative values scroll slower (background feel), positive values scroll faster (foreground feel). Uses transform translate3d on a requestAnimationFrame loop for GPU-accelerated 60fps rendering. Respects prefers-reduced-motion and disables on mobile by default where parallax causes vestibular issues. The timeless scroll effect used on nearly every award-winning website. Simple to configure, dramatic visual impact.

---

### 4. stack

- **Category:** Animation
- **Tier:** Pro
- **Deps:** None
- **Completed:** No

Cards stack on top of each other as the user scrolls using CSS position sticky. Each card pins to the viewport and overlaps the previous one. As a card becomes covered it scales down slightly and gains shadow depth, creating a layered deck effect. Pure CSS sticky handles the pinning while a lightweight scroll listener applies progressive scale and shadow to buried cards. Works with 3-8 cards practically. One of the most cloned effects on Webflow with 343+ clones on the top cloneable alone.

---

### 5. smooth-scroll

- **Category:** Utility
- **Tier:** Free
- **Deps:** lenis
- **Completed:** No

Applies Lenis-style momentum-based smooth scrolling to the page. Intercepts native wheel and touch events, applies linear interpolation between current and target scroll positions on each frame, producing a buttery deceleration curve. Works with native scroll position so IntersectionObserver, anchor links, and scroll-based animations remain compatible. Lenis is the industry standard at ~2KB gzipped, MIT license, actively maintained. Does not create a virtual scroll container. Nearly every award-winning website uses this effect as the foundation for all other scroll animations.

---

### 6. page-transition

- **Category:** Navigation
- **Tier:** Pro
- **Deps:** None
- **Completed:** No

Smooth animated transitions between pages without full browser reloads. Intercepts link clicks, fetches the target page in the background, plays an exit animation on current content, swaps the DOM, then plays an entry animation while updating browser history. Supports fade crossfade, directional slide, curtain wipe, circle reveal, and pixel dissolve. Handles back/forward, scroll position restoration, and link prefetching on hover. Excludes external links and anchors automatically. The biggest feature request on the Webflow wishlist and a defining trait of Awwwards-winning sites.

---

### 7. pricing-toggle

- **Category:** Utility
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Pricing toggle that switches displayed prices between billing intervals like monthly and yearly. Users place a toggle control alongside pricing cards containing price elements with data attributes for each interval. Clicking the toggle animates between values, updates visible prices, and optionally shows a discount badge. Works with any HTML structure - the toggle and price elements are linked through data attributes, not DOM hierarchy. Every SaaS website needs this. 42 pricing cloneables exist on Webflow just for this pattern.

---

### 8. countdown

- **Category:** Data
- **Tier:** Pro
- **Deps:** None
- **Completed:** No

Countdown timer displaying remaining time until a target date. Supports simple digit display and optional flip-clock animation where cards physically flip to reveal new numbers. Handles timezone differences via UTC calculation and fires a configurable action at zero - hide the element, show a message, or redirect. Displays days, hours, minutes, and seconds with customizable labels. Always computes remaining time from live Date diff to avoid drift. Multiple paid Webflow apps exist just for this functionality. High commercial value for launches and sales.

---

### 9. scroll-progress

- **Category:** Utility
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Visual reading progress indicator that fills as the user scrolls. Supports a horizontal bar fixed to top or bottom of the page, or a circular SVG indicator fixed in a corner. Uses a scroll event listener with requestAnimationFrame throttling for smooth updates. The bar variant uses transform scaleX for GPU-accelerated rendering. The circle variant uses the classic stroke-dasharray/dashoffset technique. Perfect for blog posts, documentation, and long-form content. Mentioned by 10+ research agents as a universally requested feature.

---

### 10. gradient

- **Category:** Animation
- **Tier:** Pro
- **Deps:** None
- **Completed:** No

Animated gradient backgrounds with three variants - mesh (Stripe-style flowing color blend), aurora (soft blurred orbs with hue shifts), and orbs (distinct glowing circles that float and pulse). Pure CSS approach using absolutely-positioned blurred div elements with keyframe animations. No WebGL needed. Colors applied as background on each orb with filter blur for soft blending. Mesh variant stacks radial-gradient layers and animates background-position. Aurora adds hue-rotate per layer. Matches how Stripe and Linear implement their famous gradient effects.

---

### 11. noise

- **Category:** Utility
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Film grain and noise texture overlay using SVG feTurbulence filter. Adds organic texture to any element - static grain for subtle depth or animated grain that cycles through random seeds for a film-camera feel. Renders as a pseudo-element overlay with pointer-events none so it never blocks interaction. Supports CSS blend modes for creative layering. The filter uses fractalNoise type with configurable baseFrequency for grain fineness. Animated mode cycles the seed attribute at 12fps for film cadence. Premium aesthetic used by Apple, Linear, and Raycast.

---

### 12. draw-svg

- **Category:** Animation
- **Tier:** Pro
- **Deps:** None
- **Completed:** No

Animates SVG stroke paths using the stroke-dasharray/dashoffset technique. Each path, line, circle, polyline, polygon, rect, and ellipse's total length is measured via getTotalLength(), then the stroke animates from fully hidden to fully drawn. Supports scroll-triggered drawing synced to scroll position or load-triggered one-shot animation. Multiple paths stagger for sequential reveal. Perfect for logo animations, illustrations, diagrams, and decorative line work. 5,487 views on the Framer marketplace for SVG reveal components alone.

---

### 13. masonry

- **Category:** Layout
- **Tier:** Pro
- **Deps:** minimasonry
- **Completed:** No

Pinterest-style cascading grid layout that positions variable-height items into columns with no vertical gaps. Items fill the shortest column first creating a dense, visually balanced layout. Uses MiniMasonry.js (~3KB) for GPU-accelerated CSS transform positioning with automatic responsive column counts based on container width. On Webflow's official wishlist with no native solution available. Handles responsive breakpoints automatically, repositions on resize, and supports dynamic content via layout() method. Essential for image galleries, card grids, and portfolios.

---

### 14. tooltip

- **Category:** Utility
- **Tier:** Free
- **Deps:** @floating-ui/dom
- **Completed:** No

Positioned tooltip that appears on hover or click, auto-repositioning to stay within the viewport. Uses Floating UI (~2.5KB gzipped) for collision-aware positioning with arrow support. Handles all 12 placements, flips when clipped, shifts along edges, and animates in/out with CSS transitions. Accessible via aria-describedby and keyboard focus/blur. No native tooltip solution exists in Webflow or Framer. Universally needed across every type of website for help text, definitions, and supplementary information.

---

### 15. modal

- **Category:** Utility
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Accessible popup dialog built on the native HTML dialog element with showModal(). Gets focus management, backdrop, ESC key, and inert background for free from the browser. Adds scroll locking, CSS enter/exit animations (fade, scale, slide), close-on-backdrop click, and proper focus restoration. Finsweet built a dedicated modal attribute for Webflow because it's such a common need. No heavy library required - the native dialog API handles the hard accessibility work while the transform adds polish and animation.

---

### 16. glitch

- **Category:** Animation
- **Tier:** Free
- **Deps:** None
- **Completed:** No

RGB channel splitting, scan lines, and noise distortion applied to text or images. Uses CSS-only pseudo-elements with animated clip-path for zero-dependency performance. Two before/after layers duplicate the content with opposing color shifts and random horizontal band clipping creating chromatic aberration and digital corruption. For text, content attr(data-text) clones into pseudo-layers. Trigger modes control constant, hover, or interval playback. Dynamically generated clip-path keyframes provide randomized distortion patterns. Trending cyberpunk aesthetic popular on tech and creative sites.

---

### 17. circular-text

- **Category:** Text
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Arranges text characters in a circular path with optional continuous rotation. Uses SVG textPath approach - an invisible circular path is generated, text is placed on it via textPath, and CSS animation handles rotation. Scales responsively via viewBox. Speed of zero produces static text, any value sets seconds per revolution. Direction controls clockwise vs counter-clockwise. Trending heavily for badges, decorative elements, CTAs, and hero sections. No native support in any no-code builder makes this a unique offering.

---

### 18. confetti

- **Category:** Animation
- **Tier:** Free
- **Deps:** canvas-confetti
- **Completed:** No

Celebration particle burst with configurable physics. Uses canvas-confetti (~6KB gzipped) - the industry standard with 6M+ weekly npm downloads. Supports square, circle, and star particle shapes, custom colors, gravity, spread angle, velocity decay, and drift. Trigger modes: click, scroll into view, or auto on load. The library handles its own canvas creation and cleanup, returns promises for chaining, and supports disableForReducedMotion for accessibility. Perfect for success states, form completions, product launches, and celebratory CTAs.

---

### 19. image-trail

- **Category:** Interaction
- **Tier:** Pro
- **Deps:** None
- **Completed:** No

Images follow the cursor leaving a fading trail as you move across a container. Child img elements form a pool that cycles through on mouse movement. Each image activates at the cursor position, scales in, then fades and scales out after a configurable lifespan. Uses a circular index and distance threshold to avoid flooding. Random rotation scales with cursor speed for dynamic feel. GPU-composited via will-change transform. The signature portfolio-site effect seen on creative agencies and Awwwards winners. High wow factor.

---

### 20. shimmer

- **Category:** Text
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Animated light sweep across text creating a metallic shine or glint effect. A gradient highlight moves across the text surface on a continuous loop or on hover. Achieved entirely with CSS using background-clip text and animated background-position on a linear gradient containing a bright highlight band. Pure CSS approach - no JS needed beyond initial setup. The angle is controlled by gradient direction. GPU-composited, no repaints, no layout thrashing. Perfect for hero headlines, CTAs, and premium text treatments on SaaS landing pages.

---

### 21. scroll-snap

- **Category:** Utility
- **Tier:** Pro
- **Deps:** None
- **Completed:** No

Full-page section snapping that turns a container into a smooth section-by-section scroll experience. Built on CSS scroll-snap-type for native 60fps performance with a thin JS layer for dot navigation and active section tracking. Optional keyboard arrow support and programmatic scroll-to-section. Uses scrollsnapchange event with IntersectionObserver fallback for older browsers. A replacement for fullpage.js without the 50KB+ weight, commercial license, or scroll hijacking. Ideal for landing pages, portfolios, and presentations.

---

### 22. flip

- **Category:** Interaction
- **Tier:** Free
- **Deps:** None
- **Completed:** No

3D card flip revealing back-face content on hover or click. Uses CSS perspective on the container, transform-style preserve-3d on the card wrapper, and backface-visibility hidden on both faces. Front and back are absolutely positioned children - the back is pre-rotated 180deg. Toggling a class applies rotateY or rotateX depending on direction config. Pure CSS transitions handle the animation. The transform automatically parses existing children as front/back content and wraps them in the 3D structure. Perennially popular on CodePen and Webflow.

---

### 23. scroll-video

- **Category:** Media
- **Tier:** Pro
- **Deps:** None
- **Completed:** No

Ties video playback to scroll position using image sequence on canvas. Users provide a URL pattern with frame index placeholder and total count. Pre-loaded frames are drawn to canvas based on scroll progress through a sticky container. Frame-perfect accuracy with consistent cross-browser behavior - no codec seeking issues. Bidirectional scrubbing works equally smooth forward and reverse. This is how Apple builds their product pages (AirPods, MacBook). The element pins in viewport while a tall scroll container controls playback. 157 Webflow wishlist votes.

---

### 24. sticky-section

- **Category:** Layout
- **Tier:** Pro
- **Deps:** None
- **Completed:** No

Two-column layout where one side stays pinned while the other scrolls through content steps. As each step enters the viewport, the pinned side swaps its media with crossfade, scale, or slide transitions. Uses CSS position sticky for the pinning and IntersectionObserver for step detection - no scroll event listeners. The classic scrollytelling pattern used by Apple, Stripe, and The Pudding for product feature showcases. Collapses to stacked layout on mobile automatically. High-value storytelling component for SaaS landing pages.

---

### 25. filter

- **Category:** Utility
- **Tier:** Pro
- **Deps:** mixitup
- **Completed:** No

Filterable and sortable grid with animated transitions between states. Users click category buttons to show/hide items with smooth fade, scale, and transform animations. Uses MixItUp 3 (~7KB gzipped, Apache 2.0 license). Items animate out, reposition, and new items animate in - all GPU-accelerated. Supports single/toggle filter modes, custom sort orders, and configurable animation effects. Filter buttons use data-filter attributes with CSS selectors. Finsweet's most popular attribute and the most-discussed feature in Webflow forums.

---

### 26. holo-card

- **Category:** Interaction
- **Tier:** Pro
- **Deps:** None
- **Completed:** No

Holographic card combining tilt with an iridescent rainbow gradient that shifts with mouse position. A rainbow gradient layer with spectral color stops uses mix-blend-mode color-dodge and is repositioned via CSS custom properties on mousemove. A separate glare layer with radial gradient white highlight follows the cursor for light-reflection shine. Tilt applied via perspective rotateX rotateY. The most-hearted effect on CodePen of all time. Self-contained with built-in tilt, no dependency on the tilt transform.

---

### 27. glow

- **Category:** Interaction
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Animated gradient border and neon glow effect on hover or constant. A pseudo-element border renders an animated conic or linear gradient that rotates around the element creating a glowing, electric border. On hover, the glow intensifies with increased blur and opacity. Uses CSS conic-gradient plus filter blur for the glow aura. Supports configurable colors, animation speed, and glow radius. Peak 2025 web design trend seen on pricing cards, feature sections, and CTAs. Stripe-inspired flashlight border variant follows cursor position.

---

### 28. dark-mode

- **Category:** Utility
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Theme toggle switching between light and dark modes with localStorage persistence and system preference detection. Sets data-theme attribute on html enabling CSS custom property overrides. Includes flash prevention via inline blocking script that reads localStorage synchronously before paint. Smooth CSS transitions on theme change. Listens for prefers-color-scheme changes in real time. Toggle button with sun/moon icons rendered automatically. The established pattern used by Vercel, Next.js, and every serious dark mode implementation. Universal need across all websites.

---

### 29. toast

- **Category:** Utility
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Non-blocking notification popup that slides in from a screen edge and auto-dismisses after configurable duration. Supports success, error, info, and warning types with distinct styling. Multiple toasts stack vertically with smooth CSS transitions. Timer pauses on hover. Swipe-to-dismiss on touch devices via pointer tracking with velocity threshold. Max-visible config caps simultaneous toasts with FIFO removal. No native notification component exists in Webflow or Framer. Triggered via a global API or click elements with data attributes.

---

### 30. back-to-top

- **Category:** Utility
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Floating button fixed to a screen corner that appears after scrolling past a configurable threshold. Clicking smooth-scrolls to top. Optionally renders an SVG circular progress ring around the button showing scroll percentage using stroke-dasharray/dashoffset technique. Entrance/exit uses fade or slide animation. Uses Material Symbols icon inheriting the site's icon system. Detects if Lenis smooth-scroll is active and uses lenis.scrollTo(0) for consistency. Simple universal utility that every long-page website needs.

---

### 31. donut-chart

- **Category:** Data
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Animated SVG donut/pie chart rendering data segments as colored arcs around a central hole. Each segment animates its stroke from zero to target length on scroll into view. Child elements define segments via data attributes - each child becomes one arc. Uses SVG circle elements with stroke-dasharray/dashoffset math. Supports configurable thickness, gap between segments, center label, and custom colors per segment. IntersectionObserver triggers animation with staggered reveal per segment. Perfect for market share breakdowns, feature usage stats, and plan distributions on SaaS pages.

---

### 32. bar-chart

- **Category:** Data
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Animated horizontal or vertical bar chart. Each bar grows from zero to its target value when scrolled into view. Child elements define bars via value, label, and color attributes. Pure CSS-based bars using width/height transitions for maximum compatibility. Supports value labels on each bar, auto-scaling to max value, and staggered entry animations. The container uses flexbox with configurable direction. IntersectionObserver triggers the fill animation. Second most requested chart type after donut. Essential for skill bars, comparison stats, and metrics displays.

---

### 33. timeline

- **Category:** Data
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Vertical or horizontal timeline with animated entry points on scroll. Each entry has a date marker and content block connected by a line running through dot indicators. Vertical layout supports alternating left/right sides. Pure CSS line and dots with IntersectionObserver for scroll-triggered staggered reveal. User provides pairs of children - date/label and content. The transform wraps each pair in the structured layout with markers, dots, and connecting line. Ideal for company history, product roadmaps, changelogs, and project milestones.

---

### 34. skeleton

- **Category:** Utility
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Shimmer or pulse placeholder animation for loading content. Overlays skeleton shapes on child elements auto-detecting dimensions. Shimmer uses an animated linear-gradient sweeping across elements. Pulse uses opacity fading. Background-attachment fixed syncs all bones shimmering together. Remove skeleton state by adding a loaded attribute or dispatching custom event - watched via MutationObserver. Auto-reads border-radius from computed styles. Aria-busy true set during loading. The Facebook/YouTube loading pattern adopted by every modern web application for perceived performance.

---

### 35. progress-bar

- **Category:** Data
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Horizontal animated progress bar that fills to a target percentage when scrolled into view. A single track with a fill element that transitions its width via CSS. Optional label shows percentage with counting animation synchronized to fill duration. IntersectionObserver triggers at configurable threshold. The fill uses transform scaleX for GPU-accelerated rendering. Configurable colors, height, border radius, and easing. The simplest data visualization component - universally useful for skill bars, loading indicators, completion metrics, and stat displays across every type of website.

---

### 36. number-ticker

- **Category:** Animation
- **Tier:** Pro
- **Deps:** None
- **Completed:** No

Odometer/slot-machine style digit animation where each digit rolls independently through a vertical column of numbers 0-9. Unlike count-up which interpolates values, number-ticker physically scrolls digit columns using CSS translateY transitions. Each column is a strip of stacked 0-9 digits inside an overflow hidden container. Supports thousands separators, decimal places, prefix and suffix formatting. Per-column duration stagger creates a wave effect. Different from count-up in the visual mechanic - digits physically roll rather than interpolating. Premium dashboard feel.

---

### 37. avatar-stack

- **Category:** Social
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Overlapping circular avatars in a horizontal row with an optional counter badge showing overflow count like "+2,400 users". Child img elements become circular, stacked via negative margins. Hover expands the stack to reveal obscured avatars with smooth transition. Each avatar gets a border matching the page background for clean separation. Max-visible config hides excess avatars behind the counter. The fastest-growing micro-pattern in modern web design - appears in nearly every hero section next to CTAs on SaaS landing pages.

---

### 38. social-proof

- **Category:** Social
- **Tier:** Pro
- **Deps:** None
- **Completed:** No

Auto-cycling toast notification displaying social proof messages like "John from Austin just purchased Product X." Items defined as child elements in HTML - each child becomes one notification. The transform cycles through them with configurable interval and duration, sliding in/out with CSS transitions. Fixed-position container in any corner. Closes on click. An entire SaaS category (ProveSource, WiserNotify, Nudgify) charges $30-50/month just for this widget. Building it as a simple transform undercuts all of them dramatically.

---

### 39. star-rating

- **Category:** Forms
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Star rating component for both display and interactive input. Renders filled, half-filled, and empty stars using inline SVG with linear gradient technique for fractional fill. Interactive mode uses hidden radio inputs for form integration and accessibility with keyboard navigation and ARIA labeling. Display mode renders read-only from a value attribute. CSS-only hover fill using flex-direction row-reverse and sibling selectors. Supports configurable max stars, colors, sizes, and half-star precision. Essential for reviews, feedback forms, and product ratings.

---

### 40. testimonial-wall

- **Category:** Layout
- **Tier:** Pro
- **Deps:** None
- **Completed:** No

Masonry-style grid of testimonial cards with automatic variable-height packing. Uses CSS column-count for true masonry without JavaScript layout calculations. Each child becomes a card with optional avatar, star rating, and source attribution pulled from data attributes. Staggered fade-in animation per card via IntersectionObserver. Responsive columns adapt to container width. Services like Famewall, Senja, and Testimonial.to built entire businesses around this single pattern charging monthly fees. A high-value social proof display component.

---

### 41. multi-step

- **Category:** Forms
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Converts an existing form into a Typeform-style one-question-at-a-time experience. Wraps each direct child as a step, shows one at a time with slide or fade transitions. Includes progress bar, step counter, keyboard navigation (Enter advances, Escape goes back), and per-step validation via native HTML constraint validation. On final step, clicking next triggers form submit. The transform finds the closest parent form. Destroys cleanly restoring original DOM. 78 form cloneables on Webflow - most are multi-step patterns.

---

### 42. underline

- **Category:** Text
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Creative animated underlines for text elements with multiple style variants. Slide variant uses pseudo-element with scaleX transform from left. Expand variant scales from center. Draw variant injects inline SVG path with stroke-dashoffset animation for hand-drawn feel. Marker variant uses linear gradient background positioned at bottom for highlighter effect. Each works on hover or viewport trigger. Multi-line support via box-decoration-break clone. Lightweight, no dependencies, CSS-driven animations with JS orchestrating variant setup. A navigation menu staple across modern websites.

---

### 43. image-distortion

- **Category:** Interaction
- **Tier:** Pro
- **Deps:** None
- **Completed:** No

WebGL displacement and ripple effect on image hover. A canvas overlays the image, rendering through a fragment shader that distorts UV coordinates based on mouse position. Three distortion types: liquid (simplex noise), ripple (sine wave radial), and noise (perlin displacement). Custom raw WebGL implementation at ~3-5KB - no Three.js or OGL needed. On hover, distortion animates in; on leave, settles back. The signature Awwwards agency-site effect. Mouse position drives distortion center with configurable radius and intensity.

---

### 44. mega-menu

- **Category:** Navigation
- **Tier:** Pro
- **Deps:** None
- **Completed:** No

Multi-column dropdown navigation with smooth animations. Each top-level item becomes a trigger, nested content becomes the dropdown panel rendered as CSS grid. Supports hover or click trigger with configurable open/close delays to prevent accidental triggering. Panels animate with fade, slide-down, or grow effects. Auto-closes when cursor leaves. On mobile, switches to click-based interaction. Accessible with aria-expanded, aria-haspopup, Escape key close, and arrow key navigation. Complex to build from scratch, extremely high demand in no-code communities.

---

### 45. range-slider

- **Category:** Forms
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Custom styled range input with value tooltip and labels. Built on native input type range for accessibility with CSS pseudo-elements for cross-browser styling. Supports single-handle and dual-handle modes for min/max range selection. Dual mode uses two overlapping range inputs with pointer-events control. Tooltip follows the thumb showing current value. Filled track via linear-gradient with CSS variables. Configurable min, max, step, prefix, suffix. Finsweet built a dedicated attribute for this - consistently requested for pricing calculators, filters, and configurators.

---

### 46. drawer

- **Category:** Utility
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Slide-in side panel from any viewport edge. Built on native dialog element for accessibility. Supports overlay mode (slides over content with backdrop) and push mode (pushes page content via CSS transform). Touch swipe-to-close on mobile via pointer tracking with velocity threshold. Scroll locks body while open. Direction determines initial off-screen transform. Configurable width/height, backdrop, and close behaviors. Essential for mobile menus, cart panels, filter sidebars, and settings panels. A standard navigation pattern missing from no-code builders.

---

### 47. color-shift

- **Category:** Animation
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Smoothly transitions the background color of a container as the user scrolls through sections. Each child section declares its target color via data attribute. The transform interpolates between colors in real time using RGB channel lerp based on scroll position. The background at any scroll position is the exact mathematical blend between the two nearest section colors. No jarring snaps, no discrete class swaps. Uses scroll listener with requestAnimationFrame throttling. Popular on modern landing pages for creating distinct section atmospheres.

---

### 48. copy-to-clipboard

- **Category:** Utility
- **Tier:** Free
- **Deps:** None
- **Completed:** No

One-click copy with visual feedback. Uses navigator.clipboard.writeText with document.execCommand fallback for older browsers. On success, adds a CSS class to the element for custom styling feedback, optionally swapping icon/text for configurable duration before reverting. Target text comes from element itself, a data attribute, or a CSS selector pointing to another element. Finsweet built a dedicated attribute for this. Universally needed for code blocks, referral links, share URLs, email addresses, and any copyable content across all website types.

---

### 49. preloader

- **Category:** Animation
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Full-screen loading overlay covering the page until content is ready. Three styles: counter (animated 0-100% number), fade (simple opacity transition), and curtain (multi-column staggered wipe). Listens to window load to detect when all resources complete. Counter style simulates progress via lerp toward 90%, jumping to 100 on actual load. Curtain style uses N equal-width vertical columns translating upward with staggered delays. Includes minimum display duration so fast-loading pages still show the animation. Removes overlay from DOM after completion.

---

### 50. dot-grid

- **Category:** Interaction
- **Tier:** Free
- **Deps:** None
- **Completed:** No

Repeating dot matrix background with optional mouse reactivity. Static mode uses pure CSS radial-gradient for zero runtime cost. Interactive mode upgrades to canvas where dots near the cursor respond with glow, expand, or ripple effects. At 20px gap on 1920x1080, that's ~5000 dots - distance calculations are trivial at 60fps. Bounding-box optimization processes only dots within cursor radius. Canvas loop pauses on mouseleave. Resolution-independent, responsive via ResizeObserver. Trending on Magic UI and Aceternity UI as a premium background pattern.
