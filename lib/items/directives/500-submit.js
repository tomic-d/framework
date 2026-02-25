directives.ItemAdd({
    id: 'ot-submit',
    icon: 'send',
    name: 'Submit',
    description: 'Handle form submission events. Prevents default behavior and executes custom submit logic.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'ot-submit': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['ot-submit'];

        node.otSubmit = (event) =>
        {
            // Auto-apply modifiers
            if (data.modifiers)
            {
                if (data.modifiers.prevent) event.preventDefault();
                if (data.modifiers.stop) event.stopPropagation();
            }

            const results = onetype.Function(attribute, compile.data, false);

            if(typeof results === 'function')
            {
                results(event, {item, compile, node, identifier});
            }
        }
    }
});

onetype.AddonReady('directives', function()
{
    document.addEventListener('submit', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('otSubmit' in node)
            {
                node.otSubmit(event);
                break;
            }

            node = node.parentNode;
        }
    });
});
