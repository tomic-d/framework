import html from '#html/addon.js';

html.Item({
    id: 'meta-viewport',
    tag: 'meta',
    position: 'head',
    priority: -90,
    attributes: {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0'
    }
});