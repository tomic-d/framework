import divhunt from '#framework/load.js';
import queue from '#queue/addon.js';

queue.Fn('item.add', function(item, id, data, callback)
{
    const tasks = item.Get('tasks');

    if(id === null)
    {
        id = divhunt.GenerateUID();
    }

    tasks.push({id, data, callback});
    item.Set('tasks', tasks);
});