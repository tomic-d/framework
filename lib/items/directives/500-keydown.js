directives.ItemAdd({
    id: 'ot-keydown',
    icon: 'keyboard_arrow_down',
    name: 'Keydown',
    description: 'Handle keydown events for keyboard shortcuts. Captures keys as they are pressed down.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'ot-keydown': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['ot-keydown'].value;

        node.otKeydown = (event) =>
        {
            // Auto-apply modifiers
            if (data['ot-keydown'].modifiers && data['ot-keydown'].modifiers.length > 0)
            {
                if (data['ot-keydown'].modifiers.includes('prevent')) event.preventDefault();
                if (data['ot-keydown'].modifiers.includes('stop')) event.stopPropagation();
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
    document.addEventListener('keydown', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('otKeydown' in node)
            {
                node.otKeydown(event);
                break;
            }

            node = node.parentNode;
        }
    });
});
