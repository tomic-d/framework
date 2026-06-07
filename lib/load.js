import OneType from './src/onetype.js';

const onetype = new OneType();

/* Framework */
onetype.Assets('framework', import.meta.url, { js: { path: '.', exclude: ['load.js', 'styles', 'boot'] } });
onetype.Assets('boot', import.meta.url, { js: 'boot' });
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
onetype.Assets('settings', import.meta.url, { js: '../addons/modules/settings/front' });

/* Render */
onetype.Assets('directives', import.meta.url, { js: { path: '../addons/render/directives/front', exclude: ['../addons/render/directives/front/items/self'] } });
onetype.Assets('directives/items', import.meta.url, { js: '../addons/render/directives/front/items/self' });
onetype.Assets('transforms', import.meta.url, { js: { path: '../addons/render/transforms/js', exclude: ['../addons/render/transforms/js/items/self'] }, css: '../addons/render/transforms/css' });
onetype.Assets('transforms/items', import.meta.url, { js: '../addons/render/transforms/js/items/self' });
onetype.Assets('pages', import.meta.url, { js: '../addons/render/pages', css: '../addons/render/pages/front' });
onetype.Assets('elements', import.meta.url, { js: { path: '../addons/render/elements/front', exclude: ['../addons/render/elements/front/items/self'] }, css: { path: '../addons/render/elements/front', exclude: ['../addons/render/elements/front/items/self'] } });
onetype.Assets('elements/items', import.meta.url, { js: '../addons/render/elements/front/items/self', css: '../addons/render/elements/front/items/self' });
onetype.Assets('editor', import.meta.url, { js: '../addons/render/editor', css: '../addons/render/editor' });

/* Float */
onetype.Assets('float', import.meta.url, { js: '../addons/float', css: '../addons/float' });

/* AI */
onetype.Assets('ai', import.meta.url, { js: '../addons/ai', css: '../addons/ai' });

/* Services */
onetype.Assets('cloudflare/images', import.meta.url, { js: '../addons/services/cloudflare/images/front', css: '../addons/services/cloudflare/images/front' });

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
