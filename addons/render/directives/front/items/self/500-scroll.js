directives.ItemAdd({
    id: 'ot-scroll',
    icon: 'unfold_more',
    name: 'Scroll',
    description: 'Handle scroll events on elements or window. Track scroll position for infinite loading and animations.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'ot-scroll': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['ot-scroll'].value;

        node.otScroll = (event) =>
        {
            if (data['ot-scroll'].modifiers && data['ot-scroll'].modifiers.length > 0)
            {
                if (data['ot-scroll'].modifiers.includes('prevent'))
                {
                    event.preventDefault();
                }

                if (data['ot-scroll'].modifiers.includes('stop'))
                {
                    event.stopPropagation();
                }
            }

            const results = onetype.Function(attribute, compile.data, false);

            if(typeof results === 'function')
            {
                results({ event });
            }
        }
    }
});

onetype.AddonReady('directives', function()
{
    document.addEventListener('scroll', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('otScroll' in node)
            {
                node.otScroll(event);
                break;
            }

            node = node.parentNode;
        }
    }, true);
});
