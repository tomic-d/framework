import divhunt from '#divhunt';
import variables from '../../addon.js';

variables.ItemOn('add', function(item)
{
    const value = item.Get('value');
    const type = typeof value;

    if(!item.Get('type'))
    {
        item.Set('type', type);
    }
});
