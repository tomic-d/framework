import onetype from 'onetype';
import commands from 'onetype/commands';

import './addons/tasks/load.js';

commands.Fn('http.server', 3000, {
    onStart: () =>
    {
        console.log('API running on http://localhost:3000');
        console.log('');
        console.log('Try:');
        console.log('  curl http://localhost:3000/api/tasks');
        console.log('  curl -X POST http://localhost:3000/api/tasks -d \'{"title":"Buy milk"}\'');
    }
});
