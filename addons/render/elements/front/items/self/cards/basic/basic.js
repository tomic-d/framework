import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'card-basic',
	icon: 'crop_square',
	name: 'Card Basic',
	description: 'Base card with icon, title, description, badge, and action buttons.',
	category: 'Cards',
	author: 'Divhunt',
	config: {
		icon: {
			type: 'string',
			value: 'folder'
		},
		title: {
			type: 'string',
			value: 'Project Alpha'
		},
		description: {
			type: 'string',
			value: 'A comprehensive project management solution for modern teams.'
		},
		badge: {
			type: 'string',
			value: 'Active'
		},
		actions: {
			type: 'array',
			value: [
				{ text: 'Edit', icon: 'edit', variant: ['border', 'size-s'] },
				{ text: 'Delete', icon: 'delete', variant: ['border', 'size-s'] }
			],
			each: {
				type: 'object',
				config: {
					text: { type: 'string', value: '' },
					icon: { type: 'string', value: '' },
					variant: { type: 'array', value: ['border', 'size-s'] }
				}
			}
		},
		variant: {
			type: 'array',
			value: ['bg-2', 'border', 'size-m'],
			options: ['border', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'brand', 'blue', 'red', 'orange', 'green', 'size-s', 'size-m', 'size-l']
		},
		onClick: {
			type: 'function'
		},
		onAction: {
			type: 'function'
		}
	},
	render: function()
	{
		this.handleClick = () =>
		{
			if (this.onClick)
			{
				this.onClick();
			}
		};

		this.handleAction = (action, index) =>
		{
			if (this.onAction)
			{
				this.onAction({ action, index });
			}
		};

		return `
			<div class="holder" :variant="variant.join(' ')" dh-click="handleClick">
				<div class="header">
					<i dh-if="icon">{{ icon }}</i>
					<e-tag dh-if="badge" :text="badge" :variant="['bg-3', 'size-s']"></e-tag>
				</div>
				<div class="content">
					<h3 dh-if="title">{{ title }}</h3>
					<p dh-if="description">{{ description }}</p>
				</div>
				<div dh-if="actions.length" class="actions">
					<e-button dh-for="action, index in actions" :text="action.text" :icon="action.icon" :variant="action.variant" :onClick="() => handleAction(action, index)"></e-button>
				</div>
				<slot name="footer"></slot>
			</div>
		`;
	}
});
