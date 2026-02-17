directives.ItemAdd({
    id: 'dh-keyup',
    icon: 'keyboard_arrow_up',
    name: 'Keyup',
    description: 'Handle keyup events for keyboard interactions. Detects when keys are released.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'dh-keyup': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['dh-keyup'].value;

        node.dhKeyup = (event) =>
        {
            // Auto-apply modifiers
            if (data['dh-keyup'].modifiers && data['dh-keyup'].modifiers.length > 0)
            {
                if (data['dh-keyup'].modifiers.includes('prevent')) event.preventDefault();
                if (data['dh-keyup'].modifiers.includes('stop')) event.stopPropagation();
            }

            const results = divhunt.Function(attribute, compile.data, false);

            if(typeof results === 'function')
            {
                const value = event.target.value || '';
                results(event, {item, compile, node, identifier, value});
            }
        }
    }
});

divhunt.AddonReady('directives', function()
{
    document.addEventListener('keyup', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('dhKeyup' in node)
            {
                node.dhKeyup(event);
                break;
            }

            node = node.parentNode;
        }
    });
});
