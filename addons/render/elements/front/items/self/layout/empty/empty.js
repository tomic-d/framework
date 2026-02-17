import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'empty',
	icon: 'inbox',
	name: 'Empty',
	description: 'Empty state placeholder with icon, title, and message.',
	category: 'Layout',
	author: 'Divhunt',
	config: {
		icon: {
			type: 'string',
			value: 'inbox'
		},
		title: {
			type: 'string',
			value: 'No items found'
		},
		text: {
			type: 'string',
			value: 'Get started by creating your first item.'
		},
		variant: {
			type: 'array',
			value: ['size-m', 'bg-1', 'border'],
			options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'size-s', 'size-m', 'size-l']
		}
	},
	render: function()
	{
		return `
			<div class="holder" :variant="variant.join(' ')">
				<i dh-if="icon" class="icon">{{ icon }}</i>

				<div class="content">
					<div dh-if="title" class="title">{{ title }}</div>
					<div dh-if="text" class="text">{{ text }}</div>
					<slot></slot>
				</div>
			</div>
		`;
	}
});
