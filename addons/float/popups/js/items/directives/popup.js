onetype.AddonReady('directives', function(directives)
{
    document.addEventListener('click', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('otPopup' in node)
            {
                const show = node.otItem.Get('show');
                node.otItem.Set('show', !show);
                break;
            }

            node = node.parentNode;
        }
    });

    directives.ItemAdd({
        id: 'ot-popup',
        icon: 'smart_popup',
        name: 'Popup',
        description: 'Shows popup on click.',
        trigger: 'node',
        order: 600,
        attributes: {
            'ot-popup': ['string|object']
        },
        code: function(data, item, compile, node)
        {
            const value = data['ot-popup'].value;

            let config = {};

            if(typeof value === 'string')
            {
                config.content = value;
            }
            else if(typeof value === 'object')
            {
                config = value;
            }

            if(!('target' in config))
            {
                config.target = node;
            }

            node.otPopup = true;
            node.otItem = popups.Item(config);
        }
    });
});
