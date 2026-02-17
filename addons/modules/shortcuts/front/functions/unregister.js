import shortcuts from '../addon.js';

shortcuts.Fn('unregister', function()
{
    if(!this.StoreGet('registered'))
    {
        return;
    }

    const handler = this.StoreGet('handler');

    if(handler)
    {
        document.removeEventListener('keydown', handler);
    }

    this.StoreSet('registered', false);
    this.StoreSet('handler', null);
});
