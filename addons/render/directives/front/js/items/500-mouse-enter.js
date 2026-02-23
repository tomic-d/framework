directives.ItemAdd({
    id: 'ot-mouse-enter',
    icon: 'mouse',
    name: 'Mouse Enter',
    description: 'Handle mouse enter events. Triggers when cursor enters element boundaries.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'ot-mouse-enter': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['ot-mouse-enter'].value;

        node.otMouseEnter = (event) =>
        {
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
    document.addEventListener('mouseover', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('otMouseEnter' in node && !node.otMouseEntered)
            {
                node.otMouseEntered = true;
                node.otMouseEnter(event);
                break;
            }

            node = node.parentNode;
        }
    });

    document.addEventListener('mouseout', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('otMouseEnter' in node && node.otMouseEntered)
            {
                node.otMouseEntered = false;
            }

            node = node.parentNode;
        }
    });
});
