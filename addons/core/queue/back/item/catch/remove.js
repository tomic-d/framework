import queue from '#queue/addon.js';

queue.ItemOn('remove', (item) => 
{
    item.Set('running', false);
})