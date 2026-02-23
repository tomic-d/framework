directives.ItemAdd({
    id: 'ot-mouse-leave',
    icon: 'logout',
    name: 'Mouse Leave',
    description: 'Handle mouse leave events. Triggers when cursor exits element boundaries.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'ot-mouse-leave': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['ot-mouse-leave'].value;

        node.otMouseLeave = (event) =>
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
    document.addEventListener('mouseout', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('otMouseLeave' in node && !node.otMouseLeft)
            {
                node.otMouseLeft = true;
                node.otMouseLeave(event);
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
            if('otMouseLeave' in node && node.otMouseLeft)
            {
                node.otMouseLeft = false;
            }

            node = node.parentNode;
        }
    });
});
