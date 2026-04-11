onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'cards-stat',
		icon: 'analytics',
		name: 'Stat Card',
		description: 'Premium KPI stat card — label, big value, icon, delta and optional inline sparkline chart.',
		category: 'Cards',
		author: 'OneType',
		config: {
			label: {
				type: 'string'
			},
			value: {
				type: 'string|number'
			},
			description: {
				type: 'string'
			},
			icon: {
				type: 'string'
			},
			iconVariant: {
				type: 'array',
				value: ['brand'],
				options: ['brand', 'blue', 'red', 'orange', 'green', 'bg-1', 'bg-2', 'bg-3', 'bg-4']
			},
			delta: {
				type: 'object',
				value: null,
				config: {
					value: { type: 'string' },
					label: { type: 'string' },
					direction: { type: 'string', value: 'up', options: ['up', 'down', 'neutral'] }
				}
			},
			sparkline: {
				type: 'array',
				value: [],
				each: { type: 'number' }
			},
			sparklineType: {
				type: 'string',
				value: 'area',
				options: ['line', 'area', 'bar']
			},
			sparklineColor: {
				type: 'string',
				value: 'brand',
				options: ['brand', 'blue', 'red', 'orange', 'green']
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
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'hover-lift', 'gradient', 'size-s', 'size-m', 'size-l']
			},
			_click: {
				type: 'function'
			}
		},
		render: function()
		{
			this.hasDelta = !!this.delta && !!this.delta.value;
			this.hasSparkline = this.sparkline && this.sparkline.length > 1;
			this.hasIcon = !!this.icon;
			this.isClickable = !!this.href || !!this._click;
			this.tag = this.href ? 'a' : 'div';
			this.deltaDir = this.hasDelta ? (this.delta.direction || 'up') : 'neutral';
			this.deltaIcon = this.deltaDir === 'up' ? 'trending_up' : (this.deltaDir === 'down' ? 'trending_down' : 'trending_flat');

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
					:class="'holder ' + variant.join(' ') + ' ' + orientation + (isClickable ? ' clickable' : '') + (loading ? ' loading' : '') + (disabled ? ' disabled' : '') + (active ? ' active' : '')"
					:href="href || null"
					:target="target || null"
					ot-click="click"
				>
					<div class="body">
						<header class="head">
							<div class="head-text">
								<span ot-if="label" class="label">{{ label }}</span>
							</div>
							<div ot-if="hasIcon" :class="'icon-wrap ' + iconVariant.join(' ')">
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
