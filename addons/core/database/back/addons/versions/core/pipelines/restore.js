import onetype from '#framework/load.js';
import database from '#database/addon.js';
import versions from '#database/addons/versions/addon.js';

onetype.Pipeline('database:versions:restore', {
	description: 'Restore every entity of an addon to its state at a version cutoff. Append-only, so the restore is itself undoable.',
	in: {
		connection: {
			type: 'string',
			value: 'primary',
			description: 'Connection id to restore on.'
		},
		addon: {
			type: 'string',
			required: true,
			description: 'Addon name whose entities to restore.'
		},
		version: {
			type: 'number',
			required: true,
			description: 'Version id cutoff to restore to.'
		}
	},
	out: {
		restored: {
			type: 'number',
			value: 0,
			description: 'Number of entities changed by the restore.'
		}
	}
})

.Join('connect', 10, {
	description: 'Resolve the connection and addon, ensure the addon is versioned.',
	out: {
		knex: {
			type: 'function|object',
			description: 'Live knex for the connection.'
		},
		target: {
			type: 'any',
			description: 'Resolved addon.'
		}
	},
	callback: function({ connection, addon }, resolve)
	{
		const knex = database.Fn('connection', connection);
		const target = onetype.AddonGet(addon);

		if(!target || !target.Versions())
		{
			return resolve(null, 'Addon "' + addon + '" has no versions configured.', 400);
		}

		return { knex, target };
	}
})

.Join('plan', 20, {
	description: 'Classify entities into those created after the cutoff (to soft-delete) and those alive at it (to fold back).',
	requires: ['knex', 'target'],
	out: {
		deletes: {
			type: 'array',
			value: [],
			description: 'Entity ids created after the cutoff, to soft-delete.',
			each: { type: 'number|string' }
		},
		folds: {
			type: 'array',
			value: [],
			description: 'Entity ids alive at the cutoff, to fold back to that state.',
			each: { type: 'number|string' }
		}
	},
	callback: async function({ knex, target, version })
	{
		const created = (filter) => knex('database_versions')
			.distinct('entity_id')
			.where({ addon: target.name, operation: 'create' })
			.whereNull('language')
			.modify(filter)
			.pluck('entity_id');

		const all = await created(() => {});
		const alive = new Set((await created((query) => query.where('id', '<=', version))).map(String));

		const deletes = [];
		const folds = [];

		for(const id of all)
		{
			(alive.has(String(id)) ? folds : deletes).push(id);
		}

		return { deletes, folds };
	}
})

.Join('apply', 30, {
	description: 'Soft-delete entities created after the cutoff and fold the rest back, in one transaction.',
	requires: ['knex', 'target'],
	out: {
		restored: {
			type: 'number',
			value: 0
		}
	},
	callback: async function({ knex, target, version, deletes, folds })
	{
		const table = target.Table().name;
		const config = target.Versions();
		const tracked = versions.Fn('get.tracked', target);
		const spread = database.Fn('spread', target);
		const declared = new Set(onetype.AddonGet('database.schema').Fn('parse', target.Schema()).columns.map((column) => column.name));

		return knex.transaction(async (transaction) =>
		{
			const stamp = () => new Date().toISOString();
			let restored = 0;

			const current = async (id) =>
			{
				const row = await transaction(table).where('id', id).first();
				return row ? database.Fn('cast', target, row) : null;
			};

			const remove = async (id) =>
			{
				const state = await current(id);

				if(!state || state[config.delete])
				{
					return false;
				}

				const now = stamp();
				const update = { [database.Fn('column', target, config.delete)]: now, ...(target.FieldGet('updated_at') ? { updated_at: now } : {}) };

				await transaction(table).where('id', id).update(update);
				await versions.Fn('apply.write', transaction, target, { entity: id, operation: 'update', changes: { [config.delete]: { old: null, new: now } } });

				return true;
			};

			const fold = async (id) =>
			{
				const row = await current(id);
				const folded = await versions.Fn('get.fold', transaction, target, id, version);

				if(!row || !folded)
				{
					return false;
				}

				const state = folded.state;
				const update = {};
				const changes = {};
				let bag = false;

				for(const field of [...tracked, config.delete])
				{
					const targetValue = state.hasOwnProperty(field) ? state[field] : null;
					const existing = row[field] instanceof Date ? row[field].toISOString() : (row[field] ?? null);
					const next = targetValue instanceof Date ? targetValue.toISOString() : targetValue;

					if(JSON.stringify(existing) !== JSON.stringify(next))
					{
						const column = database.Fn('column', target, field);
						const define = target.FieldGet(field)?.define;

						if(declared.has(column))
						{
							update[column] = database.Fn('serialize', targetValue, define ? onetype.DataParseConfig(define).type.split('|')[0] : 'string');
						}
						else
						{
							bag = true;
						}

						changes[field] = { old: existing, new: next };
					}
				}

				if(!Object.keys(changes).length)
				{
					return false;
				}

				/* column-less fields fold back through the spread column: rebuild the
				   whole bag from the folded state (current row fills the untracked) */
				if(bag && spread)
				{
					const document = {};

					for(const field of Object.values(target.Fields().data))
					{
						const parsed = onetype.DataParseConfig(field.define);

						if(parsed.virtual || parsed.metadata?.spread || declared.has(database.Fn('column', target, field.name)))
						{
							continue;
						}

						document[field.name] = state.hasOwnProperty(field.name) ? state[field.name] : (row[field.name] ?? null);
					}

					update[database.Fn('column', target, spread)] = JSON.stringify(document);
				}

				if(target.FieldGet('updated_at'))
				{
					update.updated_at = stamp();
				}

				await transaction(table).where('id', id).update(update);
				await versions.Fn('apply.write', transaction, target, { entity: id, operation: 'update', changes });

				return true;
			};

			for(const id of deletes)
			{
				if(await remove(id)) restored++;
			}

			for(const id of folds)
			{
				if(await fold(id)) restored++;
			}

			return { restored };
		});
	}
});
