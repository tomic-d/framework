onetype.AddonReady('directives', function()
{
    directives.ItemAdd({
        id: 'ot-transform',
        icon: 'auto_fix_high',
        name: 'Transform',
        description: 'Apply transform functions to elements for advanced functionality.',
        trigger: 'node',
        order: 1100,
        type: '1',
        code: function(data, item, compile, node, identifier)
        {
            const transformer = transforms.ItemGet(node.tagName.toLowerCase());

            if(!transformer)
            {
                return;
            }

            const target = document.createElement('div');

            Array.from(node.attributes).forEach(attr =>
            {
                target.setAttribute(attr.name, attr.value);
            });

            while(node.firstChild)
            {
                target.appendChild(node.firstChild);
            }

            let raw = Object.entries(directives.Fn('process.data', transformer.Get('config'), target, compile));
            raw = Object.fromEntries(raw.map(([key, attr]) => [key, attr.value]));

            transforms.Fn('run', node.tagName.toLowerCase(), target, raw);

            node.replaceWith(target);
        }
    });
});
