onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'cards-item',
		icon: 'dashboard',
		name: 'Item Card',
		description: 'Generic premium card — cover, icon, badge, title, description, stats, meta, tags, action, href. Vertical or horizontal.',
		category: 'Cards',
		author: 'OneType',
		config: {
			cover: {
				type: 'string'
			},
			coverIcon: {
				type: 'string'
			},
			icon: {
				type: 'string'
			},
			iconVariant: {
				type: 'array',
				value: ['bg-2'],
				options: ['brand', 'blue', 'red', 'orange', 'green', 'bg-1', 'bg-2', 'bg-3', 'bg-4']
			},
			badge: {
				type: 'string'
			},
			badgeVariant: {
				type: 'array',
				value: ['brand'],
				options: ['brand', 'blue', 'red', 'orange', 'green', 'bg-2', 'bg-3']
			},
			eyebrow: {
				type: 'string'
			},
			title: {
				type: 'string'
			},
			description: {
				type: 'string'
			},
			value: {
				type: 'string|number'
			},
			delta: {
				type: 'string'
			},
			deltaDirection: {
				type: 'string',
				value: 'neutral',
				options: ['up', 'down', 'neutral']
			},
			meta: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						icon: { type: 'string' },
						label: { type: 'string' }
					}
				}
			},
			tags: {
				type: 'array',
				value: [],
				each: { type: 'string' }
			},
			action: {
				type: 'string'
			},
			actionIcon: {
				type: 'string'
			},
			actionVariant: {
				type: 'array',
				value: ['ghost', 'size-s']
			},
			href: {
				type: 'string'
			},
			target: {
				type: 'string'
			},
			orientation: {
				type: 'string',
				value: 'vertical',
				options: ['vertical', 'horizontal']
			},
			align: {
				type: 'string',
				value: 'left',
				options: ['left', 'center']
			},
			loading: {
				type: 'boolean'
			},
			disabled: {
				type: 'boolean'
			},
			active: {
				type: 'boolean'
			},
			variant: {
				type: 'array',
				value: ['bg-1', 'border', 'size-m'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'glass', 'gradient', 'hover-lift', 'size-s', 'size-m', 'size-l']
			},
			_click: {
				type: 'function'
			}
		},
		render: function()
		{
			this.hasCover = !!this.cover || !!this.coverIcon;
			this.hasHeader = !!this.icon || !!this.eyebrow || !!this.title || !!this.description || !!this.badge;
			this.hasStats = this.value !== undefined && this.value !== '' && this.value !== null;
			this.hasMeta = this.meta && this.meta.length > 0;
			this.hasTags = this.tags && this.tags.length > 0;
			this.hasAction = !!this.action;
			this.isClickable = !!this.href || !!this._click;
			this.tag = this.href ? 'a' : 'div';
			this.deltaIcon = this.deltaDirection === 'up' ? 'trending_up' : (this.deltaDirection === 'down' ? 'trending_down' : 'trending_flat');

			this.click = (event) =>
			{
				if(this.disabled)
				{
					event.preventDefault();
					return;
				}

				if(this._click)
				{
					this._click({ event });
				}
			};

			return /* html */ `
				<${this.tag}
					:class="'holder ' + variant.join(' ') + ' ' + orientation + ' align-' + align + (isClickable ? ' clickable' : '') + (loading ? ' loading' : '') + (disabled ? ' disabled' : '') + (active ? ' active' : '')"
					:href="href || null"
					:target="target || null"
					ot-click="click"
				>
					<div ot-if="hasCover" class="cover">
						<img ot-if="cover" :src="cover" :alt="title || ''" />
						<div ot-if="!cover && coverIcon" class="cover-empty">
							<i>{{ coverIcon }}</i>
						</div>
						<span ot-if="badge" :class="'badge ' + badgeVariant.join(' ')">{{ badge }}</span>
					</div>

					<div class="body">
						<header ot-if="hasHeader" class="head">
							<div ot-if="icon" :class="'icon-wrap ' + iconVariant.join(' ')">
								<i>{{ icon }}</i>
							</div>
							<div class="head-text">
								<span ot-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
								<h3 ot-if="title" class="title">{{ title }}</h3>
								<p ot-if="description" class="description">{{ description }}</p>
							</div>
							<span ot-if="badge && !hasCover" :class="'badge ' + badgeVariant.join(' ')">{{ badge }}</span>
						</header>

						<div ot-if="hasStats" class="stats">
							<span class="value">{{ value }}</span>
							<span ot-if="delta" :class="'delta delta-' + deltaDirection">
								<i>{{ deltaIcon }}</i>
								<span>{{ delta }}</span>
							</span>
						</div>

						<div ot-if="hasMeta" class="meta">
							<span ot-for="entry in meta" class="meta-item">
								<i ot-if="entry.icon">{{ entry.icon }}</i>
								<span>{{ entry.label }}</span>
							</span>
						</div>

						<div ot-if="hasTags" class="tags">
							<span ot-for="tag in tags" class="tag">{{ tag }}</span>
						</div>

						<div ot-if="hasAction" class="footer">
							<e-form-button
								:text="action"
								:icon="actionIcon || ''"
								:variant="actionVariant"
							></e-form-button>
						</div>
					</div>

					<i ot-if="isClickable && !hasAction && orientation === 'horizontal'" class="chevron">chevron_right</i>
				</${this.tag}>
			`;
		}
	});
});
