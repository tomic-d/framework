// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import divhunt from '#framework/load.js';

const assets = divhunt.Addon('assets', (addon) =>
{
    addon.Field('id', ['number']);
    addon.Field('order', ['number']);
    addon.Field('path', ['string']);
    addon.Field('content', ['string|function']);
    addon.Field('type', ['string']);
    addon.Field('ignore', ['array', []]);
});

export default assets;