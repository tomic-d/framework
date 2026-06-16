import '#database/addons/crud/addon.js';

/* Setters: addon.Find (@addon.init), item.Create/Update/Delete (@addon.item.init) */
import '#database/addons/crud/events/addon.js';
import '#database/addons/crud/events/item.js';

/* Write helpers */
import '#database/addons/crud/functions/fields/build.js';
import '#database/addons/crud/functions/fields/apply.js';

/* CRUD */
import '#database/addons/crud/functions/create.js';
import '#database/addons/crud/functions/update.js';
import '#database/addons/crud/functions/delete.js';
import '#database/addons/crud/functions/save.js';

/* Find chain */
import '#database/addons/crud/functions/find.js';
import '#database/addons/crud/functions/find/methods.js';
import '#database/addons/crud/functions/find/execute.js';
import '#database/addons/crud/functions/find/many.js';
import '#database/addons/crud/functions/find/one.js';
import '#database/addons/crud/functions/find/count.js';
import '#database/addons/crud/functions/find/plain.js';
import '#database/addons/crud/functions/find/exists.js';
import '#database/addons/crud/functions/find/aggregate.js';

/* Commands */
import '#database/addons/crud/commands/find.js';
import '#database/addons/crud/commands/create.js';
import '#database/addons/crud/commands/update.js';
import '#database/addons/crud/commands/delete.js';
import '#database/addons/crud/commands/batch.js';
