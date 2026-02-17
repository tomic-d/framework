import queue from '#queue/addon.js';

queue.ItemOn('add', (item) => 
{
    item.Fn('start');
})