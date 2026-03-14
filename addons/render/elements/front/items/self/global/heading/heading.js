onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-heading',
		icon: 'title',
		name: 'Heading',
		description: 'Page heading with title and description.',
		category: 'Global',
		author: 'OneType',
		config: {
			icon: {
				type: 'string',
				value: ''
			},
			title: {
				type: 'string',
				value: 'Title'
			},
			description: {
				type: 'string',
				value: ''
			},
			variant: {
				type: 'array',
				value: ['left', 'size-m'],
				options: ['left', 'center', 'right', 'page', 'clean', 'size-s', 'size-m', 'size-l']
			}
		},
		render: function()
		{
			return `
				<div :class="'holder ' + variant.join(' ')">
					<div class="text">
						<i ot-if="icon" class="icon">{{ icon }}</i>
						<h2 ot-if="!variant.includes('page')" class="title">{{ title }}</h2>
						<h1 ot-if="variant.includes('page')" class="title">{{ title }}</h1>
						<p ot-if="description" class="description">{{ description }}</p>
					</div>
					<div class="right">
						<slot name="right"></slot>
					</div>
				</div>
			`;
		}
	});
});
