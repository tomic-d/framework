import '#database/addons/versions/addon.js';

/* Schemas */
import '#database/addons/versions/core/register/schemas/version.js';

/* Setters: Versions/History/Restore (@addon.init), History (@addon.item.init) */
import '#database/addons/versions/events/addon.js';
import '#database/addons/versions/events/item.js';

/* Get (read/derive, no writes) */
import '#database/addons/versions/functions/get/tracked.js';
import '#database/addons/versions/functions/get/diff.js';
import '#database/addons/versions/functions/get/match.js';
import '#database/addons/versions/functions/get/fold.js';
import '#database/addons/versions/functions/get/fold.many.js';
import '#database/addons/versions/functions/get/history.js';

/* Apply (write a version row / fold one onto a state) */
import '#database/addons/versions/functions/apply/fold.js';
import '#database/addons/versions/functions/apply/write.js';

/* Chain method: crud item (version) */
import '#database/addons/versions/items/crud/find.js';

/* Write hooks (record versions on create/update/delete) */
import '#database/addons/versions/events/create.js';
import '#database/addons/versions/events/update.js';
import '#database/addons/versions/events/delete.js';

/* Read hook (time-travel execute) */
import '#database/addons/versions/events/execute.js';

/* Pipeline */
import '#database/addons/versions/core/pipelines/restore.js';
