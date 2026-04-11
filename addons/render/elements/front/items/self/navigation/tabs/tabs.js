onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'navigation-tabs',
		icon: 'tab',
		name: 'Tabs',
		description: 'Tabbed navigation with multiple styles, icons, counts, and optional content panels.',
		category: 'Navigation',
		author: 'OneType',
		config: {
			items: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						id: { type: 'string' },
						label: { type: 'string' },
						icon: { type: 'string' },
						count: { type: 'string|number' },
						href: { type: 'string' },
						target: { type: 'string' },
						disabled: { type: 'boolean' },
						content: { type: 'string' }
					}
				}
			},
			active: {
				type: 'string'
			},
			variant: {
				type: 'array',
				value: ['underline', 'size-m'],
				options: ['underline', 'pills', 'contained', 'segmented', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'size-s', 'size-m', 'size-l', 'stretch']
			},
			_change: {
				type: 'function'
			}
		},
		render: function()
		{
			if(!this.active && this.items.length)
			{
				this.active = this.items[0].id;
			}

			const styles = ['underline', 'pills', 'contained', 'segmented'];
			const hasStyle = this.variant.some(v => styles.includes(v));

			if(!hasStyle)
			{
				this.variant = ['underline', ...this.variant];
			}

			this.hasContent = this.items.some(item => item.content);

			this.select = (item, event) =>
			{
				if(item.disabled)
				{
					return;
				}

				this.active = item.id;

				if(this._change)
				{
					this._change({ event, value: item.id });
				}
			};

			this.panels = this.items
				.filter(item => item.content)
				.map(item =>
				{
					return '<div class="panel' + (this.active === item.id ? ' active' : '') + '" data-panel="' + item.id + '">' + item.content + '</div>';
				})
				.join('');

			return /* html */ `
				<div :class="'holder ' + variant.join(' ')">
					<nav class="tabs">
						<a
							ot-for="item in items"
							:class="'tab' + (active === item.id ? ' active' : '') + (item.disabled ? ' disabled' : '')"
							:href="item.href || 'javascript:void(0)'"
							:target="item.target"
							ot-click="(event) => select(item, event)"
						>
							<i ot-if="item.icon">{{ item.icon }}</i>
							<span ot-if="item.label" class="label">{{ item.label }}</span>
							<span ot-if="item.count != null" class="count">{{ item.count }}</span>
						</a>
					</nav>
					<div ot-if="hasContent" class="content">
						<span ot-html="panels"></span>
					</div>
				</div>
			`;
		}
	});
});
