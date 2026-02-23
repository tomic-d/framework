import onetype from "#framework/load.js";
import assets from "#assets/load.js";

onetype.AddonReady('commands', (commands) => 
{
    commands.Item({
        id: 'assets:css',
        exposed: true,
        method: 'GET',
        endpoint: '/assets/build.css',
        type: 'CSS',
        callback: async function(properties, resolve)
        {
            resolve(await assets.Fn('css'));
        }
    });
});

