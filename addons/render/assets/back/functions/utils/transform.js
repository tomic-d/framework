// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import assets from '../../addon.js';

assets.Fn('utils.transform', function(contents, type = 'js')
{
    if (!Array.isArray(contents))
    {
        return '';
    }

    if (type === 'js')
    {
        const code = contents.map(code => 
        {
            code = code.replace(/^import\s+.*?;?\s*$/gm, '');
            code = code.replace(/^export\s+.*?;?\s*$/gm, '');
            code = code.replace(/^\s*[\r\n]/gm, '');

            return code;
        });

        return code.filter(content => content && content.trim()).join('\n\n');
    }

    if (type === 'css')
    {
        const code = contents.map(code => code ? code.trim() : '');

        return code.filter(content => content && content.trim()).join('\n');
    }

    return code.filter(content => content && content.trim()).join('\n');
});