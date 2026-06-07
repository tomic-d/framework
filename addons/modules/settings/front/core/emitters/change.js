import onetype from '#onetype';

onetype.EmitRegister('settings.change', {
    description: 'Fired when a setting value changes.',
    metadata: { addon: 'settings' },
    config: {
        id: {
            type: 'string',
            description: 'The setting ID that changed.'
        },
        value: {
            type: 'any',
            description: 'The new value.'
        }
    }
});
