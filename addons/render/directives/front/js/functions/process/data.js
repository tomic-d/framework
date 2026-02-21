directives.Fn('process.data', function(attributes, node, compile)
{
    const data = {};

    Object.entries(attributes).forEach(([name, definition]) =>
    {
        name = name.toLowerCase();

        const find = node.__attributes ? node.__attributes.find(attribute =>
        {
            return (attribute.lowerName === name) || attribute.lowerName === (':' + name) || attribute.lowerName.startsWith(name + '.') || attribute.lowerName.startsWith(':' + name + '.');
        }) : null;

        let attribute;

        if (find)
        {
            attribute = {
                original: { name: find.name, value: find.value }, 
                name: find.name,
                value: find.value,
                dynamic: false,
                modifiers: []
            };
        }
        else 
        {
            attribute = {
                original: { name: name, value: null }, 
                name: name,
                value: null,
                dynamic: false,
                modifiers: []
            };
        }

        if(attribute.name.split('.').length > 1)
        {
            const split = attribute.name.split('.');

            attribute.name = split[0];
            attribute.modifiers = split.slice(1);
        }

        if(attribute.name.startsWith(':'))
        {
            attribute.dynamic = true;
            attribute.name = attribute.name.substring(1);
        }

        if(attribute.dynamic)
        {
            try 
            {
                attribute.value = divhunt.Function(attribute.value, compile.data, false);
            }
            catch(error)
            {
                attribute.value = null;
            }
        }


        attribute.value = divhunt.DataDefineOne(attribute.value, definition);
        data[attribute.name] = attribute;

        if(find && node.removeAttribute)
        {
            node.removeAttribute(find.name);
        }
    });

    return data;
});