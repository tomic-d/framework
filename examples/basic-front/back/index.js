import './assets.js';
import './items/html/fonts.js';
import './items/commands/html.js';
import './items/commands/test.js';

import commands from 'onetype/commands';

commands.Fn('http.server', 3000, {
    onStart: () =>
    {
        console.log('basic-front running on http://localhost:3000');
    }
});
