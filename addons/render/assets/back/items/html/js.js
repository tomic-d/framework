// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import divhunt from "#framework/load.js";

divhunt.AddonReady('html', (html) => 
{
    html.Item({
        id: 'assets-js',
        exposed: true,
        tag: 'script',
        position: 'head',
        order: 90,
        attributes: {
            src: '/assets/build.js?v=18',
            defer: null
        }
    });
});