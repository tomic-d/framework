onetype.AddonReady('directives', function(directives)
{
    document.addEventListener('mouseover', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('otConfig' in node && !node.otShow)
            {
                node.otShow = true;
                node.otItem.Set('show', true);
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
            if('otConfig' in node && node.otShow)
            {
                if(!node.contains(event.relatedTarget))
                {
                    node.otShow = false;
                    node.otItem.Set('show', false);
                }
                break;
            }

            node = node.parentNode;
        }
    });

    directives.ItemAdd({
        id: 'ot-tooltip',
        icon: 'info',
        name: 'Tooltip',
        description: 'Shows tooltip on hover.',
        trigger: 'node',
        order: 600,
        attributes: {
            'ot-tooltip': ['string|object']
        },
        code: function(data, item, compile, node)
        {
            const value = data['ot-tooltip'].value;
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

            const tooltips = onetype.Addon('tooltips');

            node.otConfig = config;
            node.otShow = false;
            node.otItem = tooltips.Item(config);
        }
    });
});
