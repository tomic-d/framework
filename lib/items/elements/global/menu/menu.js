onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-menu',
		icon: 'menu',
		name: 'Menu',
		description: 'Multi-level menu with icons, shortcuts, headers and separators.',
		category: 'Global',
		author: 'OneType',
		config: {
			items: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						type: { type: 'string', value: 'action', options: ['action', 'separator', 'header'] },
						icon: { type: 'string', value: '' },
						label: { type: 'string', value: '' },
						value: { type: 'string', value: '' },
						shortcut: { type: 'string', value: '' },
						disabled: { type: 'boolean', value: false },
						items: { type: 'array', value: [] }
					}
				}
			},
			depth: {
				type: 'number',
				value: 0
			},
			variant: {
				type: 'array',
				value: ['bg-2', 'size-m'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'size-s', 'size-m', 'size-l']
			},
			_select: {
				type: 'function'
			}
		},
		render: function()
		{
			this.opened = {};

			this.toggle = (index) =>
			{
				this.opened[index] = !this.opened[index];
				this.Update();
			};

			this.isOpen = (index) =>
			{
				return !!this.opened[index];
			};

			this.select = (item) =>
			{
				if (item.disabled)
				{
					return;
				}

				if (this._select)
				{
					this._select(item.value || item.label);
				}
			};

			this.hasChildren = (item) =>
			{
				return item.items && item.items.length > 0;
			};

			const items = `
				<div ot-for="item, index in items" :class="'entry ' + item.type + (item.disabled ? ' disabled' : '') + (hasChildren(item) ? ' parent' : '') + (isOpen(index) ? ' open' : '')">
					<div ot-if="item.type === 'separator'" class="separator"></div>
					<div ot-if="item.type === 'header'" class="header">{{ item.label }}</div>
					<div ot-if="item.type === 'action' && hasChildren(item)" class="content" ot-click="toggle(index)">
						<i ot-if="item.icon" class="icon">{{ item.icon }}</i>
						<span class="label">{{ item.label }}</span>
						<i class="arrow">{{ isOpen(index) ? 'expand_less' : 'expand_more' }}</i>
					</div>
					<div ot-if="item.type === 'action' && !hasChildren(item)" class="content" ot-click="select(item)">
						<i ot-if="item.icon" class="icon">{{ item.icon }}</i>
						<span class="label">{{ item.label }}</span>
						<span ot-if="item.shortcut" class="shortcut">{{ item.shortcut }}</span>
					</div>
					<e-global-menu ot-if="hasChildren(item) && isOpen(index)" :items="item.items" :depth="depth + 1" :_select="_select" :style="'--depth: ' + (depth + 1)"></e-global-menu>
				</div>
			`;

			if (this.depth > 0)
			{
				return items;
			}

			return `
				<div :class="'holder ' + variant.join(' ')">
					${items}
				</div>
			`;
		}
	});
});
