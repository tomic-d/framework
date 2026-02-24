import onetype from './load.js';

/* Framework */
onetype.Assets('framework', import.meta.url, { js: { path: '.', exclude: ['lib/load.js', 'lib/assets.js'] } });
onetype.Assets('styles', import.meta.url, { css: 'styles' });

/* Core */
onetype.Assets('commands', import.meta.url, { js: { path: '../addons/core/commands', exclude: ['commands/back'] } });
onetype.Assets('database', import.meta.url, { js: '../addons/core/database/front' });

/* Modules */
onetype.Assets('actions', import.meta.url, { js: '../addons/modules/actions/front' });
onetype.Assets('variables', import.meta.url, { js: '../addons/modules/variables' });
onetype.Assets('bugs', import.meta.url, { js: '../addons/modules/bugs/front' });
onetype.Assets('events', import.meta.url, { js: '../addons/modules/events/front' });
onetype.Assets('schedules', import.meta.url, { js: '../addons/modules/schedules/front' });
onetype.Assets('shortcuts', import.meta.url, { js: '../addons/modules/shortcuts/front' });
onetype.Assets('sources', import.meta.url, { js: '../addons/modules/sources/front' });

/* Render */
onetype.Assets('directives', import.meta.url, { js: '../addons/render/directives/front' });
onetype.Assets('transforms', import.meta.url, { js: '../addons/render/transforms' });
onetype.Assets('pages', import.meta.url, { js: '../addons/render/pages', css: '../addons/render/pages/front' });
onetype.Assets('elements', import.meta.url, { js: '../addons/render/elements/front', css: '../addons/render/elements/front' });

/* Float */
onetype.Assets('float', import.meta.url, { js: '../addons/float', css: '../addons/float' });

/* Elements — Form */
onetype.Assets('elements/button', import.meta.url, { js: 'items/elements/form/button', css: 'items/elements/form/button/styles' });
onetype.Assets('elements/checkbox', import.meta.url, { js: 'items/elements/form/checkbox', css: 'items/elements/form/checkbox/styles' });
onetype.Assets('elements/field', import.meta.url, { js: 'items/elements/form/field', css: 'items/elements/form/field' });
onetype.Assets('elements/input', import.meta.url, { js: 'items/elements/form/input', css: 'items/elements/form/input/styles' });
onetype.Assets('elements/radio', import.meta.url, { js: 'items/elements/form/radio', css: 'items/elements/form/radio/styles' });
onetype.Assets('elements/rating', import.meta.url, { js: 'items/elements/form/rating', css: 'items/elements/form/rating' });
onetype.Assets('elements/section', import.meta.url, { js: 'items/elements/form/section', css: 'items/elements/form/section' });
onetype.Assets('elements/slider', import.meta.url, { js: 'items/elements/form/slider', css: 'items/elements/form/slider' });
onetype.Assets('elements/textarea', import.meta.url, { js: 'items/elements/form/textarea', css: 'items/elements/form/textarea' });

/* Elements — Global */
onetype.Assets('elements/card', import.meta.url, { js: 'items/elements/global/card', css: 'items/elements/global/card' });
onetype.Assets('elements/code', import.meta.url, { js: 'items/elements/global/code', css: 'items/elements/global/code' });
onetype.Assets('elements/faq', import.meta.url, { js: 'items/elements/global/faq', css: 'items/elements/global/faq' });
onetype.Assets('elements/heading', import.meta.url, { js: 'items/elements/global/heading', css: 'items/elements/global/heading' });
onetype.Assets('elements/markdown', import.meta.url, { js: 'items/elements/global/markdown', css: 'items/elements/global/markdown' });
onetype.Assets('elements/parameters', import.meta.url, { js: 'items/elements/global/parameters', css: 'items/elements/global/parameters' });
onetype.Assets('elements/tabs', import.meta.url, { js: 'items/elements/global/tabs', css: 'items/elements/global/tabs' });
onetype.Assets('elements/tags', import.meta.url, { js: 'items/elements/global/tags', css: 'items/elements/global/tags' });

/* Transforms */
onetype.Assets('transforms/accordion', import.meta.url, { js: 'items/transforms/accordion' });
onetype.Assets('transforms/chart', import.meta.url, { js: 'items/transforms/chart' });
onetype.Assets('transforms/codeflask', import.meta.url, { js: 'items/transforms/codeflask' });
onetype.Assets('transforms/codemirror', import.meta.url, { js: 'items/transforms/codemirror' });
onetype.Assets('transforms/comparison', import.meta.url, { js: 'items/transforms/comparison' });
onetype.Assets('transforms/heatmap', import.meta.url, { js: 'items/transforms/heatmap' });
onetype.Assets('transforms/interact', import.meta.url, { js: 'items/transforms/interact' });
onetype.Assets('transforms/particles', import.meta.url, { js: 'items/transforms/particles' });
onetype.Assets('transforms/sparkline', import.meta.url, { js: 'items/transforms/sparkline' });
onetype.Assets('transforms/swiper', import.meta.url, { js: 'items/transforms/swiper' });
onetype.Assets('transforms/tabs', import.meta.url, { js: 'items/transforms/tabs' });
onetype.Assets('transforms/typed', import.meta.url, { js: 'items/transforms/typed' });

/* Elements — Sections */
onetype.Assets('elements/footer', import.meta.url, { js: 'items/elements/sections/footer', css: 'items/elements/sections/footer' });
onetype.Assets('elements/hero', import.meta.url, { js: 'items/elements/sections/hero', css: 'items/elements/sections/hero' });
onetype.Assets('elements/navbar', import.meta.url, { js: 'items/elements/sections/navbar', css: 'items/elements/sections/navbar' });
onetype.Assets('elements/stats', import.meta.url, { js: 'items/elements/sections/stats', css: 'items/elements/sections/stats' });

export default onetype;
