directives.ItemAdd({
    id: 'dh-html',
    icon: 'code',
    name: 'HTML',
    description: 'Set element innerHTML dynamically. Renders HTML content from data expressions.',
    category: 'content',
    trigger: 'node',
    order: 750,
    strict: true,
    type: '1',
    attributes: {
        'dh-html': ['string']
    },
    code: function(data, item, compile, node, identifier)
    {
        const html = data['dh-html'].value;

        if(html)
        {
            const results = divhunt.Function(html, compile.data, false);

            if(typeof results === 'string' && results.trim())
            {
                const originalChildren = compile.children;
                compile.children = false;

                const compiled = item.Compile(results, compile.data);
                const fragment = document.createDocumentFragment();

                while(compiled.element.firstChild)
                {
                    fragment.appendChild(compiled.element.firstChild);
                }

                node.replaceWith(fragment);
                compile.children = originalChildren;
            }
            else
            {
                node.remove();
            }
        }
    }
});
