import tags from '#tags/addon.js';

// Basic text formatting
tags.Item({
    id: 'span',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'strong',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'em',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'b',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'i',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'u',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 's',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'small',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'mark',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'del',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'ins',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

// Code and technical
tags.Item({
    id: 'code',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'kbd',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'var',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

// Semantic text
tags.Item({
    id: 'abbr',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'cite',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'dfn',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'q',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'time',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

// Subscript and superscript
tags.Item({
    id: 'sub',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'sup',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

// Links
tags.Item({
    id: 'a',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline'],
        disallowed: ['a', '@form']
    }
});

// Line breaks (void elements)
tags.Item({
    id: 'br',
    closeable: false,
    text: false,
    nest: {
        disallowed: ['*']
    }
});