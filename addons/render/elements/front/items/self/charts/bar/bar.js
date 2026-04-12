onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'charts-bar',
		icon: 'bar_chart',
		name: 'Bar Chart',
		description: 'Bar chart with labels, values, grid, tooltip, active highlight and inline mode.',
		category: 'Charts',
		config:
		{
			items:
			{
				type: 'array',
				value: [],
				each:
				{
					type: 'object',
					config:
					{
						value:
						{
							type: 'number',
							value: 0,
							description: 'Bar value.'
						},
						label:
						{
							type: 'string',
							description: 'Bar label.'
						},
						color:
						{
							type: 'string',
							description: 'Per-bar color override.'
						},
						active:
						{
							type: 'boolean',
							description: 'Highlight this bar.'
						}
					}
				},
				description: 'Data items.'
			},
			title:
			{
				type: 'string',
				value: '',
				description: 'Chart title.'
			},
			description:
			{
				type: 'string',
				value: '',
				description: 'Chart description.'
			},
			orientation:
			{
				type: 'string',
				value: 'vertical',
				options: ['vertical', 'horizontal'],
				description: 'Bar direction.'
			},
			color:
			{
				type: 'string',
				value: 'brand',
				options: ['brand', 'blue', 'red', 'orange', 'green'],
				description: 'Default bar color.'
			},
			height:
			{
				type: 'number',
				value: 220,
				description: 'Canvas height in pixels.'
			},
			showLabels:
			{
				type: 'boolean',
				value: true,
				description: 'Show bar labels.'
			},
			showValues:
			{
				type: 'boolean',
				value: false,
				description: 'Show value above each bar.'
			},
			showGrid:
			{
				type: 'boolean',
				value: true,
				description: 'Show grid lines.'
			},
			format:
			{
				type: 'function',
				description: 'Custom value formatter. Receives number, returns string.'
			},
			background:
			{
				type: 'string',
				value: 'bg-1',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Background depth.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Padding size.'
			},
			variant:
			{
				type: 'array',
				value: ['border'],
				each: { type: 'string' },
				options: ['border', 'clean', 'inline'],
				description: 'Visual modifiers.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.hasHead = !!this.title || !!this.description;
			this.isInline = this.variant.includes('inline');
			this.isClean = this.variant.includes('clean');

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.orientation, 'color-' + this.color, 'size-' + this.size];

				if(!this.isInline && !this.isClean)
				{
					list.push(this.background);
				}

				this.variant.forEach(v => list.push(v));

				return list.join(' ');
			};

			/* ===== FORMAT ===== */

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

			/* ===== DATA ===== */

			const values = this.items.map(item => item.value || 0);
			const max = Math.max(...values, 0) || 1;

			this.gridLines = [0, 0.25, 0.5, 0.75, 1].map(fraction => ({
				percent: fraction * 100,
				value: this.formatValue(max * fraction)
			}));

			this.bars = this.items.map((item, index) =>
			{
				const value = item.value || 0;
				const percent = max === 0 ? 0 : Math.max(0, value / max) * 100;

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

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
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
