import tags from '#tags/addon.js';

tags.Item({
    id: 'form',
    closeable: true,
    text: true,
    nest: {
        allowed: ['*'],
        disallowed: ['form']
    }
});

tags.Item({
    id: 'fieldset',
    closeable: true,
    text: true,
    nest: {
        allowed: ['*']
    }
});

tags.Item({
    id: 'legend',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});

tags.Item({
    id: 'label',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline', '@form'],
        disallowed: ['label']
    }
});

tags.Item({
    id: 'input',
    closeable: false,
    text: false,
    nest: {
        disallowed: ['*']
    }
});

tags.Item({
    id: 'textarea',
    closeable: true,
    text: true,
    nest: {
        disallowed: ['*']
    }
});

tags.Item({
    id: 'select',
    closeable: true,
    text: false,
    nest: {
        allowed: ['option', 'optgroup']
    }
});

tags.Item({
    id: 'option',
    closeable: true,
    text: true,
    nest: {
        disallowed: ['*']
    }
});

tags.Item({
    id: 'optgroup',
    closeable: true,
    text: false,
    nest: {
        allowed: ['option']
    }
});

tags.Item({
    id: 'datalist',
    closeable: true,
    text: false,
    nest: {
        allowed: ['option']
    }
});

tags.Item({
    id: 'button',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline'],
        disallowed: ['@form']
    }
});

tags.Item({
    id: 'output',
    closeable: true,
    text: true,
    nest: {
        allowed: ['@text-inline']
    }
});