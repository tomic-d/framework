directives.ItemAdd({
    id: 'dh-transform',
    icon: 'auto_fix_high',
    name: 'Transform',
    description: 'Apply transform functions to elements for advanced functionality. Enables custom element behaviors and third-party integrations.',
    trigger: 'node',
    order: 1100,
    type: '1',
    code: async function(data, item, compile, node, identifier)
    {
        const transformer = transforms.ItemGet(node.tagName.toLowerCase());

        if(!transformer)
        {
            return;
        }

        // Don't stop children processing - let each transform handle itself
        // compile.children = false;

        const html = node.outerHTML.replace(new RegExp(`^<${node.tagName.toLowerCase()}\\b`), `<div`) .replace(new RegExp(`</${node.tagName.toLowerCase()}>$`), `</div>`);
        const compiled = item.Compile(html, compile.data);

        data = directives.Fn('process.data', transformer.Get('config'), compiled.element.firstElementChild, compiled);

        node.style.display = 'none';

        await transforms.Fn('load.assets', transformer);

        // Use Promise to handle async properly
        return new Promise((resolve) => {
            setTimeout(() => {
                const targetNode = compiled.element.firstElementChild;
                transformer.Get('code').call({}, data, transformer, compile, targetNode, identifier);
                node.replaceWith(targetNode);
                resolve();
            }, 0);
        });
    }
});