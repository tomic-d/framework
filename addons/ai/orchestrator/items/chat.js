onetype.AddonReady('orchestrator', (orchestrator) =>
{
    orchestrator.Item({
        id: 'chat',
        task: '',
        steps: 10,
        agents: null,
        data: {}
    });
});
