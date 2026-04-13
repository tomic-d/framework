import onetype from '#framework/load.js';

import '#database/events/addon.init.js';
import '#database/events/addon.item.init.js';

import database from '#database/addon.js';

import '#database/functions/items/find.js';
import '#database/functions/item/create.js';
import '#database/functions/item/update.js';
import '#database/functions/item/delete.js';
import '#database/functions/item/save.js';

import '#database/functions/items/filter.js';
import '#database/functions/items/filters.js';
import '#database/functions/items/methods.js';
import '#database/functions/items/builder.js';
import '#database/functions/items/validation.js';

import '#database/functions/items/methods/query.js';
import '#database/functions/items/transform/join.js';
import '#database/functions/items/transform/translate.js';
import '#database/functions/items/methods/many.js';
import '#database/functions/items/methods/one.js';
import '#database/functions/items/methods/count.js';
import '#database/functions/items/methods/plain.js';
import '#database/functions/items/methods/exists.js';
import '#database/functions/items/methods/aggregate.js';

import '#database/item/catch/add.js';

import '#database/items/commands/find.js';
import '#database/items/commands/create.js';
import '#database/items/commands/update.js';
import '#database/items/commands/delete.js';
import '#database/items/commands/batch.js';

onetype.DataSchema('filter', {
    field: ['string', null, true],
    value: ['string|number|boolean|array'],
    operator: ['string', 'EQUALS']
});

onetype.DataSchema('join', {
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

onetype.DataSchema('query', {
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