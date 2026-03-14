onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-markdown',
		icon: 'article',
		name: 'Markdown',
		description: 'Renders markdown content as styled HTML.',
		category: 'Global',
		author: 'OneType',
		config: {
			content: {
				type: 'string',
				value: ''
			},
			variant: {
				type: 'array',
				value: [],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border']
			}
		},
		render: function()
		{
			return `<div :class="'holder ' + variant.join(' ')">${onetype.Markdown(this.content)}</div>`;
		}
	});
});
