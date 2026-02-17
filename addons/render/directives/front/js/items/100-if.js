directives.ItemAdd({
    id: 'dh-if',
    icon: 'rule',
    name: 'If',
    description: 'Conditionally render elements based on expressions. Removes elements from DOM when condition is false.',
    category: 'control-flow',
    trigger: 'node',
    order: 100,
    strict: false,
    attributes: {
        'dh-if': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const expression = data['dh-if'].value;
        const result = divhunt.Function(expression, compile.data, false);

        if (!result)
        {
            node.remove();
            return false;
        }
    }
});