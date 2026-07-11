import filters from '../addon.js';

/* Build the knex WHERE clause from a filter tree by dispatching each filter to its
   operator item. No hardcoded operator list: a plugin adds an operator with one
   item. build runs synchronously inside the knex callback. */

filters.Fn('build', function(knex, root)
{
	if(!root || !root.children || !root.children.length)
	{
		return;
	}

	function apply(query, filter, index)
	{
		const method = index === 0 ? 'where' : (filter.type === 'OR' ? 'orWhere' : 'where');
		const item = filters.ItemGet(filter.operator);

		item.Get('build').call({}, query, method, filter);
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
