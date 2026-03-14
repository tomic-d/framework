directives.ItemAdd({
    id: 'ot-blur',
    icon: 'visibility_off',
    name: 'Blur',
    description: 'Handle blur events when elements lose focus. Useful for form validation and input state management.',
    category: 'events',
    trigger: 'node',
    order: 500,
    attributes: {
        'ot-blur': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const attribute = data['ot-blur'].value;

        node.otBlur = (event) =>
        {
            if (data['ot-blur'].modifiers && data['ot-blur'].modifiers.length > 0)
            {
                if (data['ot-blur'].modifiers.includes('prevent'))
                {
                    event.preventDefault();
                }

                if (data['ot-blur'].modifiers.includes('stop'))
                {
                    event.stopPropagation();
                }
            }

            const results = onetype.Function(attribute, compile.data, false);

            if(typeof results === 'function')
            {
                results({ event, value: event.target.value || '' });
            }
        }
    }
});

onetype.AddonReady('directives', function()
{
    document.addEventListener('blur', function(event)
    {
        let node = event.target;

        while(node && node !== document)
        {
            if('otBlur' in node)
            {
                node.otBlur(event);
                break;
            }

            node = node.parentNode;
        }
    }, true);
});
