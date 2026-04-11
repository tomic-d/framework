onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'charts-donut',
		icon: 'donut_large',
		name: 'Donut Chart',
		description: 'Premium donut/pie chart with segments, center label, legend and hover tooltips.',
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
						color: { type: 'string' }
					}
				}
			},
			title: {
				type: 'string'
			},
			description: {
				type: 'string'
			},
			center: {
				type: 'object',
				value: null,
				config: {
					label: { type: 'string' },
					value: { type: 'string|number' }
				}
			},
			thickness: {
				type: 'number',
				value: 18
			},
			size: {
				type: 'number',
				value: 180
			},
			showLegend: {
				type: 'boolean',
				value: true
			},
			showPercents: {
				type: 'boolean',
				value: true
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
			this.hasCenter = !!this.center && (!!this.center.label || this.center.value !== undefined);

			const colors = ['brand', 'blue', 'green', 'orange', 'red'];
			const radius = 100 - this.thickness / 2 - 2;
			const circumference = 2 * Math.PI * radius;
			const total = this.items.reduce((sum, item) => sum + (item.value || 0), 0) || 1;

			let offset = 0;

			this.segments = this.items.map((item, index) =>
			{
				const value = item.value || 0;
				const percent = (value / total) * 100;
				const dash = (value / total) * circumference;
				const gap = circumference - dash;
				const color = item.color || colors[index % colors.length];

				const segment = {
					index,
					value,
					label: item.label || '',
					color,
					percent: Math.round(percent * 10) / 10,
					dash,
					gap,
					offset: -offset,
					display: item.label + ': ' + value + ' (' + Math.round(percent) + '%)'
				};

				offset += dash;

				return segment;
			});

			// Pre-render SVG string — inject via innerHTML in OnReady to keep SVG namespace

			const svgString = `
				<svg viewBox="0 0 200 200">
					<circle
						class="track"
						cx="100"
						cy="100"
						r="${radius}"
						fill="none"
						stroke-width="${this.thickness}"
					></circle>
					${this.segments.map(segment => `
						<circle
							class="segment color-${segment.color}"
							cx="100"
							cy="100"
							r="${radius}"
							fill="none"
							stroke-width="${this.thickness}"
							stroke-dasharray="${segment.dash} ${segment.gap}"
							stroke-dashoffset="${segment.offset}"
							stroke-linecap="butt"
							transform="rotate(-90 100 100)"
						></circle>
					`).join('')}
				</svg>
			`;

			this.OnReady(() =>
			{
				const wrap = this.Element.querySelector('.chart-wrap');

				if(wrap)
				{
					const existing = wrap.querySelector('svg');
					if(existing) existing.remove();
					wrap.insertAdjacentHTML('afterbegin', svgString);
				}
			});

			return /* html */ `
				<div :class="'holder ' + variant.join(' ')">
					<header ot-if="hasHead" class="head">
						<div ot-if="title" class="title">{{ title }}</div>
						<div ot-if="description" class="description">{{ description }}</div>
					</header>

					<div class="canvas">
						<div class="chart-wrap" :style="'width: ' + size + 'px; height: ' + size + 'px'">
							<div ot-if="hasCenter" class="center">
								<div ot-if="center.value !== undefined" class="center-value">{{ center.value }}</div>
								<div ot-if="center.label" class="center-label">{{ center.label }}</div>
							</div>
						</div>

						<div ot-if="showLegend" class="legend">
							<div ot-for="segment in segments" :class="'legend-item color-' + segment.color">
								<span class="dot-marker"></span>
								<span class="legend-label">{{ segment.label }}</span>
								<span ot-if="showPercents" class="legend-percent">{{ segment.percent }}%</span>
							</div>
						</div>
					</div>
				</div>
			`;
		}
	});
});
