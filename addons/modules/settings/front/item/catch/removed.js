import settings from '../../addon.js';

settings.ItemOn('removed', () => settings.Fn('sync'));
