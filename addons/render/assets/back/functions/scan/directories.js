// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import assets from '../../addon.js';
import fs from 'fs';
import path from 'path';

assets.Fn('scan.directories', function(dirPath, ignore = [], recursive = true)
{
    const dirs = [];

    if (!fs.existsSync(dirPath))
    {
        return dirs;
    }

    const items = fs.readdirSync(dirPath);

    for (const item of items)
    {
        if (item.startsWith('.')) continue;
        if (ignore.some(str => item.includes(str))) continue;

        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory())
        {
            dirs.push(itemPath);

            if (recursive)
            {
                dirs.push(...assets.Fn('scan.directories', itemPath, ignore, recursive));
            }
        }
    }

    return dirs;
});