import OneType from './src/onetype.js';

const onetype = new OneType();

/* Framework */
onetype.Assets('framework', import.meta.url, { js: { path: '.', exclude: ['load.js', 'items', 'styles'] } });
onetype.Assets('styles', import.meta.url, { css: 'styles' });

/* Core */
onetype.Assets('commands', import.meta.url, { js: { path: '../addons/core/commands', exclude: ['../addons/core/commands/back'] } });
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
onetype.Assets('directives/items', import.meta.url, { js: 'items/directives' });
onetype.Assets('transforms', import.meta.url, { js: '../addons/render/transforms' });
onetype.Assets('pages', import.meta.url, { js: '../addons/render/pages', css: '../addons/render/pages/front' });
onetype.Assets('elements', import.meta.url, { js: '../addons/render/elements/front', css: '../addons/render/elements/front' });

/* Float */
onetype.Assets('float', import.meta.url, { js: '../addons/float', css: '../addons/float' });

/* Elements — Form */
onetype.Assets('elements/form/button', import.meta.url, { js: 'items/elements/form/button', css: 'items/elements/form/button' });
onetype.Assets('elements/form/checkbox', import.meta.url, { js: 'items/elements/form/checkbox', css: 'items/elements/form/checkbox' });
onetype.Assets('elements/form/color', import.meta.url, { js: 'items/elements/form/color', css: 'items/elements/form/color' });
onetype.Assets('elements/form/date', import.meta.url, { js: 'items/elements/form/date', css: 'items/elements/form/date' });
onetype.Assets('elements/form/field', import.meta.url, { js: 'items/elements/form/field', css: 'items/elements/form/field' });
onetype.Assets('elements/form/input', import.meta.url, { js: 'items/elements/form/input', css: 'items/elements/form/input' });
onetype.Assets('elements/form/radio', import.meta.url, { js: 'items/elements/form/radio', css: 'items/elements/form/radio' });
onetype.Assets('elements/form/rating', import.meta.url, { js: 'items/elements/form/rating', css: 'items/elements/form/rating' });
onetype.Assets('elements/form/section', import.meta.url, { js: 'items/elements/form/section', css: 'items/elements/form/section' });
onetype.Assets('elements/form/select', import.meta.url, { js: 'items/elements/form/select', css: 'items/elements/form/select' });
onetype.Assets('elements/form/slider', import.meta.url, { js: 'items/elements/form/slider', css: 'items/elements/form/slider' });
onetype.Assets('elements/form/tags', import.meta.url, { js: 'items/elements/form/tags', css: 'items/elements/form/tags' });
onetype.Assets('elements/form/textarea', import.meta.url, { js: 'items/elements/form/textarea', css: 'items/elements/form/textarea' });
onetype.Assets('elements/form/toggle', import.meta.url, { js: 'items/elements/form/toggle', css: 'items/elements/form/toggle' });

/* Elements — Global */
onetype.Assets('elements/global/code', import.meta.url, { js: 'items/elements/global/code', css: 'items/elements/global/code' });
onetype.Assets('elements/global/faq', import.meta.url, { js: 'items/elements/global/faq', css: 'items/elements/global/faq' });
onetype.Assets('elements/global/heading', import.meta.url, { js: 'items/elements/global/heading', css: 'items/elements/global/heading' });
onetype.Assets('elements/global/markdown', import.meta.url, { js: 'items/elements/global/markdown', css: 'items/elements/global/markdown' });
onetype.Assets('elements/global/menu', import.meta.url, { js: 'items/elements/global/menu', css: 'items/elements/global/menu' });
onetype.Assets('elements/global/notice', import.meta.url, { js: 'items/elements/global/notice', css: 'items/elements/global/notice' });
onetype.Assets('elements/global/parameters', import.meta.url, { js: 'items/elements/global/parameters', css: 'items/elements/global/parameters' });
onetype.Assets('elements/global/tags', import.meta.url, { js: 'items/elements/global/tags', css: 'items/elements/global/tags' });

/* Elements — Cards */
onetype.Assets('elements/cards/pricing', import.meta.url, { js: 'items/elements/cards/pricing', css: 'items/elements/cards/pricing' });

/* Elements — Navigation */
onetype.Assets('elements/navigation/navbar', import.meta.url, { js: 'items/elements/navigation/navbar', css: 'items/elements/navigation/navbar' });
onetype.Assets('elements/navigation/sidebar', import.meta.url, { js: 'items/elements/navigation/sidebar', css: 'items/elements/navigation/sidebar' });
onetype.Assets('elements/navigation/tabs', import.meta.url, { js: 'items/elements/navigation/tabs', css: 'items/elements/navigation/tabs' });

/* Elements — Status */
onetype.Assets('elements/status/loading', import.meta.url, { js: 'items/elements/status/loading', css: 'items/elements/status/loading' });
onetype.Assets('elements/status/empty', import.meta.url, { js: 'items/elements/status/empty', css: 'items/elements/status/empty' });
onetype.Assets('elements/status/error', import.meta.url, { js: 'items/elements/status/error', css: 'items/elements/status/error' });
onetype.Assets('elements/status/code', import.meta.url, { js: 'items/elements/status/code', css: 'items/elements/status/code' });

global.$ot = onetype.$ot;

process.on('SIGINT', async () =>
{
    await onetype.Middleware('sigint');
    await onetype.Middleware('shutdown');

    process.exit(0);
});

process.on('SIGTERM', async () =>
{
    await onetype.Middleware('sigterm');
    await onetype.Middleware('shutdown');

    process.exit(0);
});

process.on('uncaughtException', async (error) =>
{
    console.error('Uncaught Exception:', error);

    await onetype.Middleware('uncaughtException', { error });
    await onetype.Middleware('shutdown');

    process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) =>
{
    console.error('Unhandled Rejection:', reason);

    await onetype.Middleware('unhandledRejection', { reason, promise });
    await onetype.Middleware('shutdown');

    process.exit(1);
});

export default onetype;
