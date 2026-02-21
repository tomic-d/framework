import commands from '#commands/core/addon.js';

import '#commands/core/item/functions/run.js';
import '#commands/core/functions/run.js';

/* gRPC */
import '#commands/back/functions/grpc/server.js';
import '#commands/back/functions/grpc/client.js';

/* HTTP */
import '#commands/back/functions/http/server.js';

/* Find */
import '#commands/back/functions/find.js';

/* Expose */
import '#commands/back/functions/expose.js';
import '#commands/back/functions/hide.js';

/* Items */
import '#commands/back/items/self/one.js';
import '#commands/back/items/self/many.js';
import '#commands/back/items/self/run.js';

export default commands;