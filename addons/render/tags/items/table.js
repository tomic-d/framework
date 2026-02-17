import tags from '#tags/addon.js';

tags.Item({
    id: 'table',
    closeable: true,
    text: false,
    nest: {
        allowed: ['caption', 'colgroup', 'thead', 'tbody', 'tfoot', 'tr']
    }
});

tags.Item({
    id: 'caption',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'colgroup',
    closeable: true,
    text: false,
    nest: {
        allowed: ['col']
    }
});

tags.Item({
    id: 'col',
    closeable: false,
    text: false,
    nest: {
        disallowed: ['*']
    }
});

tags.Item({
    id: 'thead',
    closeable: true,
    text: false,
    nest: {
        allowed: ['tr']
    }
});

tags.Item({
    id: 'tbody',
    closeable: true,
    text: false,
    nest: {
        allowed: ['tr']
    }
});

tags.Item({
    id: 'tfoot',
    closeable: true,
    text: false,
    nest: {
        allowed: ['tr']
    }
});

tags.Item({
    id: 'tr',
    closeable: true,
    text: false,
    nest: {
        allowed: ['th', 'td']
    }
});

tags.Item({
    id: 'th',
    closeable: true,
    text: true,
    nest: {
        allowed: ['*'],
        disallowed: ['@form']
    }
});

tags.Item({
    id: 'td',
    closeable: true,
    text: true,
    nest: {
        allowed: ['*']
    }
});