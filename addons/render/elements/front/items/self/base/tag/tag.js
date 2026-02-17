import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'tag',
	icon: 'label',
	name: 'Tag',
	description: 'Label/badge component with icon, color variants, sizes, and click handler support.',
	category: 'Base',
	author: 'Divhunt',
	config: {
		icon: {
			type: 'string',
			value: ''
		},
		text: {
			type: 'string',
			value: 'Tag'
		},
		variant: {
			type: 'array',
			value: ['bg-3', 'size-m'],
			options: ['transparent', 'border', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'brand', 'blue', 'red', 'orange', 'green', 'size-s', 'size-m', 'size-l']
		},
		onClick: {
			type: 'function'
		}
	},
	render: function()
	{
		return `
			<div class="holder" :variant="variant.join(' ')" dh-click="onClick">
				<i dh-if="icon">{{ icon }}</i>
				<span class="text">{{ text }}</span>
			</div>
		`;
	}
});
