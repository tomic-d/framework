onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-section',
		icon: 'view_agenda',
		name: 'Form Section',
		description: 'Form section with title and description, containing form fields.',
		category: 'Form',
		author: 'OneType',
		config: {
			title: {
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
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'size-s', 'size-m', 'size-l']
			}
		},
		render: function()
		{
			return `
				<div :class="'holder ' + variant.join(' ')">
					<div class="header">
						<h3 ot-if="title" class="title">{{ title }}</h3>
						<p ot-if="description" class="description">{{ description }}</p>
					</div>
					<div class="content">
						<slot name="content"></slot>
					</div>
				</div>
			`;
		}
	});
});
