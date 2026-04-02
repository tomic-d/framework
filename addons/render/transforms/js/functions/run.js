transforms.Fn('run', function(id, node, data = null)
{
    const item = transforms.ItemGet(id);

    if(!item)
    {
        return;
    }

    item.Fn('run', node, data);
});
