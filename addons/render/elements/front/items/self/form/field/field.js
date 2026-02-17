import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'form-field',
	icon: 'space_dashboard',
	name: 'Form Field',
	description: 'Form field row with label and description on left, input slot on right.',
	category: 'Form',
	author: 'Divhunt',
	config: {
		label: {
			type: 'string',
			value: 'Field Label'
		},
		description: {
			type: 'string',
			value: ''
		},
		variant: {
			type: 'array',
			value: [],
			options: ['border-bottom', 'size-s', 'size-m', 'size-l']
		}
	},
	render: function()
	{
		return `
			<div class="holder" :variant="variant.join(' ')">
				<div class="info">
					<label dh-if="label">{{ label }}</label>
					<p dh-if="description">{{ description }}</p>
				</div>
				<div class="input">
					<slot name="input"></slot>
				</div>
			</div>
		`;
	}
});
