import onetype from '../../lib/load.js';

onetype.Pipeline('deploy', {
    description: 'Deploy a build to a server.',
    in: {
        server:  ['string', '', true],
        build:   ['string', '', true],
        version: ['string', '', true]
    },
    out: {
        server:    ['string'],
        build:     ['string'],
        version:   ['string'],
        validated: ['boolean'],
        connected: ['boolean'],
        uploaded:  ['boolean'],
        activated: ['boolean']
    }
})
.Join('validate', 10, {
    description: 'Validate that the server and build exist.',
    in: {
        server: {type: 'string', required: true, description: 'Target server hostname'},
        build:  {type: 'string', required: true, description: 'Build artifact filename'}
    },
    out: {
        validated: {type: 'boolean', description: 'True if validation passed'}
    },
    callback: async (properties, resolve) =>
    {
        if(properties.server === 'missing')
        {
            return resolve(null, 'Server not found.', 404);
        }

        resolve({validated: true}, 'Validated.', 200);
    },
    rollback: async (properties, error) =>
    {
        console.log('[validate rollback]', error.message);
    }
})
.Join('connect', 20, {
    description: 'Open SSH connection to the server.',
    callback: async (properties, resolve) =>
    {
        console.log('[connect] opening SSH to', properties.server);
        await new Promise(r => setTimeout(r, 50));

        resolve({connected: true}, 'Connected.', 200);
    },
    commit: async () =>
    {
        console.log('[connect commit] closing SSH cleanly');
    },
    rollback: async () =>
    {
        console.log('[connect rollback] closing SSH after failure');
    }
})
.Join('upload', 30, {
    description: 'Upload build artifact to the server.',
    callback: async (properties, resolve) =>
    {
        console.log('[upload] sending', properties.build, 'to', properties.server);
        await new Promise(r => setTimeout(r, 50));

        resolve({uploaded: true}, 'Uploaded.', 200);
    },
    rollback: async () =>
    {
        console.log('[upload rollback] deleting uploaded artifact');
    }
})
.Join('activate', 40, {
    description: 'Swap symlink to new build version.',
    callback: async (properties, resolve) =>
    {
        if(properties.version === 'broken')
        {
            throw onetype.Error(500, 'Activation failed for version :version:.', {version: properties.version});
        }

        console.log('[activate] switching to', properties.version);
        resolve({activated: true}, 'Activated.', 200);
    },
    commit: async (properties) =>
    {
        console.log('[activate commit] deployment complete — version', properties.version, 'live on', properties.server);
    },
    rollback: async () =>
    {
        console.log('[activate rollback] reverting symlink to previous version');
    }
});