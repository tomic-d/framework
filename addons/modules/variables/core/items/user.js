import divhunt from '#framework/load.js';

divhunt.AddonReady('variables', (variables) =>
{
    variables.Item({
        id: 'user',
        value: {
            id: 1,
            name: 'Dejan Tomic',
            team: {
                id: 1,
                name: 'OneType'
            }
        }
    })
});