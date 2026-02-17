directives.ItemAdd({
    id: 'dh-mouse-leave',
    icon: 'logout',
    name: 'Mouse Leave',
    description: 'Handle mouse leave events. Triggers when cursor exits element boundaries.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'dh-mouse-leave': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['dh-mouse-leave'].value;

        node.dhMouseLeave = (event) =>
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
    document.addEventListener('mouseout', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('dhMouseLeave' in node && !node.dhMouseLeft)
            {
                node.dhMouseLeft = true;
                node.dhMouseLeave(event);
                break;
            }

            node = node.parentNode;
        }
    });

    document.addEventListener('mouseover', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('dhMouseLeave' in node && node.dhMouseLeft)
            {
                node.dhMouseLeft = false;
            }

            node = node.parentNode;
        }
    });
});
