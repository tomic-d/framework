// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

commands.Fn('find', function(method, pathname)
{
    const items = Object.values(this.Items());

    for (const item of items)
    {
        if (item.Get('method') !== method)
        {
            continue;
        }

        const endpoint = item.Get('endpoint');
        const result = divhunt.RouteMatch(endpoint, pathname);

        if (result.match)
        {
            return item;
        }
    }

    return null;
});