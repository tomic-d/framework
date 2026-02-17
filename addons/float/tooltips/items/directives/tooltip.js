divhunt.AddonReady('directives', function(directives)
{
    document.addEventListener('mouseover', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('dhConfig' in node && !node.dhShow)
            {
                node.dhShow = true;
                node.dhItem.Set('show', true);
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
            if('dhConfig' in node && node.dhShow)
            {
                if(!node.contains(event.relatedTarget))
                {
                    node.dhShow = false;
                    node.dhItem.Set('show', false);
                }
                break;
            }

            node = node.parentNode;
        }
    });

    directives.ItemAdd({
        id: 'dh-tooltip',
        icon: 'info',
        name: 'Tooltip',
        description: 'Shows tooltip on hover.',
        trigger: 'node',
        order: 600,
        attributes: {
            'dh-tooltip': ['string|object']
        },
        code: function(data, item, compile, node)
        {
            const value = data['dh-tooltip'].value;
            let config = {};

            if(typeof value === 'string')
            {
                config.text = value;
            }
            else if(typeof value === 'object')
            {
                config = value;
            }

            config.target = node;
            config.show = false;

            const tooltips = divhunt.Addon('tooltips');

            node.dhConfig = config;
            node.dhShow = false;
            node.dhItem = tooltips.Item(config);
        }
    });
});
