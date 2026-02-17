const directives = divhunt.Addon('directives', (addon) =>
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
    
    divhunt.EmitOn('addon.render.compile.before', (...data) =>
    {
        directives.Fn('process', 'before', ...data);
    })
    
    divhunt.EmitOn('addon.render.compile.after', (...data) =>
    {
        directives.Fn('process', 'after', ...data);
    })
    
    divhunt.EmitOn('addon.render.compile.node', (...data) =>
    {
        directives.Fn('process', 'node', ...data);
    })
});