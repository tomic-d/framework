directives.ItemAdd({
    id: 'ot-show',
    icon: 'visibility',
    name: 'Show',
    description: 'Toggle element visibility with CSS display property. Hides elements when condition is false without removing from DOM.',
    category: 'control-flow',
    trigger: 'node',
    order: 110,
    attributes: {
        'ot-show': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const originalDisplay = node.style.display || '';

        if (!onetype.Function(data['ot-show'].value, compile.data, false))
        {
            node.style.display = 'none';
        }
        else if (node.style.display === 'none')
        {
            node.style.display = originalDisplay;
        }
    }
});