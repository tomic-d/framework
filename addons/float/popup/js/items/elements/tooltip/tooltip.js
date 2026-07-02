onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'popup-tooltip',
		icon: 'info',
		name: 'Tooltip',
		description: 'Compact floating hint with optional icon, title and tone.',
		category: 'Float',
		author: 'OneType',
		config: {
			config: {
				type: 'object',
				value: {},
				config: {
					text: {
						type: 'string',
						description: 'Tooltip text.'
					},
					title: {
						type: 'string',
						description: 'Bold line above the text.'
					},
					icon: {
						type: 'string',
						description: 'Material icon name.'
					},
					variant: {
						type: 'string',
						value: 'default',
						options: ['default', 'info', 'success', 'warning', 'error'],
						description: 'Tone of the tooltip, colors the icon.'
					}
				},
				description: 'Tooltip content.'
			}
		},
		render: function()
		{
			this.Compute(() =>
			{
				this.text = this.config.text || '';
				this.title = this.config.title || '';
				this.icon = this.config.icon || '';
				this.variant = this.config.variant || 'default';
			});

			return `
				<div :class="'box ' + variant">
					<i ot-if="icon" class="icon">{{ icon }}</i>
					<div class="content">
						<div ot-if="title" class="title">{{ title }}</div>
						<div ot-if="text" class="text">{{ text }}</div>
					</div>
				</div>
			`;
		}
	});
});
