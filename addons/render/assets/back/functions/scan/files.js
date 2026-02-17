// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import assets from '../../addon.js';
import fs from 'fs';
import path from 'path';

assets.Fn('scan.files', function(dirPath, extension = 'css', ignore = [], recursive = true)
{
    const results = [];

    if (!fs.existsSync(dirPath))
    {
        return results;
    }

    const items = fs.readdirSync(dirPath);
    const folders = [];
    const files = [];

    for (const item of items)
    {
        if (item.startsWith('.')) continue;

        const full = path.join(dirPath, item);
        const stats = fs.statSync(full);

        if (ignore.some(str => full.includes(str))) continue;

        if (stats.isDirectory() && recursive)
        {
            folders.push(full);
        }
        else if (item.endsWith(`.${extension}`) && !item.endsWith(`.back.${extension}`))
        {
            files.push(full);
        }
    }

    const addon = files.find(f => f.endsWith('/addon.js'));

    if (addon)
    {
        results.push(addon);
        files.splice(files.indexOf(addon), 1);
    }

    folders.sort();

    for (const folder of folders)
    {
        results.push(...assets.Fn('scan.files', folder, extension, ignore, recursive));
    }

    files.sort();
    results.push(...files);

    return results;
});