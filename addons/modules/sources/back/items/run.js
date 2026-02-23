import onetype from '#onetype';
import sources from '../addon.js';

onetype.AddonReady('commands', (commands) =>
{
    commands.Item({
        id: 'sources:run',
        method: 'POST',
        endpoint: '/api/sources/run',
        exposed: true,
        description: 'Run a source by ID',
        in: {
            id: ['string', null, true],
            props: ['object', {}]
        },
        out: {
            data: ['any'],
            message: ['string'],
            code: ['number']
        },
        callback: async function(props)
        {
            const result = await sources.Fn('run', props.id, props.props || {});

            return result;
        }
    });
});
