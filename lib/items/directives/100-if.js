directives.ItemAdd({
    id: 'ot-if',
    icon: 'rule',
    name: 'If',
    description: 'Conditionally render elements based on expressions. Removes elements from DOM when condition is false.',
    category: 'control-flow',
    trigger: 'node',
    order: 100,
    strict: false,
    attributes: {
        'ot-if': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const expression = data['ot-if'].value;
        const result = onetype.Function(expression, compile.data, false);

        if (!result)
        {
            const placeholder = document.createComment('ot-if:' + identifier);
            node.replaceWith(placeholder);
            return false;
        }
    }
});