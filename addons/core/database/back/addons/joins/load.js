import '#database/addons/joins/addon.js';

/* Schemas */
import '#database/addons/joins/core/register/schemas/join.js';

/* Chain method: crud item (join) */
import '#database/addons/joins/items/crud/find.js';

/* Build + transform hook */
import '#database/addons/joins/functions/build.js';
import '#database/addons/joins/events/transform.js';
