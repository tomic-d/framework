import database from '#database/addon.js';

/* Schema */
import '#database/core/register/schemas/filter.js';
import '#database/core/register/schemas/join.js';
import '#database/core/register/schemas/query.js';

/* Events */
import '#database/events/addon.js';
import '#database/events/connection.js';

/* Dialect registry + value helpers */
import '#database/addons/dialects/load.js';
import '#database/functions/operation.js';
import '#database/functions/cast.value.js';
import '#database/functions/cast.js';
import '#database/functions/serialize.js';

/* Core functions */
import '#database/functions/validation.js';
import '#database/functions/connection.js';
import '#database/functions/transaction.js';

/* Subaddons */
import '#database/addons/sync/load.js';
import '#database/addons/crud/load.js';
import '#database/addons/versions/load.js';
import '#database/addons/translations/load.js';
import '#database/addons/filters/load.js';
import '#database/addons/joins/load.js';
import '#database/addons/search/load.js';
import '#database/addons/metrics/load.js';

export default database;
