divhunt.EmitOn('addon.render.compile.before', (item, compile) =>
{
    const global = {};
    const items = variables.Items();

    for(const id in items)
    {
        global[id] = items[id].Get('value');
    }

    compile.data.global = global;
});