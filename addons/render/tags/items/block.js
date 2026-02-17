import tags from '#tags/addon.js';

// Headings
tags.Item({
    id: 'h1',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'h2',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'h3',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'h4',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'h5',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'h6',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

// Text blocks
tags.Item({
    id: 'p',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'blockquote',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline', '@block']
    }
});

tags.Item({
    id: 'pre',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'hr',
    closeable: false,
    text: false,
    nest: {
        disallowed: ['*']
    }
});

// Generic containers
tags.Item({
    id: 'div',
    closeable: true,
    text: true,
    nest: {
        allowed: ['*']
    }
});

// Lists
tags.Item({
    id: 'ul',
    closeable: true,
    text: false,
    nest: {
        allowed: ['li']
    }
});

tags.Item({
    id: 'ol',
    closeable: true,
    text: false,
    nest: {
        allowed: ['li']
    }
});

tags.Item({
    id: 'li',
    closeable: true,
    text: true,
    nest: {
        allowed: ['*']
    }
});