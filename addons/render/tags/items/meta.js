import tags from '#tags/addon.js';

tags.Item({
    id: 'meta',
    closeable: false,
    text: false,
    nest: {
        disallowed: ['*']
    }
});

tags.Item({
    id: 'link',
    closeable: false,
    text: false,
    nest: {
        disallowed: ['*']
    }
});

tags.Item({
    id: 'script',
    closeable: true,
    text: true,
    nest: {
        disallowed: ['*']
    }
});