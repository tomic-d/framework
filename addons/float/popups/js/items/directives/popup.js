divhunt.AddonReady('directives', function(directives)
{
    document.addEventListener('click', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('dhPopup' in node)
            {
                const show = node.dhItem.Get('show');
                node.dhItem.Set('show', !show);
                break;
            }

            node = node.parentNode;
        }
    });

    directives.ItemAdd({
        id: 'dh-popup',
        icon: 'smart_popup',
        name: 'Popup',
        description: 'Shows popup on click.',
        trigger: 'node',
        order: 600,
        attributes: {
            'dh-popup': ['string|object']
        },
        code: function(data, item, compile, node)
        {
            const value = data['dh-popup'].value;

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

            node.dhPopup = true;
            node.dhItem = popups.Item(config);
        }
    });
});
