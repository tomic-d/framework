import divhunt from '#framework/load.js';
import database from '#database/addon.js';

import '#database/functions/find.js';
import '#database/functions/create.js';
import '#database/functions/update.js';
import '#database/functions/delete.js';

import '#database/functions/find/many.js';
import '#database/functions/find/count.js';
import '#database/functions/find/plain.js';
import '#database/functions/find/filter.js';
import '#database/functions/find/filters.js';
import '#database/functions/find/methods.js';
import '#database/functions/find/builder.js';
import '#database/functions/find/validation.js';

import '#database/item/functions/create.js';
import '#database/item/functions/update.js';
import '#database/item/functions/delete.js';
import '#database/item/functions/find.js';
import '#database/item/functions/save.js';
import '#database/item/functions/transaction.js';

import '#database/item/catch/add.js';

import '#database/events/addon.add.js';

import '#database/events/middleware/addon.items.find.js';
import '#database/events/middleware/item.crud.create.js';
import '#database/events/middleware/item.crud.update.js';
import '#database/events/middleware/item.crud.delete.js';

import '#database/items/commands/expose.js';

divhunt.DataSchema('filter', {
    field: ['string', null, true],
    value: ['string|number|boolean|array'],
    operator: ['string', 'EQUALS']
});

divhunt.DataSchema('join', {
    addon: ['string', null, true],
    field: ['string', null, true],
    output: ['string'],
    select: {
        type: 'array',
        each: {
            type: 'string'
        }
    }
});

divhunt.DataSchema('query', {
    filters: {
        type: 'array',
        each: {
            type: 'object',
            config: 'filter'
        }
    },
    page: ['number', 1],
    limit: ['number', 10],
    sort_field: ['string'],
    sort_direction: ['string', 'asc']
});

export default database;