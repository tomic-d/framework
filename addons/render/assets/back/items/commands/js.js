import onetype from "#framework/load.js";
import assets from "#assets/addon.js";

onetype.AddonReady('commands', (commands) => 
{
    commands.Item({
        id: 'assets:js',
        exposed: true,
        method: 'GET',
        endpoint: '/assets/build.js',
        type: 'JS',
        callback: async function(properties, resolve)
        {
            resolve(await assets.Fn('js', {http: this.http}));
        }
    });
});