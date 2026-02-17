directives.ItemAdd({
    id: 'dh-text',
    icon: 'text_fields',
    name: 'Text',
    description: 'Set element text content dynamically. Updates text nodes based on data expressions.',
    category: 'content',
    trigger: 'node',
    order: 700,
    type: '3',
    code: function(data, item, compile, node, identifier)
    {
        if (!/\{\{.*\}\}/.test(node.textContent))
        {
            return;
        }

        node.textContent = node.textContent.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, expression) =>
        {
            try
            {
                const result = divhunt.Function(expression, compile.data, false);

                if (result == null)
                {
                    return '';
                }

                const type = typeof result;

                if (['boolean', 'number', 'string'].includes(type))
                {
                    return result;
                }

                const stringified = result.toString();

                if (stringified !== '[object Object]')
                {
                    return stringified;
                }

                return `{{${type}}}`;
            }
            catch(error)
            {
                return `{{Error: ${error.message}}}`;
            }
        });
    }
});