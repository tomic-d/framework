import shortcuts from '../addon.js';

shortcuts.Fn('context', function(name)
{
    if(name === undefined)
    {
        return this.StoreGet('context');
    }

    this.StoreSet('context', name);

    return name;
});
