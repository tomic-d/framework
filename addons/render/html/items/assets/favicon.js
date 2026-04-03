import html from '#html/addon.js';

html.Item({
    id: 'asset-favicon',
    tag: 'link',
    position: 'head',
    priority: -60,
    attributes: {
        rel: 'icon',
        href: 'https://images.onetype.ai/96752e47-1bea-4313-025c-5b76dc174200/public'
    }
});