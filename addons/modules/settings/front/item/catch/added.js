import settings from '../../addon.js';

settings.ItemOn('added', () => settings.Fn('sync'));
