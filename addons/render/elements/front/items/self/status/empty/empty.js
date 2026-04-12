onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'status-empty',
		icon: 'inbox',
		name: 'Empty',
		description: 'Empty state with icon, title, description and optional action button.',
		category: 'Status',
		config:
		{
			icon:
			{
				type: 'string',
				value: 'inbox',
				description: 'Center icon.'
			},
			title:
			{
				type: 'string',
				value: 'Nothing here yet',
				description: 'Heading text.'
			},
			description:
			{
				type: 'string',
				value: '',
				description: 'Supporting message.'
			},
			action:
			{
				type: 'string',
				value: '',
				description: 'Action button label.'
			},
			color:
			{
				type: 'string',
				value: 'brand',
				options: ['brand', 'blue', 'red', 'orange', 'green'],
				description: 'Icon circle accent color.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Component size.'
			},
			_click:
			{
				type: 'function',
				description: 'Action button click handler.'
			}
		},
		render: function()
		{
			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.color, 'size-' + this.size];

				return list.join(' ');
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<div class="circle"><i>{{ icon }}</i></div>
					<h2 ot-if="title" class="title">{{ title }}</h2>
					<p ot-if="description" class="description">{{ description }}</p>
					<e-form-button
						ot-if="action"
						:text="action"
						icon="add"
						color="brand"
						:_click="_click"
					></e-form-button>
				</div>
			`;
		}
	});
});
