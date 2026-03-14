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
            if (data['ot-input'].modifiers && data['ot-input'].modifiers.length > 0)
            {
                if (data['ot-input'].modifiers.includes('prevent'))
                {
                    event.preventDefault();
                }

                if (data['ot-input'].modifiers.includes('stop'))
                {
                    event.stopPropagation();
                }
            }

            const results = onetype.Function(attribute, compile.data, false);

            if (typeof results === 'function')
            {
                results({ event, value: event.target.value });
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
