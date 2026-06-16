import '#database/addons/sync/addon.js';

/* Setters (Primary/Index/Unique/Relation) on @addon.init */
import '#database/addons/sync/events/addon.js';

/* Auto-sync on connection add */
import '#database/addons/sync/events/connection.js';

/* Schemas */
import '#database/addons/sync/schemas/column.js';
import '#database/addons/sync/schemas/sync.js';

/* Functions */
import '#database/addons/sync/functions/columns.js';
import '#database/addons/sync/functions/column.js';
import '#database/addons/sync/functions/diff.js';
import '#database/addons/sync/functions/indexes.js';
import '#database/addons/sync/functions/keys.js';
import '#database/addons/sync/functions/system.js';
import '#database/addons/sync/functions/table.js';
import '#database/addons/sync/functions/sync.js';
import '#database/addons/sync/functions/ready.js';

/* Pipelines */
import '#database/addons/sync/pipelines/plan.js';
import '#database/addons/sync/pipelines/apply.js';
