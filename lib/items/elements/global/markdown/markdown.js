import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'markdown',
	icon: 'article',
	name: 'Markdown',
	description: 'Renders markdown content as styled HTML.',
	category: 'Global',
	author: 'OneType',
	config: {
		content: {
			type: 'string',
			value: ''
		}
	},
	render: function()
	{
		this.html = elements.Fn('markdown', this.content);

		return `<div class="holder">${this.html}</div>`;
	}
});
