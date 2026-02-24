import assets from '../../addon.js';
import fs from 'fs';

assets.Fn('utils.read', function(files)
{
    const contents = [];

    for (const file of files)
    {
        if(!fs.existsSync(file))
        {
            continue;
        }

        const fileContent = fs.readFileSync(file, 'utf8');
        
        if (fileContent)
        {
            contents.push(fileContent);
        }
    }

    return contents;
});