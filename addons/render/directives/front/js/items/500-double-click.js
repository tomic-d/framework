directives.ItemAdd({
    id: 'dh-double-click',
    icon: 'ads_click',
    name: 'Double Click',
    description: 'Handle double-click events on elements. Enables advanced click interactions.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'dh-double-click': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['dh-double-click'].value;

        node.dhDoubleClick = (event) =>
        {
            // Auto-apply modifiers
            if (data['dh-double-click'].modifiers && data['dh-double-click'].modifiers.length > 0)
            {
                if (data['dh-double-click'].modifiers.includes('prevent')) event.preventDefault();
                if (data['dh-double-click'].modifiers.includes('stop')) event.stopPropagation();
            }

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
    document.addEventListener('dblclick', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('dhDoubleClick' in node)
            {
                node.dhDoubleClick(event);
                break;
            }

            node = node.parentNode;
        }
    });
});
