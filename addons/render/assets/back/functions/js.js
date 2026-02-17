// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import assets from '../addon.js';

assets.Fn('js', function(context = {})
{
    const js = [];
    const items = Object.values(this.Items()).filter(item => item.Get('type') === 'js').sort((a, b) => a.Get('order') - b.Get('order'));

    items.forEach((item) =>
    {
        if(item.Get('content'))
        {
            if(typeof item.Get('content') === 'function')
            {
                js.push(item.Get('content').call(context));
            }
            else
            {
                js.push(item.Get('content'));
            }
        }
        else if(item.Get('path'))
        {
            const files = assets.Fn('scan.files', item.Get('path'), 'js', item.Get('ignore'));

            js.push(...assets.Fn('utils.read', files));
        }
    })

    return assets.Fn('utils.transform', js, 'js');
});