directives.ItemAdd({
    id: 'ot-focus',
    icon: 'center_focus_strong',
    name: 'Focus',
    description: 'Handle focus events when elements receive focus. Enables focus-based interactions and accessibility features.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'ot-focus': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['ot-focus'].value;

        node.otFocus = (event) =>
        {
            if (data['ot-focus'].modifiers && data['ot-focus'].modifiers.length > 0)
            {
                if (data['ot-focus'].modifiers.includes('prevent'))
                {
                    event.preventDefault();
                }

                if (data['ot-focus'].modifiers.includes('stop'))
                {
                    event.stopPropagation();
                }
            }

            const results = onetype.Function(attribute, compile.data, false);

            if(typeof results === 'function')
            {
                results({ event, value: event.target.value || '' });
            }
        }
    }
});

onetype.AddonReady('directives', function()
{
    document.addEventListener('focus', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('otFocus' in node)
            {
                node.otFocus(event);
                break;
            }

            node = node.parentNode;
        }
    }, true);
});
