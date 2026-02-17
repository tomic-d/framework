directives.Fn('process.attributes', function(node, compile)
{
    if (node.nodeType !== Node.ELEMENT_NODE || !node.__attributes)
    {
        return;
    }

    node.__attributes.forEach(attribute =>
    {
        if (!attribute.name.startsWith(':'))
        {
            return;
        }

        const attributeName = attribute.name.substring(1);
        const expression = attribute.value;

        try
        {
            const value = divhunt.Function(expression, compile.data, false);

            if (value === null || value === undefined || value === false)
            {
                node.removeAttribute(attributeName);
            }
            else if (value === true)
            {
                node.setAttribute(attributeName, '');
            }
            else if (typeof value === 'string' || typeof value === 'number')
            {
                node.setAttribute(attributeName, value);
            }
            else
            {
                node.removeAttribute(attributeName);
            }

            node.removeAttribute(attribute.name);
        }
        catch(error)
        {
            console.error('Dynamic attribute error:', error);
            node.removeAttribute(attribute.name);
        }
    });
});
