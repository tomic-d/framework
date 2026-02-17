import html from '#html/addon.js';

html.Item({
    id: 'meta-charset',
    tag: 'meta',
    position: 'head',
    priority: -100,
    attributes: {
        charset: 'UTF-8'
    }
});