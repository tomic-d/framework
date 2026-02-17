directives.ItemAdd({
    id: 'dh-for',
    icon: 'repeat',
    name: 'For',
    description: 'Loop through arrays and objects to render multiple elements. Supports item and index variables for complex iterations.',
    category: 'control-flow',
    trigger: 'node',
    order: 200,
    attributes: {
        'dh-for': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const expression = data['dh-for'].value;
        const match = expression.match(/(\w+)(?:\s*,\s*(\w+))?\s+in\s+(.+)/);

        if (!match)
        {
            console.error(`Invalid dh-for syntax: ${expression}. Expected format: "item in items" or "item, index in items"`);
            return;
        }

        const originalChildren = compile.children;
        compile.children = false;

        const forName = match[1];
        const forIndex = match[2] || forName + '_index';
        const forExpression = match[3];

        try
        {
            let items = divhunt.Function(forExpression, compile.data, false);

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
                throw(`dh-for expects an array or iterable, got: ${typeof items}`);
            }

            const html = node.outerHTML;
            const fragment = document.createDocumentFragment();

            items.forEach((value, index) =>
            {
                const loopData = Object.assign({}, compile.data);
                loopData[forName] = value;
                loopData[forIndex] = index;

                const compiled = item.Compile(html, loopData);

                while(compiled.element.firstChild)
                {
                    fragment.appendChild(compiled.element.firstChild);
                }
            });

            node.before(fragment);
            node.remove();
        }
        catch (error)
        {
            console.error(`Error in dh-for directive for "${expression}":`, error);
        }
        finally
        {
            compile.children = originalChildren;
        }
    }
});