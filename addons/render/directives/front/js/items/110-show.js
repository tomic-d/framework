directives.ItemAdd({
    id: 'dh-show',
    icon: 'visibility',
    name: 'Show',
    description: 'Toggle element visibility with CSS display property. Hides elements when condition is false without removing from DOM.',
    category: 'control-flow',
    trigger: 'node',
    order: 110,
    attributes: {
        'dh-show': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const originalDisplay = node.style.display || '';

        if (!divhunt.Function(data['dh-show'].value, compile.data, false))
        {
            node.style.display = 'none';
        }
        else if (node.style.display === 'none')
        {
            node.style.display = originalDisplay;
        }
    }
});