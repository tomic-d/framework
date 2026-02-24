onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-card',
		icon: 'crop_square',
		name: 'Card',
		description: 'Reusable card with icon, title, description, and optional link.',
		category: 'Global',
		author: 'OneType',
		config: {
			icon: {
				type: 'string',
				value: ''
			},
			title: {
				type: 'string',
				value: ''
			},
			description: {
				type: 'string',
				value: ''
			},
			href: {
				type: 'string',
				value: ''
			},
			target: {
				type: 'string',
				value: ''
			}
		},
		render: function()
		{
			const content = `
				<i ot-if="icon" class="icon">{{ icon }}</i>
				<h3 class="title">{{ title }}</h3>
				<p ot-if="description" class="description">{{ description }}</p>
			`;

			if(this.href)
			{
				return `<a class="holder link" :href="href" :target="target">${content}</a>`;
			}

			return `<div class="holder">${content}</div>`;
		}
	});
});
