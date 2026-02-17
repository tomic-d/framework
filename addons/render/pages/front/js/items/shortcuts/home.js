divhunt.AddonReady('shortcuts', (shortcuts) =>
{
    shortcuts.Item({
        id: 'pages:home',
        key: 'meta+1',
        description: 'Navigate to home page',
        command: { id: 'pages:change', path: '/' }
    });
});
