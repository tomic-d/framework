directives.ItemAdd({
    id: 'dh-keydown',
    icon: 'keyboard_arrow_down',
    name: 'Keydown',
    description: 'Handle keydown events for keyboard shortcuts. Captures keys as they are pressed down.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'dh-keydown': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['dh-keydown'].value;

        node.dhKeydown = (event) =>
        {
            // Auto-apply modifiers
            if (data['dh-keydown'].modifiers && data['dh-keydown'].modifiers.length > 0)
            {
                if (data['dh-keydown'].modifiers.includes('prevent')) event.preventDefault();
                if (data['dh-keydown'].modifiers.includes('stop')) event.stopPropagation();
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
    document.addEventListener('keydown', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('dhKeydown' in node)
            {
                node.dhKeydown(event);
                break;
            }

            node = node.parentNode;
        }
    });
});
