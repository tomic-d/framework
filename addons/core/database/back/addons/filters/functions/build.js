import filters from '../addon.js';

/* Build the knex WHERE clause from a filter tree by dispatching each filter to its
   operator item (database.operators). No hardcoded operator list: a plugin adds an
   operator with one item. build runs synchronously inside the knex callback, so any
   dialect handler the operators need is resolved once up front via their resolve
   hook into a shared helpers object. */

filters.Fn('build', async function(knex, root)
{
	if(!root || !root.children || !root.children.length)
	{
		return;
	}

	const helpers = {};
	const resolved = new Set();

	const prepare = async (group) =>
	{
		for(const child of group.children)
		{
			if(child.kind === 'filter')
			{
				if(resolved.has(child.operator))
				{
					continue;
				}

				resolved.add(child.operator);

				const item = filters.ItemGet(child.operator);
				const resolve = item ? item.Get('resolve') : null;

				if(resolve)
				{
					await resolve(knex, helpers);
				}
			}
			else
			{
				await prepare(child);
			}
		}
	};

	await prepare(root);

	function apply(query, filter, index)
	{
		const method = index === 0 ? 'where' : (filter.type === 'OR' ? 'orWhere' : 'where');
		const item = filters.ItemGet(filter.operator);

		item.Get('build').call({}, query, method, filter, helpers);
	}

	function walk(group, query, index)
	{
		if(!group.children.length)
		{
			return;
		}

		const method = index === 0 ? 'where' : (group.type === 'OR' ? 'orWhere' : 'where');

		query[method](function()
		{
			group.children.forEach((child, childIndex) =>
			{
				if(child.kind === 'filter')
				{
					apply(this, child, childIndex);
				}
				else
				{
					walk(child, this, childIndex);
				}
			});
		});
	}

	walk(root, knex, 0);
});
