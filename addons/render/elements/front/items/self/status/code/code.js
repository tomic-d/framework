onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'status-code',
		icon: 'explore_off',
		name: 'Code',
		description: 'Full-page status code with large number, message and action button.',
		category: 'Status',
		config:
		{
			code:
			{
				type: 'string',
				value: '404',
				description: 'Status code number.'
			},
			title:
			{
				type: 'string',
				value: 'Page not found',
				description: 'Heading below the code.'
			},
			description:
			{
				type: 'string',
				value: "The page you're looking for doesn't exist or has been moved.",
				description: 'Paragraph below the title.'
			},
			action:
			{
				type: 'string',
				value: 'Go Home',
				description: 'Button label. Empty hides button.'
			},
			href:
			{
				type: 'string',
				value: '/',
				description: 'Button link target.'
			},
			color:
			{
				type: 'string',
				value: '',
				options: ['', 'brand', 'blue', 'red', 'orange', 'green'],
				description: 'Code number gradient accent.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Overall scale.'
			}
		},
		render: function()
		{
			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', 'size-' + this.size];

				if(this.color)
				{
					list.push(this.color);
				}

				return list.join(' ');
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<span class="code">{{ code }}</span>
					<h2 ot-if="title" class="title">{{ title }}</h2>
					<p ot-if="description" class="description">{{ description }}</p>
					<e-form-button
						ot-if="action"
						:text="action"
						icon="home"
						color="brand"
						:href="href"
					></e-form-button>
				</div>
			`;
		}
	});
});
