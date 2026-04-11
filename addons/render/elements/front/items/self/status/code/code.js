onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'status-code',
		icon: 'explore_off',
		name: 'Code',
		description: 'Full-page status code with large number, message, and action button.',
		category: 'Status',
		author: 'OneType',
		config: {
			code: {
				type: 'string',
				value: '404'
			},
			title: {
				type: 'string',
				value: 'Page not found'
			},
			description: {
				type: 'string',
				value: "The page you're looking for doesn't exist or has been moved."
			},
			action: {
				type: 'string',
				value: 'Go Home'
			},
			href: {
				type: 'string',
				value: '/'
			},
			variant: {
				type: 'array',
				value: ['size-m'],
				options: ['brand', 'blue', 'red', 'orange', 'green', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'size-s', 'size-m', 'size-l']
			}
		},
		render: function()
		{
			return /* html */ `
				<div :class="'holder ' + variant.join(' ')">
					<span class="code">{{ code }}</span>
					<h2 ot-if="title" class="title">{{ title }}</h2>
					<p ot-if="description" class="description">{{ description }}</p>
					<e-form-button
						ot-if="action"
						:text="action"
						icon="home"
						:variant="['brand', 'size-m']"
						:href="href"
					></e-form-button>
				</div>
			`;
		}
	});
});
