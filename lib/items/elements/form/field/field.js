onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-field',
		icon: 'space_dashboard',
		name: 'Form Field',
		description: 'Form field row with label and description on left, input slot on right.',
		category: 'Form',
		author: 'OneType',
		config: {
			label: {
				type: 'string',
				value: ''
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
				<div :class="'holder ' + variant.join(' ')">
					<div class="info">
						<label ot-if="label" class="label">{{ label }}</label>
						<p ot-if="description" class="description">{{ description }}</p>
					</div>
					<div class="input">
						<slot name="input"></slot>
					</div>
				</div>
			`;
		}
	});
});
