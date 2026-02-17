import tags from '#tags/addon.js';

tags.Item({
    id: 'img',
    closeable: false,
    text: false,
    nest: {
        disallowed: ['*']
    }
});

tags.Item({
    id: 'video',
    closeable: true,
    text: true,
    nest: {
        allowed: ['source', 'track']
    }
});

tags.Item({
    id: 'audio',
    closeable: true,
    text: true,
    nest: {
        allowed: ['source', 'track']
    }
});

tags.Item({
    id: 'source',
    closeable: false,
    text: false,
    nest: {
        disallowed: ['*']
    }
});

tags.Item({
    id: 'track',
    closeable: false,
    text: false,
    nest: {
        disallowed: ['*']
    }
});

tags.Item({
    id: 'embed',
    closeable: false,
    text: false,
    nest: {
        disallowed: ['*']
    }
});

tags.Item({
    id: 'iframe',
    closeable: true,
    text: true,
    nest: {
        disallowed: ['*']
    }
});