import database from '#database/addon.js';

/* Events */
import '#database/events/addon.js';
import '#database/item/catch/add.js';

/* Clients registry */
import '#database/addons/clients/load.js';

/* Core functions */
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
