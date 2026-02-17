directives.ItemAdd({
    id: 'dh-mouse-enter',
    icon: 'mouse',
    name: 'Mouse Enter',
    description: 'Handle mouse enter events. Triggers when cursor enters element boundaries.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'dh-mouse-enter': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['dh-mouse-enter'].value;

        node.dhMouseEnter = (event) =>
        {
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
    document.addEventListener('mouseover', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('dhMouseEnter' in node && !node.dhMouseEntered)
            {
                node.dhMouseEntered = true;
                node.dhMouseEnter(event);
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
            if('dhMouseEnter' in node && node.dhMouseEntered)
            {
                node.dhMouseEntered = false;
            }

            node = node.parentNode;
        }
    });
});
