directives.ItemAdd({
    id: 'dh-mouse-move',
    icon: 'pan_tool',
    name: 'Mouse Move',
    description: 'Handle mouse move events. Track cursor position and movement within elements.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'dh-mouse-move': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['dh-mouse-move'].value;

        node.dhMouseMove = (event) =>
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
    document.addEventListener('mousemove', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('dhMouseMove' in node)
            {
                node.dhMouseMove(event);
                break;
            }

            node = node.parentNode;
        }
    });
});
