import '#database/addons/filters/addon.js';

/* Schema */
import '#database/addons/filters/core/register/schemas/filter.js';

/* Operators: filters items (one per operator) */
import '#database/addons/filters/items/filters/binary.js';
import '#database/addons/filters/items/filters/suffix.js';
import '#database/addons/filters/items/filters/json.js';

/* Chain methods: crud items (filter/orFilter/group) */
import '#database/addons/filters/items/crud/find.js';

/* WHERE build + execute hook */
import '#database/addons/filters/functions/build.js';
import '#database/addons/filters/events/execute.js';
