// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import assets from '../addon.js';

assets.Fn('css', function()
{
    const css = [];
    const items = Object.values(this.Items()).filter(item => item.Get('type') === 'css').sort((a, b) => a.Get('order') - b.Get('order'));
    
    items.forEach((item) => 
    {
        if(item.Get('content'))
        {
            if(typeof item.Get('content') === 'function')
            {
                css.push(item.Get('content')());
            }
            else 
            {
                css.push(item.Get('content'));
            }
        }
        else if(item.Get('path'))
        {
            const files = assets.Fn('scan.files', item.Get('path'), 'css', item.Get('ignore'));

            css.push(...assets.Fn('utils.read', files));
        }
    })

    return assets.Fn('utils.transform', css, 'css');
});