import commands from 'divhunt/commands';
import tasks from '../../addon.js';

commands.Item({
    id: 'tasks:toggle',
    method: 'PUT',
    endpoint: '/api/tasks/:id',
    exposed: true,
    in: {
        id: ['number', null, true]
    },
    callback: async function(properties, resolve)
    {
        const items = Object.values(tasks.Items());
        const task = items.find(item => item.Get('id') === properties.id);

        if(!task)
        {
            return resolve(null, 'Task not found', 404);
        }

        task.Set('done', !task.Get('done'));

        resolve({ task: task.Get(['id', 'title', 'done']) });
    }
});
