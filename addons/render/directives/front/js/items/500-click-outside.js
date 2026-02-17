directives.ItemAdd({
    id: 'dh-click-outside',
    icon: 'close_fullscreen',
    name: 'Click Outside',
    description: 'Detect clicks outside the element. Perfect for closing dropdowns and modals.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'dh-click-outside': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['dh-click-outside'].value;

        const handler = (event) =>
        {
            const results = divhunt.Function(attribute, compile.data, false);

            if(typeof results === 'function')
            {
                results(event, {item, compile, node, identifier});
            }
        };

        handlers.add({element: node, handler});
    }
});

divhunt.AddonReady('directives', function()
{
    const handlers = new Set();

    document.addEventListener('click', function(event)
    {
        handlers.forEach(({element, handler}) =>
        {
            if(!document.contains(element))
            {
                handlers.delete({element, handler});
                return;
            }

            if(!element.contains(event.target) && element !== event.target)
            {
                handler(event);
            }
        });
    });
});
