directives.ItemAdd({
    id: 'ot-double-click',
    icon: 'ads_click',
    name: 'Double Click',
    description: 'Handle double-click events on elements. Enables advanced click interactions.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'ot-double-click': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['ot-double-click'].value;

        node.otDoubleClick = (event) =>
        {
            // Auto-apply modifiers
            if (data['ot-double-click'].modifiers && data['ot-double-click'].modifiers.length > 0)
            {
                if (data['ot-double-click'].modifiers.includes('prevent')) event.preventDefault();
                if (data['ot-double-click'].modifiers.includes('stop')) event.stopPropagation();
            }

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
    document.addEventListener('dblclick', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('otDoubleClick' in node)
            {
                node.otDoubleClick(event);
                break;
            }

            node = node.parentNode;
        }
    });
});
