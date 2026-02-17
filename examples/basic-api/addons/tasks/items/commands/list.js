import commands from 'divhunt/commands';
import tasks from '../../addon.js';

commands.Item({
    id: 'tasks:list',
    method: 'GET',
    endpoint: '/api/tasks',
    exposed: true,
    callback: async function(properties, resolve)
    {
        const items = Object.values(tasks.Items());

        resolve({
            tasks: items.map(item => item.Get(['id', 'title', 'done']))
        });
    }
});
