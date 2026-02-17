import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'card-list',
	icon: 'list',
	name: 'Card List',
	description: 'List item card with icon, title, description, meta info, badge, status, and checkbox.',
	category: 'Cards',
	author: 'Divhunt',
	config: {
		icon: {
			type: 'string',
			value: 'description'
		},
		title: {
			type: 'string',
			value: 'Project Requirements.pdf'
		},
		description: {
			type: 'string',
			value: 'Technical specification document for Q1 release'
		},
		badge: {
			type: 'string',
			value: 'New'
		},
		status: {
			type: 'string',
			value: 'success',
			options: ['', 'success', 'warning', 'error', 'info']
		},
		meta: {
			type: 'array',
			value: [
				{ label: '2.4 MB', icon: '' },
				{ label: 'Modified 2h ago', icon: 'schedule' }
			],
			each: {
				type: 'object',
				config: {
					label: { type: 'string', value: '' },
					icon: { type: 'string', value: '' }
				}
			}
		},
		checkbox: {
			type: 'boolean',
			value: false
		},
		checked: {
			type: 'boolean',
			value: false
		},
		variant: {
			type: 'array',
			value: ['bg-2', 'border', 'size-m'],
			options: ['border', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'brand', 'blue', 'red', 'orange', 'green', 'size-s', 'size-m', 'size-l']
		},
		onClick: {
			type: 'function'
		},
		onCheck: {
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

		this.handleCheck = (e) =>
		{
			e.stopPropagation();
			this.checked = !this.checked;

			if (this.onCheck)
			{
				this.onCheck({ checked: this.checked });
			}
		};

		return `
			<div class="holder" :variant="variant.join(' ')" dh-click="handleClick">
				<e-checkbox dh-if="checkbox" :checked="checked" :onChange="handleCheck"></e-checkbox>
				<i dh-if="icon && !checkbox" :status="status">{{ icon }}</i>
				<div class="content">
					<div class="header">
						<strong>{{ title }}</strong>
						<e-tag dh-if="badge" :text="badge" :variant="['brand', 'size-s']"></e-tag>
					</div>
					<span dh-if="description">{{ description }}</span>
					<div dh-if="meta.length" class="meta">
						<small dh-for="item in meta">
							<i dh-if="item.icon">{{ item.icon }}</i>
							{{ item.label }}
						</small>
					</div>
				</div>
				<slot name="end"></slot>
			</div>
		`;
	}
});
