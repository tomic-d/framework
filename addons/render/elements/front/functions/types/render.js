elements.Fn('type.render', function(column, item)
{
	if(column.render)
	{
		return column.render(item, column);
	}

	const type = column.type || 'text';

	if(elements.FnGet('type.' + type))
	{
		return elements.Fn('type.' + type, column, item);
	}

	return elements.Fn('type.text', column, item);
});