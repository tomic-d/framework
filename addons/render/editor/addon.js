const editor = onetype.Addon('editor', (addon) =>
{
	addon.Field('id', ['string']);
	addon.Field('icon', ['string', 'edit_note']);
	addon.Field('name', ['string', '']);
	addon.Field('category', ['string', '']);
	addon.Field('editable', ['boolean', false]);
	addon.Field('children', ['boolean', false]);
	addon.Field('config', ['object', {}]);
	addon.Field('insert', ['function']);
	addon.Field('update', ['function']);
	addon.Field('remove', ['function']);
});
