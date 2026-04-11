onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-menu',
		icon: 'menu',
		name: 'Menu',
		description: 'Premium menu with icons, descriptions, shortcuts, badges, nested items and multiple styles.',
		category: 'Global',
		author: 'OneType',
		config: {
			items: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						type: { type: 'string', value: 'action', options: ['action', 'link', 'separator', 'header'] },
						id: { type: 'string' },
						label: { type: 'string' },
						description: { type: 'string' },
						icon: { type: 'string' },
						iconRight: { type: 'string' },
						shortcut: { type: 'string' },
						badge: { type: 'string|number' },
						value: { type: 'string' },
						href: { type: 'string' },
						target: { type: 'string' },
						active: { type: 'boolean' },
						disabled: { type: 'boolean' },
						danger: { type: 'boolean' },
						color: { type: 'string', options: ['brand', 'blue', 'red', 'orange', 'green'] },
						items: { type: 'array' }
					}
				}
			},
			depth: {
				type: 'number',
				value: 0
			},
			variant: {
				type: 'array',
				value: ['default', 'size-m'],
				options: ['default', 'contextual', 'flush', 'bordered', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'size-s', 'size-m', 'size-l']
			},
			_select: {
				type: 'function'
			}
		},
		render: function()
		{
			const styles = ['default', 'contextual', 'flush', 'bordered'];
			const hasStyle = this.variant.some(v => styles.includes(v));

			if(!hasStyle)
			{
				this.variant = ['default', ...this.variant];
			}

			this.opened = {};

			this.hasChildren = (item) =>
			{
				return item.items && item.items.length > 0;
			};

			this.isOpen = (id) =>
			{
				return !!this.opened[id];
			};

			this.toggle = (item, event) =>
			{
				if(item.disabled)
				{
					return;
				}

				this.opened[item.id || item.label] = !this.opened[item.id || item.label];
				this.Update();
			};

			this.select = (item, event) =>
			{
				if(item.disabled)
				{
					return;
				}

				if(this.hasChildren(item))
				{
					this.toggle(item, event);
					return;
				}

				if(this._select)
				{
					this._select({ event, value: item.value || item.id || item.label });
				}
			};

			return /* html */ `
				<div :class="'holder ' + variant.join(' ')">
					<div
						ot-for="item in items"
						:class="'entry ' + item.type + (item.disabled ? ' disabled' : '') + (item.active ? ' active' : '') + (item.danger ? ' danger' : '') + (item.color ? ' color-' + item.color : '') + (hasChildren(item) ? ' parent' : '') + (isOpen(item.id || item.label) ? ' open' : '')"
					>
						<div ot-if="item.type === 'separator'" class="separator"></div>

						<div ot-if="item.type === 'header'" class="header">{{ item.label }}</div>

						<a
							ot-if="(item.type === 'action' || item.type === 'link') && !hasChildren(item)"
							:href="item.href || 'javascript:void(0)'"
							:target="item.target"
							class="content"
							ot-click="(event) => select(item, event)"
						>
							<i ot-if="item.icon" class="icon">{{ item.icon }}</i>
							<div class="text">
								<span class="label">{{ item.label }}</span>
								<span ot-if="item.description" class="description">{{ item.description }}</span>
							</div>
							<span ot-if="item.badge" class="badge">{{ item.badge }}</span>
							<span ot-if="item.shortcut" class="shortcut">{{ item.shortcut }}</span>
							<i ot-if="item.iconRight" class="icon-right">{{ item.iconRight }}</i>
						</a>

						<button
							ot-if="item.type === 'action' && hasChildren(item)"
							type="button"
							class="content"
							ot-click="(event) => toggle(item, event)"
						>
							<i ot-if="item.icon" class="icon">{{ item.icon }}</i>
							<div class="text">
								<span class="label">{{ item.label }}</span>
								<span ot-if="item.description" class="description">{{ item.description }}</span>
							</div>
							<span ot-if="item.badge" class="badge">{{ item.badge }}</span>
							<i class="arrow">expand_more</i>
						</button>

						<div ot-if="hasChildren(item) && isOpen(item.id || item.label)" class="submenu">
							<e-global-menu :items="item.items" :depth="depth + 1" :_select="_select" :variant="['flush', 'size-' + (variant.find(v => v.startsWith('size-')) || 'size-m').replace('size-', '')]"></e-global-menu>
						</div>
					</div>
				</div>
			`;
		}
	});
});
