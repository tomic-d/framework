(async () =>
{
    const result = await commands.Fn('call', 'test', { name: 'Dejan' });
    console.log('call result:', result);
})();
