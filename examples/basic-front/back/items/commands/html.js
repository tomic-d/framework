import commands from 'divhunt/commands';
import html from 'divhunt/html';

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
