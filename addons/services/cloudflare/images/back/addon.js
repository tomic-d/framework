import onetype from '#framework/load.js';

const images = onetype.Addon('cloudflare.images', (addon) =>
{
	addon.Table('cloudflare_images');

	addon.Field('id', ['string']);
	addon.Field('team_id', ['string', null, true]);
	addon.Field('metadata', ['object', {}]);
	addon.Field('cloudflare_id', ['string', null, true]);
	addon.Field('filename', ['string', null, true]);
	addon.Field('url', ['string']);
	addon.Field('variants', ['object', {}]);
	addon.Field('alt', ['string']);
	addon.Field('size', ['number']);
	addon.Field('type', ['string']);
	addon.Field('width', ['number']);
	addon.Field('height', ['number']);
	addon.Field('updated_at', ['string']);
	addon.Field('created_at', ['string']);
});

export default images;
