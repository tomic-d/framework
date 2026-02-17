directives.ItemAdd({
    id: 'dh-focus',
    icon: 'center_focus_strong',
    name: 'Focus',
    description: 'Handle focus events when elements receive focus. Enables focus-based interactions and accessibility features.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'dh-focus': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['dh-focus'].value;

        node.dhFocus = (event) =>
        {
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
    document.addEventListener('focus', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('dhFocus' in node)
            {
                node.dhFocus(event);
                break;
            }

            node = node.parentNode;
        }
    }, true);
});
