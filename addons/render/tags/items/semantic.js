import tags from '#tags/addon.js';

// Document structure
tags.Item({
    id: 'main',
    closeable: true,
    text: true,
    nest: {
        allowed: ['*'],
        disallowed: ['main']
    }
});

tags.Item({
    id: 'header',
    closeable: true,
    text: true,
    nest: {
        allowed: ['*'],
        disallowed: ['header', 'footer']
    }
});

tags.Item({
    id: 'footer',
    closeable: true,
    text: true,
    nest: {
        allowed: ['*'],
        disallowed: ['header', 'footer']
    }
});

tags.Item({
    id: 'nav',
    closeable: true,
    text: true,
    nest: {
        allowed: ['*']
    }
});

tags.Item({
    id: 'section',
    closeable: true,
    text: true,
    nest: {
        allowed: ['*']
    }
});

tags.Item({
    id: 'article',
    closeable: true,
    text: true,
    nest: {
        allowed: ['*']
    }
});

tags.Item({
    id: 'aside',
    closeable: true,
    text: true,
    nest: {
        allowed: ['*']
    }
});

// Content grouping
tags.Item({
    id: 'figure',
    closeable: true,
    text: true,
    nest: {
        allowed: ['*']
    }
});

tags.Item({
    id: 'figcaption',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'details',
    closeable: true,
    text: true,
    nest: {
        allowed: ['*']
    }
});

tags.Item({
    id: 'summary',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'dialog',
    closeable: true,
    text: true,
    nest: {
        allowed: ['*']
    }
});