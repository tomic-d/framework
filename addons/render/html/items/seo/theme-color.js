import html from '#html/addon.js';

html.Item({
    id: 'seo-theme-color',
    tag: 'meta',
    position: 'head',
    priority: -20,
    attributes: {
        name: 'theme-color',
        content: '#000000'
    }
});