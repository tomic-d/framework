directives.ItemAdd({
    id: 'dh-scroll',
    icon: 'unfold_more',
    name: 'Scroll',
    description: 'Handle scroll events on elements or window. Track scroll position for infinite loading and animations.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'dh-scroll': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['dh-scroll'].value;

        node.dhScroll = (event) =>
        {
            const results = divhunt.Function(attribute, compile.data, false);

            if(typeof results === 'function')
            {
                results(event, {item, compile, node, identifier});
            }
        }
    }
});

divhunt.AddonReady('directives', function()
{
    document.addEventListener('scroll', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('dhScroll' in node)
            {
                node.dhScroll(event);
                break;
            }

            node = node.parentNode;
        }
    }, true);
});
