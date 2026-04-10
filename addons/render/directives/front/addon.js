const directives = onetype.Addon('directives', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('icon', ['string', 'code']);
    addon.Field('name', ['string', '']);
    addon.Field('description', ['string', '']);
    addon.Field('trigger', ['string', 'node']);
    addon.Field('order', ['number', 1]);
    addon.Field('code', ['function']);
    addon.Field('strict', ['boolean', true]);

    addon.Field('tag', ['string']);
    addon.Field('type', ['string']);
    addon.Field('attributes', ['object', {}]);

    /* Trigers */
    
    onetype.EmitOn('@addon.render.compile.before', (item, compile, node, identifier) =>
    {
        if(compile.locale !== false)
        {
            directives.Fn('process.locale', node);
        }

        directives.Fn('process', 'before', item, compile, node, identifier);
    })

    onetype.EmitOn('@addon.render.compile.after', (item, compile, node, identifier) =>
    {
        directives.Fn('process', 'after', item, compile, node, identifier);
    })

    onetype.EmitOn('@addon.render.compile.node', (item, compile, node, identifier) =>
    {
        directives.Fn('process', 'node', item, compile, node, identifier);
    })
});