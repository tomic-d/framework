import settings from '../../addon.js';

settings.ItemOn('modified', () => settings.Fn('sync'));
