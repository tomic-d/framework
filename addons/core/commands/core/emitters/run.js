import onetype from '#framework/load.js';

onetype.EmitRegister('@commands.run', {
    description: 'Fired after every command execution, success or failure. Carries the full input and result of the run.',
    metadata: { addon: 'commands' },
    config: {
        id: {
            type: 'string',
            description: 'ID of the command that ran.'
        },
        input: {
            type: 'object',
            description: 'Input properties the command received, after validation.'
        },
        data: {
            type: 'any',
            description: 'Data the command resolved with. Null when the run failed.'
        },
        message: {
            type: 'string',
            description: 'Human readable result message.'
        },
        code: {
            type: 'number',
            description: 'Status code of the result, HTTP style. 2xx is success.'
        },
        time: {
            type: 'string',
            description: 'Execution duration in milliseconds.'
        }
    }
});
