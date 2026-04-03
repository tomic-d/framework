onetype.AddonReady('directives', function(directives)
{
    directives.ItemAdd({
        id: 'ot-for',
        icon: 'repeat',
        name: 'For',
        description: 'Loop through arrays and objects to render multiple elements. Supports item and index variables for complex iterations.',
        category: 'control-flow',
        trigger: 'node',
        order: 200,
        attributes: {
            'ot-for': ['string']
        },
        code: function(data, item, compile, node, identifier)
        {
            const expression = data['ot-for'].value;
            const match = expression.match(/(\w+)(?:\s*,\s*(\w+))?\s+in\s+(.+)/);

            if (!match)
            {
                onetype.Error(400, 'Invalid ot-for syntax. Expected: "item in items".');
                return;
            }

            const originalChildren = compile.children;
            compile.children = false;

            const forName = match[1];
            const forIndex = match[2] || forName + '_index';
            const forExpression = match[3];

            try
            {
                let items = onetype.Function(forExpression, compile.data, false);

                if (!Array.isArray(items) && items && typeof items === 'object')
                {
                    if (items[Symbol.iterator])
                    {
                        items = Array.from(items);
                    }
                    else
                    {
                        items = Object.entries(items);
                    }
                }
                else if (!Array.isArray(items))
                {
                    throw onetype.Error(400, 'ot-for expects an array or iterable.');
                }

                const html = node.outerHTML;
                const fragment = document.createDocumentFragment();

                items.forEach((value, index) =>
                {
                    const loopData = Object.assign({}, compile.data);
                    loopData[forName] = value;
                    loopData[forIndex] = index;

                    const compiled = item.Compile(html, loopData);
                    const key = onetype.GenerateHash(index + ':' + (typeof value === 'object' ? JSON.stringify(value) : String(value)));

                    while(compiled.element.firstChild)
                    {
                        const child = compiled.element.firstChild;

                        if(child.nodeType === Node.ELEMENT_NODE)
                        {
                            child.setAttribute('ot-key', key);
                        }

                        fragment.appendChild(child);
                    }
                });

                node.before(fragment);
                node.remove();
            }
            catch (error)
            {
                onetype.Error(500, 'Error in ot-for directive.');
            }
            finally
            {
                compile.children = originalChildren;
            }
        }
    });
});