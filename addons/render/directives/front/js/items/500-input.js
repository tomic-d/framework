directives.ItemAdd({
    id: 'dh-input',
    icon: 'keyboard',
    name: 'Input',
    description: 'Handle input events for real-time form field updates. Captures value changes as user types.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'dh-input': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['dh-input'].value;

        node.dhInput = (event) =>
        {
            const results = divhunt.Function(attribute, compile.data, false);

            if (typeof results === 'function')
            {
                const value = event.target.value;
                results(event, {item, compile, node, identifier, value});
            }
        }
    }
});

divhunt.AddonReady('directives', function()
{
    document.addEventListener('input', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('dhInput' in node)
            {
                node.dhInput(event);
                break;
            }

            node = node.parentNode;
        }
    });
});
