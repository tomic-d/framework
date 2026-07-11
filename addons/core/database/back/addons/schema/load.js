import '#database/addons/schema/addon.js';

/* Setters: addon.Schema / addon.SchemaRun (@addon.init) */
import '#database/addons/schema/events/addon.js';

/* Auto-run: addon side (@addon.add) + connection side (ItemOn add) */
import '#database/addons/schema/events/add.js';
import '#database/addons/schema/item/catch/add.js';

/* Functions */
import '#database/addons/schema/functions/parse.js';
import '#database/addons/schema/functions/columns.js';
import '#database/addons/schema/functions/describe.js';
import '#database/addons/schema/functions/run.js';
import '#database/addons/schema/functions/queue.js';
import '#database/addons/schema/functions/ready.js';
