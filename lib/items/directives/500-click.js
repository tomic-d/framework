onetype.AddonReady('directives', function()
{
    document.addEventListener('click', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('otClick' in node)
            {
                node.otClick(event);
                break;
            }

            node = node.parentNode;
        }
    });

    directives.ItemAdd({
        id: 'ot-click',
        icon: 'touch_app',
        name: 'Click',
        description: 'Handle click events with support for prevent and stop modifiers. Executes functions on element clicks.',
        category: 'events',
        trigger: 'node',
        order: 500,
        attributes: {
            'ot-click': ['string']
        },
        code: function(data, item, compile, node, identifier)
        {
            const attribute = data['ot-click'].value;

            node.otClick = (event) =>
            {
                // Auto-apply modifiers
                if (data['ot-click'].modifiers && data['ot-click'].modifiers.length > 0)
                {
                    if (data['ot-click'].modifiers.includes('prevent')) event.preventDefault();
                    if (data['ot-click'].modifiers.includes('stop')) event.stopPropagation();
                }

                const results = onetype.Function(attribute, compile.data, false);

                if (typeof results === 'function')
                {
                    results(event, {item, compile, node, identifier});
                }
            }
        }
    });
});