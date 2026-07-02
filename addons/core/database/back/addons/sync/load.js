import '#database/addons/sync/addon.js';

/* Setters (Primary/Index/Unique/Relation) on @addon.init */
import '#database/addons/sync/events/addon.js';

/* Schemas */
import '#database/addons/sync/core/register/schemas/column.js';
import '#database/addons/sync/core/register/schemas/schema.js';
import '#database/addons/sync/core/register/schemas/sync.js';

/* Get (read/derive, no writes) */
import '#database/addons/sync/functions/get/columns.js';
import '#database/addons/sync/functions/get/indexes.js';
import '#database/addons/sync/functions/get/foreign.js';

/* Apply (write to the database) */
import '#database/addons/sync/functions/apply/column.js';

/* Pipelines */
import '#database/addons/sync/core/pipelines/schema.js';
import '#database/addons/sync/core/pipelines/plan.js';
import '#database/addons/sync/core/pipelines/apply.js';
