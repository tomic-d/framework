// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import divhunt from "#framework/load.js";
import assets from "#assets/load.js";

divhunt.AddonReady('commands', (commands) => 
{
    commands.Item({
        id: 'assets:css',
        exposed: true,
        method: 'GET',
        endpoint: '/assets/build.css',
        type: 'CSS',
        callback: async function(properties, resolve)
        {
            resolve(await assets.Fn('css'));
        }
    });
});

