directives.ItemAdd({
    id: 'dh-change',
    icon: 'sync_alt',
    name: 'Change',
    description: 'Handle change events when form fields lose focus. Triggers after value is committed with modifiers support.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'dh-change': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['dh-change'].value;

        node.dhChange = (event) =>
        {
            // Auto-apply modifiers
            if (data['dh-change'].modifiers && data['dh-change'].modifiers.length > 0)
            {
                if (data['dh-change'].modifiers.includes('prevent')) event.preventDefault();
                if (data['dh-change'].modifiers.includes('stop')) event.stopPropagation();
            }

            const results = divhunt.Function(attribute, compile.data, false);

            if(typeof results === 'function')
            {
                const value = event.target.value;
                results(event, {item, compile, node, identifier, value});
            }
        }
    }
});

divhunt.AddonReady('directives', function()
{
    document.addEventListener('change', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('dhChange' in node)
            {
                node.dhChange(event);
                break;
            }

            node = node.parentNode;
        }
    });
});
