directives.ItemAdd({
    id: 'dh-submit',
    icon: 'send',
    name: 'Submit',
    description: 'Handle form submission events. Prevents default behavior and executes custom submit logic.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'dh-submit': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['dh-submit'];

        node.dhSubmit = (event) =>
        {
            // Auto-apply modifiers
            if (data.modifiers)
            {
                if (data.modifiers.prevent) event.preventDefault();
                if (data.modifiers.stop) event.stopPropagation();
            }

            const results = divhunt.Function(attribute, compile.data, false);

            if(typeof results === 'function')
            {
                results(event, {item, compile, node, identifier});
            }
        }
    }
});

divhunt.AddonReady('directives', function()
{
    document.addEventListener('submit', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('dhSubmit' in node)
            {
                node.dhSubmit(event);
                break;
            }

            node = node.parentNode;
        }
    });
});
