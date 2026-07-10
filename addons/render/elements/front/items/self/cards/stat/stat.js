onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'cards-stat',
		icon: 'analytics',
		name: 'Stat Card',
		description: 'KPI stat card with label, value, icon, delta trend and inline sparkline.',
		category: 'Cards',
		config:
		{
			label:
			{
				type: 'string',
				value: '',
				description: 'Uppercase label above value.'
			},
			value:
			{
				type: 'string|number',
				value: '',
				description: 'Main display value.'
			},
			description:
			{
				type: 'string',
				value: '',
				description: 'Helper text below value.'
			},
			icon:
			{
				type: 'string',
				value: '',
				description: 'Icon in colored wrap.'
			},
			iconColor:
			{
				type: 'string',
				value: 'brand',
				options: ['brand', 'blue', 'red', 'orange', 'green', 'bg-1', 'bg-2', 'bg-3'],
				description: 'Icon wrap color.'
			},
			delta:
			{
				type: 'object',
				value: null,
				config:
				{
					value:
					{
						type: 'string',
						description: 'Delta display value.'
					},
					label:
					{
						type: 'string',
						description: 'Delta context label.'
					},
					direction:
					{
						type: 'string',
						value: 'up',
						options: ['up', 'down', 'neutral'],
						description: 'Trend direction.'
					}
				},
				description: 'Trend delta badge.'
			},
			sparkline:
			{
				type: 'array',
				value: [],
				each: { type: 'number' },
				description: 'Sparkline data points.'
			},
			sparklineType:
			{
				type: 'string',
				value: 'area',
				options: ['line', 'area', 'bar'],
				description: 'Sparkline chart type.'
			},
			sparklineColor:
			{
				type: 'string',
				value: 'brand',
				options: ['brand', 'blue', 'red', 'orange', 'green'],
				description: 'Sparkline color.'
			},
			href:
			{
				type: 'string',
				value: '',
				description: 'Renders as anchor.'
			},
			target:
			{
				type: 'string',
				value: '',
				description: 'Anchor target.'
			},
			orientation:
			{
				type: 'string',
				value: 'vertical',
				options: ['vertical', 'horizontal'],
				description: 'Card layout.'
			},
			loading:
			{
				type: 'boolean',
				value: false,
				description: 'Skeleton loading state.'
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
				description: 'Active highlight ring.'
			},
			background:
			{
				type: 'string',
				value: 'bg-1',
				options: ['bg-1', 'bg-2', 'bg-3'],
				description: 'Background depth.'
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
				value: ['border'],
				each: { type: 'string' },
				options: ['border', 'hover-lift', 'gradient'],
				description: 'Visual modifiers.'
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

			this.Compute(() =>
			{
				this.hasDelta = !!this.delta && !!this.delta.value;
				this.hasSparkline = this.sparkline && this.sparkline.length > 1;
				this.hasIcon = !!this.icon;
				this.isClickable = !!this.href || !!this._click;
				this.tag = this.href ? 'a' : 'div';
				this.deltaDir = this.hasDelta ? (this.delta.direction || 'up') : 'neutral';
				this.deltaIcon = this.deltaDir === 'up' ? 'trending_up' : (this.deltaDir === 'down' ? 'trending_down' : 'trending_flat');
			});

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.background, this.orientation, 'size-' + this.size];

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

			/* ===== HANDLERS ===== */

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

			/* ===== RENDER ===== */

			return /* html */ `
				<${this.tag}
					:class="classes()"
					:href="href || null"
					:target="target || null"
					ot-click="click"
				>
					<div class="body">
						<header class="head">
							<div class="head-text">
								<span ot-if="label" class="label">{{ label }}</span>
							</div>
							<div ot-if="hasIcon" :class="'icon-wrap ' + iconColor">
								<i>{{ icon }}</i>
							</div>
						</header>

						<div class="value-row">
							<span class="value">{{ value }}</span>
							<span ot-if="hasDelta" :class="'delta delta-' + deltaDir">
								<i>{{ deltaIcon }}</i>
								<span class="delta-value">{{ delta.value }}</span>
								<span ot-if="delta.label" class="delta-label">{{ delta.label }}</span>
							</span>
						</div>

						<p ot-if="description" class="description">{{ description }}</p>
					</div>

					<div ot-if="hasSparkline" class="sparkline">
						<e-charts-sparkline
							:values="sparkline"
							:type="sparklineType"
							:color="sparklineColor"
							:height="56"
						></e-charts-sparkline>
					</div>
				</${this.tag}>
			`;
		}
	});
});
