import onetype from '#framework/load.js';
import sync from '#database/addons/sync/addon.js';

sync.Fn('get.columns', function(addon)
{
	this.methods.reference = (relation) =>
	{
		const target = onetype.AddonGet(relation.addon);

		if(!target)
		{
			throw onetype.Error(400, 'Relation :field: on table :table: targets unknown addon :addon:.', { field: relation.field, table: addon.Table().name, addon: relation.addon });
		}

		const primary = target.Sync().primary;
		const field = target.FieldGet(relation.column);
		const parsed = field ? onetype.DataParseConfig(field.define) : { type: 'number' };
		const metadata = parsed.metadata || {};

		return {
			type: primary.auto ? 'number' : parsed.type,
			cast: metadata.cast,
			length: metadata.length,
			unsigned: primary.auto
		};
	};

	const columns = [];
	const config = addon.Sync();
	const primary = config.primary;
	const composite = primary.fields.length > 1;
	const keyed = new Set([...config.index.flat(), ...config.unique.flat(), ...primary.fields]);
	const relations = {};

	config.relations.forEach((relation) => relations[relation.field] = relation);

	Object.values(addon.Fields().data).forEach((field) =>
	{
		const parsed = onetype.DataParseConfig(field.define);

		if(parsed.virtual)
		{
			return;
		}

		if(parsed.type.includes('|'))
		{
			throw onetype.Error(400, 'Field :field: on table :table: has union type :type:; a column needs one type.', { field: field.name, table: addon.Table().name, type: parsed.type });
		}

		const metadata = parsed.metadata || {};
		const reference = relations[field.name] ? this.methods.reference(relations[field.name]) : null;

		columns.push({
			name: field.name,
			type: reference ? reference.type : parsed.type,
			cast: reference ? reference.cast : metadata.cast,
			length: reference ? reference.length : metadata.length,
			precision: metadata.precision,
			scale: metadata.scale,
			unsigned: reference ? reference.unsigned : false,
			value: parsed.value,
			required: parsed.required === true,
			primary: !composite && field.name === primary.fields[0],
			auto: !composite && field.name === primary.fields[0] && primary.auto,
			bounded: keyed.has(field.name)
		});
	});

	return columns;
});
