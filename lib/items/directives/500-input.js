directives.ItemAdd({
    id: 'ot-input',
    icon: 'keyboard',
    name: 'Input',
    description: 'Handle input events for real-time form field updates. Captures value changes as user types.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'ot-input': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['ot-input'].value;

        node.otInput = (event) =>
        {
            const results = onetype.Function(attribute, compile.data, false);

            if (typeof results === 'function')
            {
                const value = event.target.value;
                results(event, {item, compile, node, identifier, value});
            }
        }
    }
});

onetype.AddonReady('directives', function()
{
    document.addEventListener('input', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('otInput' in node)
            {
                node.otInput(event);
                break;
            }

            node = node.parentNode;
        }
    });
});
