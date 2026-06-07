import settings from '../addon.js';

onetype.EmitOn('@document.ready', () =>
{
    settings.Fn('init');
});
