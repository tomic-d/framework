onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'charts-bar',
		icon: 'bar_chart',
		name: 'Bar Chart',
		description: 'Premium bar chart with labels, values, grid, tooltip on hover, active bar highlight, and inline variant.',
		category: 'Charts',
		author: 'OneType',
		config: {
			items: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						value: { type: 'number', value: 0 },
						label: { type: 'string' },
						color: { type: 'string' },
						active: { type: 'boolean' }
					}
				}
			},
			title: {
				type: 'string'
			},
			description: {
				type: 'string'
			},
			orientation: {
				type: 'string',
				value: 'vertical',
				options: ['vertical', 'horizontal']
			},
			color: {
				type: 'string',
				value: 'brand',
				options: ['brand', 'blue', 'red', 'orange', 'green']
			},
			height: {
				type: 'number',
				value: 220
			},
			showLabels: {
				type: 'boolean',
				value: true
			},
			showValues: {
				type: 'boolean'
			},
			showGrid: {
				type: 'boolean',
				value: true
			},
			format: {
				type: 'function'
			},
			variant: {
				type: 'array',
				value: ['bg-1', 'border', 'size-m'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'clean', 'inline', 'size-s', 'size-m', 'size-l']
			}
		},
		render: function()
		{
			this.hasHead = !!this.title || !!this.description;
			this.isInline = this.variant.includes('inline');

			this.formatValue = (value) =>
			{
				if(this.format)
				{
					return this.format(value);
				}

				if(typeof value !== 'number')
				{
					return String(value || '');
				}

				if(Math.abs(value) >= 1000000)
				{
					return (value / 1000000).toFixed(1) + 'M';
				}

				if(Math.abs(value) >= 1000)
				{
					return (value / 1000).toFixed(1) + 'k';
				}

				return String(Math.round(value));
			};

			const values = this.items.map(item => item.value || 0);
			const max = Math.max(...values, 0) || 1;
			const min = Math.min(0, ...values);

			this.gridLines = [0, 0.25, 0.5, 0.75, 1].map(fraction => ({
				percent: fraction * 100,
				value: this.formatValue(max * fraction)
			}));

			this.bars = this.items.map((item, index) =>
			{
				const value = item.value || 0;
				const normalized = max === 0 ? 0 : Math.max(0, value / max);
				const percent = normalized * 100;

				return {
					index,
					value,
					label: item.label || '',
					color: item.color || this.color,
					active: !!item.active,
					percent,
					display: this.formatValue(value)
				};
			});

			return /* html */ `
				<div :class="'holder ' + variant.join(' ') + ' ' + orientation + ' color-' + color">
					<header ot-if="hasHead" class="head">
						<div ot-if="title" class="title">{{ title }}</div>
						<div ot-if="description" class="description">{{ description }}</div>
					</header>

					<div class="canvas" :style="'height: ' + height + 'px'">
						<div ot-if="showGrid && orientation === 'vertical'" class="grid">
							<div ot-for="line in gridLines" class="grid-line" :style="'bottom: ' + line.percent + '%'">
								<span class="grid-value">{{ line.value }}</span>
							</div>
						</div>

						<div ot-if="showGrid && orientation === 'horizontal'" class="grid horizontal">
							<div ot-for="line in gridLines" class="grid-line" :style="'left: ' + line.percent + '%'">
								<span class="grid-value">{{ line.value }}</span>
							</div>
						</div>

						<div class="bars">
							<div
								ot-for="bar in bars"
								:class="'bar-wrap color-' + bar.color + (bar.active ? ' active' : '')"
								:ot-tooltip="{ text: bar.label + ': ' + bar.display, position: { x: 'center', y: 'top' } }"
							>
								<div ot-if="showValues" class="bar-value">{{ bar.display }}</div>
								<div class="bar" :style="(orientation === 'vertical' ? 'height: ' : 'width: ') + bar.percent + '%'"></div>
								<div ot-if="showLabels" class="bar-label">{{ bar.label }}</div>
							</div>
						</div>
					</div>
				</div>
			`;
		}
	});
});
