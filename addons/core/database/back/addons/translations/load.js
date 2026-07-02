import '#database/addons/translations/addon.js';

/* Setter: addon.Translations (@addon.init) */
import '#database/addons/translations/events/addon.js';

/* Chain methods: crud items (language/languages on find/create/update) */
import '#database/addons/translations/items/crud/language.js';

/* Helpers */
import '#database/addons/translations/functions/context.js';

/* Write hooks (translation rows on create/update/delete) */
import '#database/addons/translations/events/create.js';
import '#database/addons/translations/events/update.js';
import '#database/addons/translations/events/delete.js';

/* Read hook (overlay translations onto results) */
import '#database/addons/translations/events/execute.js';
