pages.Fn('item.render', function(item, parameters = {}, data = null)
{
	const grid = item.Get('grid');
	const element = document.createElement('div');

	element.classList.add('dh-page');
	element.setAttribute('data-page', item.Get('id'));
	element.style.cssText = [
		`grid-template-areas: ${grid.template}`,
		`grid-template-columns: ${grid.columns}`,
		`grid-template-rows: ${grid.rows}`,
		`gap: ${grid.gap}`
	].join('; ');

	const template = grid.template;
	const areas = [...new Set(template.match(/[\w-]+/g) || [])];

	areas.forEach(name =>
	{
		const container = document.createElement('div');

		container.classList.add('dh-page-area');
		container.setAttribute('data-area', name);
		container.style.gridArea = name;

		const render = pages.Render(item.Get('id') + ':' + name, {parameters, data});

		container.appendChild(render.Element);
		element.appendChild(container);
	});

	return element;
});
