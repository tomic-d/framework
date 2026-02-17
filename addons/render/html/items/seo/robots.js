import html from '#html/addon.js';

html.Item({
    id: 'seo-robots',
    tag: 'meta',
    position: 'head',
    priority: -30,
    attributes: {
        name: 'robots',
        content: 'index, follow'
    }
});
