import html from '#html/addon.js';

html.Item({
    id: 'asset-favicon',
    tag: 'link',
    position: 'head',
    priority: -60,
    attributes: {
        rel: 'icon',
        href: '/favicon.png'
    }
});