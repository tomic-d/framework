import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'heading',
	icon: 'title',
	name: 'Heading',
	description: 'Heading component with alignment options (left, center, right), and size variants for different hierarchy levels.',
	category: 'Layout',
	author: 'Divhunt',
	config: {
		icon: {
			type: 'string',
			value: ''
		},
		color: {
			type: 'string',
			value: ''
		},
		title: {
			type: 'string',
			value: 'Heading Title'
		},
		description: {
			type: 'string',
			value: 'This is a description text that provides additional context and information about the heading above.'
		},
		variant: {
			type: 'array',
			value: ['align-left', 'size-m'],
			options: ['align-left', 'align-center', 'align-right', 'size-s', 'size-m', 'size-l']
		}
	},
	render: function()
	{
		return `
			<div class="holder" :variant="variant.join(' ')">
				<i dh-if="icon" :style="color ? 'color: ' + color : ''">{{ icon }}</i>
				<div class="content">
					<slot name="top"></slot>
					<h2>{{ title }}</h2>
					<p dh-if="description">{{ description }}</p>
					<slot name="bottom"></slot>
				</div>
			</div>
		`;
	}
});