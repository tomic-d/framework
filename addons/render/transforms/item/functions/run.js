transforms.Fn('item.run', function(item, node, data = null)
{
    if(data === null)
    {
        data = transforms.Fn('data', item.Get('config'), node);
    }

    item.Fn('load').then(() =>
    {
        item.Get('code').call({}, data, node, item);
    });
});
