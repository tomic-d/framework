import variables from '#variables/core/addon.js';

variables.ItemOn('add', function(item)
{
    item.Set('type', typeof item.Get('value'));
});