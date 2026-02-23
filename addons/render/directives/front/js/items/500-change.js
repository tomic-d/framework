directives.ItemAdd({
    id: 'ot-change',
    icon: 'sync_alt',
    name: 'Change',
    description: 'Handle change events when form fields lose focus. Triggers after value is committed with modifiers support.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'ot-change': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['ot-change'].value;

        node.otChange = (event) =>
        {
            // Auto-apply modifiers
            if (data['ot-change'].modifiers && data['ot-change'].modifiers.length > 0)
            {
                if (data['ot-change'].modifiers.includes('prevent')) event.preventDefault();
                if (data['ot-change'].modifiers.includes('stop')) event.stopPropagation();
            }

            const results = onetype.Function(attribute, compile.data, false);

            if(typeof results === 'function')
            {
                const value = event.target.value;
                results(event, {item, compile, node, identifier, value});
            }
        }
    }
});

onetype.AddonReady('directives', function()
{
    document.addEventListener('change', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('otChange' in node)
            {
                node.otChange(event);
                break;
            }

            node = node.parentNode;
        }
    });
});
