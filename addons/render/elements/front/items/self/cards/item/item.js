onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'cards-item',
		icon: 'dashboard',
		name: 'Item Card',
		description: 'Generic card with cover, icon, badge, title, description, stats, meta, tags and action.',
		category: 'Cards',
		config:
		{
			/* ===== COVER ===== */

			cover:
			{
				type: 'string',
				value: '',
				description: 'Cover image URL.'
			},
			coverIcon:
			{
				type: 'string',
				value: '',
				description: 'Placeholder icon when no cover image.'
			},

			/* ===== HEADER ===== */

			icon:
			{
				type: 'string',
				value: '',
				description: 'Icon in colored wrap box.'
			},
			iconColor:
			{
				type: 'string',
				value: '',
				options: ['', 'brand', 'blue', 'red', 'orange', 'green'],
				description: 'Icon wrap accent color.'
			},
			iconBackground:
			{
				type: 'string',
				value: 'bg-2',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Icon wrap background when no color.'
			},
			badge:
			{
				type: 'string',
				value: '',
				description: 'Badge label text.'
			},
			badgeColor:
			{
				type: 'string',
				value: 'brand',
				options: ['brand', 'blue', 'red', 'orange', 'green', 'neutral'],
				description: 'Badge accent color.'
			},
			eyebrow:
			{
				type: 'string',
				value: '',
				description: 'Uppercase label above title.'
			},
			title:
			{
				type: 'string',
				value: '',
				description: 'Card title.'
			},
			description:
			{
				type: 'string',
				value: '',
				description: 'Card description text.'
			},

			/* ===== STATS ===== */

			value:
			{
				type: 'string|number',
				description: 'Primary stat value.'
			},
			delta:
			{
				type: 'string',
				value: '',
				description: 'Change indicator text.'
			},
			deltaDirection:
			{
				type: 'string',
				value: 'neutral',
				options: ['up', 'down', 'neutral'],
				description: 'Delta trend direction.'
			},

			/* ===== META / TAGS ===== */

			meta:
			{
				type: 'array',
				value: [],
				each:
				{
					type: 'object',
					config:
					{
						icon: { type: 'string' },
						label: { type: 'string' }
					}
				},
				description: 'Icon + label pairs below description.'
			},
			tags:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				description: 'Tag chips below meta.'
			},

			/* ===== ACTION ===== */

			action:
			{
				type: 'string',
				value: '',
				description: 'Footer action button text.'
			},
			actionIcon:
			{
				type: 'string',
				value: '',
				description: 'Footer action button icon.'
			},
			actionColor:
			{
				type: 'string',
				value: '',
				options: ['', 'brand', 'blue', 'red', 'orange', 'green'],
				description: 'Footer action button color.'
			},
			actionTone:
			{
				type: 'string',
				value: 'ghost',
				options: ['solid', 'soft', 'outline', 'ghost'],
				description: 'Footer action button tone.'
			},

			/* ===== LINK ===== */

			href:
			{
				type: 'string',
				value: '',
				description: 'Renders card as anchor.'
			},
			target:
			{
				type: 'string',
				value: '',
				description: 'Anchor target.'
			},

			/* ===== LAYOUT ===== */

			orientation:
			{
				type: 'string',
				value: 'vertical',
				options: ['vertical', 'horizontal'],
				description: 'Card direction.'
			},
			align:
			{
				type: 'string',
				value: 'left',
				options: ['left', 'center'],
				description: 'Content alignment.'
			},
			background:
			{
				type: 'string',
				value: 'bg-1',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Card background depth.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Card size.'
			},
			variant:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				options: ['border', 'glass', 'gradient', 'hover'],
				description: 'Visual modifiers.'
			},

			/* ===== STATE ===== */

			loading:
			{
				type: 'boolean',
				value: false,
				description: 'Skeleton shimmer state.'
			},
			disabled:
			{
				type: 'boolean',
				value: false,
				description: 'Disabled state.'
			},
			active:
			{
				type: 'boolean',
				value: false,
				description: 'Selected ring state.'
			},
			_click:
			{
				type: 'function',
				description: 'Click handler. Receives { event }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.hasCover = !!this.cover || !!this.coverIcon;
			this.hasHeader = !!this.icon || !!this.eyebrow || !!this.title || !!this.description || !!this.badge;
			this.hasStats = this.value !== undefined && this.value !== '' && this.value !== null;
			this.hasMeta = this.meta && this.meta.length > 0;
			this.hasTags = this.tags && this.tags.length > 0;
			this.hasAction = !!this.action;
			this.isClickable = !!this.href || !!this._click;
			this.tag = this.href ? 'a' : 'div';

			this.deltaIcon = this.deltaDirection === 'up'
				? 'trending_up'
				: this.deltaDirection === 'down'
					? 'trending_down'
					: 'trending_flat';

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.orientation, 'align-' + this.align, this.background, 'size-' + this.size];

				this.variant.forEach(v => list.push(v));

				if(this.isClickable)
				{
					list.push('clickable');
				}

				if(this.loading)
				{
					list.push('loading');
				}

				if(this.disabled)
				{
					list.push('disabled');
				}

				if(this.active)
				{
					list.push('active');
				}

				return list.join(' ');
			};

			this.iconClasses = () =>
			{
				return 'icon-wrap ' + (this.iconColor || this.iconBackground);
			};

			this.badgeClasses = () =>
			{
				return 'badge ' + this.badgeColor;
			};

			/* ===== HANDLERS ===== */

			this.click = ({ event }) =>
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

			/* ===== RENDER ===== */

			return /* html */ `
				<${this.tag}
					:class="classes()"
					:href="href || null"
					:target="target || null"
					ot-click="click"
				>
					<div ot-if="hasCover" class="cover">
						<img ot-if="cover" :src="cover" :alt="title || ''" />
						<div ot-if="!cover && coverIcon" class="cover-empty">
							<i>{{ coverIcon }}</i>
						</div>
						<span ot-if="badge" :class="badgeClasses()">{{ badge }}</span>
					</div>

					<div class="body">
						<header ot-if="hasHeader" class="head">
							<div ot-if="icon" :class="iconClasses()">
								<i>{{ icon }}</i>
							</div>
							<div class="head-text">
								<span ot-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
								<h3 ot-if="title" class="title">{{ title }}</h3>
								<p ot-if="description" class="description">{{ description }}</p>
							</div>
							<span ot-if="badge && !hasCover" :class="badgeClasses()">{{ badge }}</span>
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
							<span ot-for="item in tags" class="tag">{{ item }}</span>
						</div>

						<div ot-if="hasAction" class="footer">
							<e-form-button
								:text="action"
								:icon="actionIcon"
								:color="actionColor"
								:tone="actionTone"
								size="s"
							></e-form-button>
						</div>
					</div>

					<i ot-if="isClickable && !hasAction && orientation === 'horizontal'" class="chevron">chevron_right</i>
				</${this.tag}>
			`;
		}
	});
});
