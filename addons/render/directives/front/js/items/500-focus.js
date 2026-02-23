directives.ItemAdd({
    id: 'ot-focus',
    icon: 'center_focus_strong',
    name: 'Focus',
    description: 'Handle focus events when elements receive focus. Enables focus-based interactions and accessibility features.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'ot-focus': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['ot-focus'].value;

        node.otFocus = (event) =>
        {
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
    document.addEventListener('focus', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('otFocus' in node)
            {
                node.otFocus(event);
                break;
            }

            node = node.parentNode;
        }
    }, true);
});
