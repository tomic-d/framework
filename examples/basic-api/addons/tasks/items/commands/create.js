import commands from 'divhunt/commands';
import tasks from '../../addon.js';

commands.Item({
    id: 'tasks:create',
    method: 'POST',
    endpoint: '/api/tasks',
    exposed: true,
    in: {
        title: ['string', null, true]
    },
    callback: async function(properties, resolve)
    {
        const task = tasks.Item({
            id: Date.now(),
            title: properties.title,
            done: false
        });

        resolve({ task: task.Get(['id', 'title', 'done']) });
    }
});
