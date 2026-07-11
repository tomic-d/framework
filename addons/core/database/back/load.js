import database from '#database/addon.js';

/* Events */
import '#database/events/addon.js';
import '#database/item/catch/add.js';

/* Core functions */
import '#database/functions/connection.js';
import '#database/functions/transaction.js';
import '#database/functions/column.js';
import '#database/functions/map.js';
import '#database/functions/spread.js';

/* Subaddons */
import '#database/addons/schema/load.js';
import '#database/addons/crud/load.js';
import '#database/addons/versions/load.js';
import '#database/addons/translations/load.js';
import '#database/addons/filters/load.js';
import '#database/addons/joins/load.js';
import '#database/addons/search/load.js';
import '#database/addons/metrics/load.js';

export default database;
