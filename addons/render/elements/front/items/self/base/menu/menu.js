import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'menu',
	icon: 'list',
	name: 'Menu',
	description: 'Menu item with icon, label, badge, expandable children, and nested level support.',
	category: 'Navigation',
	author: 'Divhunt',
	config: {
		icon: {
			type: 'string',
			value: 'folder'
		},
		label: {
			type: 'string',
			value: 'Dashboard'
		},
		badge: {
			type: 'string',
			value: ''
		},
		href: {
			type: 'string',
			value: '#'
		},
		level: {
			type: 'number',
			value: 0
		},
		active: {
			type: 'boolean',
			value: false
		},
		expanded: {
			type: 'boolean',
			value: false
		},
		expandable: {
			type: 'boolean',
			value: false
		},
		disabled: {
			type: 'boolean',
			value: false
		},
		variant: {
			type: 'array',
			value: ['size-m'],
			options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'brand', 'blue', 'red', 'orange', 'green', 'size-s', 'size-m', 'size-l']
		},
		onClick: {
			type: 'function'
		},
		onExpand: {
			type: 'function'
		}
	},
	render: function()
	{
		this.handleClick = () =>
		{
			if (this.disabled) return;

			if (this.onClick)
			{
				this.onClick();
			}
		};

		this.handleExpand = (e) =>
		{
			e.preventDefault();
			e.stopPropagation();

			if (this.disabled) return;

			this.expanded = !this.expanded;

			if (this.onExpand)
			{
				this.onExpand({ expanded: this.expanded });
			}
		};

		return `
			<a :href="href" class="holder" :variant="variant.join(' ')" :level="level" :active="active" :expanded="expanded" :disabled="disabled" dh-click="handleClick">
				<i dh-if="expandable" class="chevron" dh-click="handleExpand">chevron_right</i>
				<i dh-if="icon">{{ icon }}</i>
				<span>{{ label }}</span>
				<e-tag dh-if="badge" :text="badge" :variant="['bg-3', 'size-s']"></e-tag>
				<slot name="end"></slot>
			</a>
		`;
	}
});
