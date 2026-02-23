import commands from 'onetype/commands';
import html from 'onetype/html';

commands.Item({
    id: 'html',
    exposed: true,
    method: 'GET',
    endpoint: '*',
    type: 'HTML',
    callback: async function(properties, resolve)
    {
        resolve(html.Fn('render'));
    }
});
