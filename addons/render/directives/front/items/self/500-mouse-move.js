directives.ItemAdd({
    id: 'ot-mouse-move',
    icon: 'pan_tool',
    name: 'Mouse Move',
    description: 'Handle mouse move events. Track cursor position and movement within elements.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'ot-mouse-move': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['ot-mouse-move'].value;

        node.otMouseMove = (event) =>
        {
            if (data['ot-mouse-move'].modifiers && data['ot-mouse-move'].modifiers.length > 0)
            {
                if (data['ot-mouse-move'].modifiers.includes('prevent'))
                {
                    event.preventDefault();
                }

                if (data['ot-mouse-move'].modifiers.includes('stop'))
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
    document.addEventListener('mousemove', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('otMouseMove' in node)
            {
                node.otMouseMove(event);
                break;
            }

            node = node.parentNode;
        }
    });
});
