directives.ItemAdd({
    id: 'ot-keyup',
    icon: 'keyboard_arrow_up',
    name: 'Keyup',
    description: 'Handle keyup events for keyboard interactions. Detects when keys are released.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'ot-keyup': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['ot-keyup'].value;

        node.otKeyup = (event) =>
        {
            // Auto-apply modifiers
            if (data['ot-keyup'].modifiers && data['ot-keyup'].modifiers.length > 0)
            {
                if (data['ot-keyup'].modifiers.includes('prevent')) event.preventDefault();
                if (data['ot-keyup'].modifiers.includes('stop')) event.stopPropagation();
            }

            const results = onetype.Function(attribute, compile.data, false);

            if(typeof results === 'function')
            {
                const value = event.target.value || '';
                results(event, {item, compile, node, identifier, value});
            }
        }
    }
});

onetype.AddonReady('directives', function()
{
    document.addEventListener('keyup', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('otKeyup' in node)
            {
                node.otKeyup(event);
                break;
            }

            node = node.parentNode;
        }
    });
});
