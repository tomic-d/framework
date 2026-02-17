import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'form-section',
	icon: 'view_agenda',
	name: 'Form Section',
	description: 'Form section with title and description, containing form fields.',
	category: 'Form',
	author: 'Divhunt',
	config: {
		title: {
			type: 'string',
			value: 'Section Title'
		},
		description: {
			type: 'string',
			value: ''
		},
		variant: {
			type: 'array',
			value: [],
			options: ['border', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'size-s', 'size-m', 'size-l']
		}
	},
	render: function()
	{
		return `
			<div class="holder" :variant="variant.join(' ')">
				<div class="header">
					<h3 dh-if="title">{{ title }}</h3>
					<p dh-if="description">{{ description }}</p>
				</div>
				<div class="content">
					<slot name="content"></slot>
				</div>
			</div>
		`;
	}
});
