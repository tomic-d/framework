import html from '#html/addon.js';

html.Item({
    id: 'font-preconnect-api',
    tag: 'link',
    position: 'head',
    priority: -50,
    attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com'
    }
});

html.Item({
    id: 'font-preconnect-static',
    tag: 'link',
    position: 'head',
    priority: -49,
    attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: null
    }
});