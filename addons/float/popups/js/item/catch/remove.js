popups.ItemOn('remove', function(item)
{
    if(item.Get('show'))
    {
        item.Set('show', false);
    }
});
