overlays.Fn('index', function()
{
    const items = overlays.Items();
    let max = 100000;

    for(const id in items)
    {
        const index = items[id].Get('index') || 100000;

        if(index > max)
        {
            max = index;
        }
    }

    return max + 1;
});
