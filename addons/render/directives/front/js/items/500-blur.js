directives.ItemAdd({
    id: 'dh-blur',
    icon: 'visibility_off',
    name: 'Blur',
    description: 'Handle blur events when elements lose focus. Useful for form validation and input state management.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'dh-blur': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['dh-blur'].value;

        node.dhBlur = (event) =>
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
    document.addEventListener('blur', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('dhBlur' in node)
            {
                node.dhBlur(event);
                break;
            }

            node = node.parentNode;
        }
    }, true);
});
