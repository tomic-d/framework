import '#database/addons/crud/addon.js';

/* Chain mechanism (open context, item iteration, thenable write) */
import '#database/addons/crud/functions/chain.js';
import '#database/addons/crud/functions/run.js';

/* Schemas */
import '#database/addons/crud/core/register/schemas/query.js';

/* Setters: addon.Find (@addon.init), item.Create/Update/Delete (@addon.item.init) */
import '#database/addons/crud/events/addon.js';
import '#database/addons/crud/events/item.js';

/* Value helpers */
import '#database/addons/crud/functions/cast.value.js';
import '#database/addons/crud/functions/cast.js';
import '#database/addons/crud/functions/serialize.js';

/* Validation shared with the filters subaddon */
import '#database/addons/crud/functions/validate/field.js';
import '#database/addons/crud/functions/validate/value.js';
import '#database/addons/crud/functions/validate/between.js';

/* Write helpers */
import '#database/addons/crud/functions/hook.js';
import '#database/addons/crud/functions/fields/build.js';
import '#database/addons/crud/functions/fields/apply.js';

/* Find engine (terminals call these) */
import '#database/addons/crud/functions/find/execute.js';
import '#database/addons/crud/functions/find/aggregate.js';

/* Write operations (run dispatches by chain.operation) */
import '#database/addons/crud/functions/write/create.js';
import '#database/addons/crud/functions/write/update.js';
import '#database/addons/crud/functions/write/delete.js';

/* Chain items: write builders */
import '#database/addons/crud/items/whitelist.js';

/* Chain items: find builders */
import '#database/addons/crud/items/find/limit.js';
import '#database/addons/crud/items/find/page.js';
import '#database/addons/crud/items/find/offset.js';
import '#database/addons/crud/items/find/sort.js';
import '#database/addons/crud/items/find/select.js';
import '#database/addons/crud/items/find/distinct.js';

/* Chain items: find terminals */
import '#database/addons/crud/items/find/many.js';
import '#database/addons/crud/items/find/one.js';
import '#database/addons/crud/items/find/count.js';
import '#database/addons/crud/items/find/plain.js';
import '#database/addons/crud/items/find/exists.js';
import '#database/addons/crud/items/find/sum.js';
import '#database/addons/crud/items/find/avg.js';
import '#database/addons/crud/items/find/min.js';
import '#database/addons/crud/items/find/max.js';

/* Commands */
import '#database/addons/crud/items/commands/find.js';
import '#database/addons/crud/items/commands/create.js';
import '#database/addons/crud/items/commands/update.js';
import '#database/addons/crud/items/commands/delete.js';
import '#database/addons/crud/items/commands/batch.js';
