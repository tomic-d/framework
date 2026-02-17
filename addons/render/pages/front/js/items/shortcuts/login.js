divhunt.AddonReady('shortcuts', (shortcuts) =>
{
    shortcuts.Item({
        id: 'pages:login',
        key: 'meta+2',
        description: 'Navigate to login page',
        command: { id: 'pages:change', path: '/login' }
    });
});
