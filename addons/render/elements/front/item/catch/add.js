elements.ItemOn('add', (item) =>
{
    elements.RenderAdd(item.Get('id'), function()
    {
        this.Define(item.Get('config'));

        return item.Get('render').call(this);
    });
})