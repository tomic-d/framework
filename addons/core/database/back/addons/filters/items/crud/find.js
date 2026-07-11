import onetype from '#framework/load.js';
import database from '#database/addon.js';
import crud from '#database/addons/crud/addon.js';
import filters from '../../addon.js';

const validation = {
	field: (field) => crud.Fn('validate.field', field),
	value: (value) => crud.Fn('validate.value', value),
	between: (value) => crud.Fn('validate.between', value)
};

function root(chain)
{
	chain.query.filters = chain.query.filters || { kind: 'group', type: 'AND', children: [] };
	chain.query.impossible = chain.query.impossible || false;
	return chain.query.filters;
}

function push(query, group, field, value, operator, type)
{
	const normalized = operator.toUpperCase();
	const item = filters.ItemGet(normalized);

	if(!item)
	{
		throw onetype.Error(400, 'Invalid operator: :1:.', normalized);
	}

	const filter = { kind: 'filter', field: database.Fn('column', query.addon, field), value, operator: normalized, type };
	const validate = item.Get('validate');

	if(validate && validate.call({}, filter, validation, query) === false)
	{
		return;
	}

	group.children.push(filter);
}

function scope(query, group, parent)
{
	const frame = {};

	frame.filter = (field, value, operator = 'EQUALS') => { push(query, group, field, value, operator, 'AND'); return frame; };
	frame.orFilter = (field, value, operator = 'EQUALS') => { push(query, group, field, value, operator, 'OR'); return frame; };
	frame.group = (type = 'AND') => { const child = { kind: 'group', type, children: [] }; group.children.push(child); return scope(query, child, frame); };
	frame.end = () => parent;

	return frame;
}

crud.Item({
	id: 'filter',
	type: ['find'],
	callback(chain, field, value, operator = 'EQUALS')
	{
		push(chain.query, root(chain), field, value, operator, 'AND');
		return chain;
	}
});

crud.Item({
	id: 'orFilter',
	type: ['find'],
	callback(chain, field, value, operator = 'EQUALS')
	{
		push(chain.query, root(chain), field, value, operator, 'OR');
		return chain;
	}
});

crud.Item({
	id: 'group',
	type: ['find'],
	callback(chain, type = 'AND')
	{
		const child = { kind: 'group', type, children: [] };
		root(chain).children.push(child);
		return scope(chain.query, child, chain);
	}
});
