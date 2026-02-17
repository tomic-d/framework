import html from '#html/addon.js';

html.Item({
    id: 'meta-description',
    tag: 'meta',
    position: 'head',
    priority: -70,
    attributes: {
        name: 'description',
        content: 'Modern web application built with Divhunt'
    }
});