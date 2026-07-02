import '#database/addons/search/addon.js';

/* Setter: addon.Search (@addon.init) */
import '#database/addons/search/events/addon.js';

/* Chain method: crud item (search) */
import '#database/addons/search/items/crud/find.js';

/* WHERE hook (full-text match on @database.find.execute) */
import '#database/addons/search/events/execute.js';
