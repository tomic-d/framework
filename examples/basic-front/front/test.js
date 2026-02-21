const commands = divhunt.Addon('commands');

(async () =>
{
    const result = await commands.Fn('api', 'test', { name: 'Dejan' });
    console.log('api result:', result);
})();
