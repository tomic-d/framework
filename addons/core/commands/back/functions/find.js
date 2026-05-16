import commands from '#commands/core/addon.js';

commands.Fn('find', function(method, pathname)
{
    const normalizedPathname = pathname.toLowerCase();

    const items = Object.values(this.Items()).filter((item) => item.Get('method') === method);

    for (const item of items)
    {
        if (item.Get('endpoint') === normalizedPathname)
        {
            return item;
        }
    }

    for (const item of items)
    {
        const endpoint = item.Get('endpoint');

        if (!(endpoint + '').includes(':'))
        {
            continue;
        }

        const endpointParts = endpoint.split('/');
        const pathParts = normalizedPathname.split('/');

        if (endpointParts.length !== pathParts.length)
        {
            continue;
        }

        let matches = true;

        for (let i = 0; i < endpointParts.length; i++)
        {
            if (!endpointParts[i].startsWith(':') && endpointParts[i] !== pathParts[i])
            {
                matches = false;
                break;
            }
        }

        if (matches)
        {
            return item;
        }
    }

    return Object.values(this.Items()).find((item) => item.Get('endpoint') === '/*');
});