divhunt.AddonReady('directives', function()
{
    document.addEventListener('click', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('dhClick' in node)
            {
                node.dhClick(event);
                break;
            }

            node = node.parentNode;
        }
    });

    directives.ItemAdd({
        id: 'dh-click',
        icon: 'touch_app',
        name: 'Click',
        description: 'Handle click events with support for prevent and stop modifiers. Executes functions on element clicks.',
        category: 'events',
        trigger: 'node',
        order: 500,
        attributes: {
            'dh-click': ['string']
        },
        code: function(data, item, compile, node, identifier)
        {
            const attribute = data['dh-click'].value;

            node.dhClick = (event) =>
            {
                // Auto-apply modifiers
                if (data['dh-click'].modifiers && data['dh-click'].modifiers.length > 0)
                {
                    if (data['dh-click'].modifiers.includes('prevent')) event.preventDefault();
                    if (data['dh-click'].modifiers.includes('stop')) event.stopPropagation();
                }

                const results = divhunt.Function(attribute, compile.data, false);

                if (typeof results === 'function')
                {
                    results(event, {item, compile, node, identifier});
                }
            }
        }
    });
});