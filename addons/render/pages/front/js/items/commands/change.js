divhunt.AddonReady('commands', (commands) =>
{
    commands.Item({
        id: 'pages:change',
        method: 'POST',
        endpoint: '/api/pages/change',
        exposed: true,
        description: 'Navigate to a page by ID or path',
        in: {
            id: ['string', null],
            path: ['string', null],
            parameters: ['object', {}],
            push: ['boolean', true]
        },
        out: {
            id: ['string'],
            parameters: ['object'],
            url: ['string']
        },
        callback: async function(props)
        {
            if(!props.id && !props.path)
            {
                throw new Error('Either id or path is required.');
            }

            const target = props.path || props.id;
            const result = await pages.Fn('change', target, props.parameters || {}, {
                path: !!props.path,
                push: props.push !== false
            });

            if(result.code !== 200)
            {
                throw new Error(result.message);
            }

            return result.data;
        }
    });
});
