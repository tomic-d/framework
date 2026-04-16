import database from '#database/addon.js';

/* Schema */
import '#database/schema.js';

/* Events */
import '#database/events/addon.js';
import '#database/events/item.js';
import '#database/events/connection.js';

/* Functions */
import '#database/functions/validation.js';
import '#database/functions/connection.js';
import '#database/functions/create.js';
import '#database/functions/update.js';
import '#database/functions/delete.js';
import '#database/functions/save.js';
import '#database/functions/find.js';
import '#database/functions/find/methods.js';
import '#database/functions/find/execute.js';
import '#database/functions/find/many.js';
import '#database/functions/find/one.js';
import '#database/functions/find/count.js';
import '#database/functions/find/plain.js';
import '#database/functions/find/exists.js';
import '#database/functions/find/aggregate.js';

/* Addons */
import '#database/addons/versions/load.js';
import '#database/addons/translations/load.js';
import '#database/addons/filters/load.js';
import '#database/addons/joins/load.js';
import '#database/addons/search/load.js';
import '#database/addons/metrics/load.js';

/* Commands */
import '#database/commands/find.js';
import '#database/commands/create.js';
import '#database/commands/update.js';
import '#database/commands/delete.js';
import '#database/commands/batch.js';
import '#database/commands/history.js';
import '#database/commands/restore.js';

export default database;
