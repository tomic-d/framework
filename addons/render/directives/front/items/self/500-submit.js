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
        const attribute = data['ot-submit'].value;

        node.otSubmit = (event) =>
        {
            if (data['ot-submit'].modifiers && data['ot-submit'].modifiers.length > 0)
            {
                if (data['ot-submit'].modifiers.includes('prevent'))
                {
                    event.preventDefault();
                }

                if (data['ot-submit'].modifiers.includes('stop'))
                {
                    event.stopPropagation();
                }
            }

            const results = onetype.Function(attribute, compile.data, false);

            if(typeof results === 'function')
            {
                results({ event });
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
