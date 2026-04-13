onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'charts-donut',
		icon: 'donut_large',
		name: 'Donut Chart',
		description: 'Donut chart with segments, center label, legend and draw animation.',
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
							description: 'Segment value.'
						},
						label:
						{
							type: 'string',
							value: '',
							description: 'Segment label.'
						},
						color:
						{
							type: 'string',
							value: '',
							description: 'Segment color override.'
						}
					}
				},
				description: 'Chart segments.'
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
				description: 'Card description.'
			},
			center:
			{
				type: 'object',
				value: null,
				config:
				{
					label:
					{
						type: 'string',
						value: '',
						description: 'Center label.'
					},
					value:
					{
						type: 'string|number',
						value: '',
						description: 'Center value.'
					}
				},
				description: 'Center label inside donut.'
			},
			thickness:
			{
				type: 'number',
				value: 18,
				description: 'Stroke width of the ring.'
			},
			chartSize:
			{
				type: 'number',
				value: 180,
				description: 'Donut diameter in pixels.'
			},
			legend:
			{
				type: 'boolean',
				value: true,
				description: 'Show legend beside chart.'
			},
			percents:
			{
				type: 'boolean',
				value: true,
				description: 'Show percent in legend.'
			},
			background:
			{
				type: 'string',
				value: 'bg-1',
				options: ['', 'bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Card background depth.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Card padding size.'
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

			this.Compute(() =>
			{
				this.hasHead = !!this.title || !!this.description;
				this.hasCenter = !!this.center && (!!this.center.label || this.center.value !== undefined);

				const palette = ['brand', 'blue', 'green', 'orange', 'red'];
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
					const color = item.color || palette[index % palette.length];

					const segment = {
						index,
						value,
						label: item.label || '',
						color,
						percent: Math.round(percent * 10) / 10,
						dash,
						gap,
						offset: -offset
					};

					offset += dash;

					return segment;
				});
			});

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', 'size-' + this.size];

				if(this.background)
				{
					list.push(this.background);
				}

				this.variant.forEach(v => list.push(v));

				return list.join(' ');
			};

			/* ===== SVG ===== */

			const svg = `
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
							data-label="${segment.label}"
							data-value="${segment.value}"
							data-percent="${segment.percent}"
						></circle>
					`).join('')}
				</svg>
			`;

			this.OnReady(() =>
			{
				const wrap = this.Element.querySelector('.chart');

				if(!wrap)
				{
					return;
				}

				const existing = wrap.querySelector('svg');

				if(existing)
				{
					existing.remove();
				}

				wrap.insertAdjacentHTML('afterbegin', svg);

				/* Segment tooltips */

				wrap.querySelectorAll('.segment').forEach(el =>
				{
					let overlay = null;

					el.addEventListener('mouseenter', () =>
					{
						const label = el.getAttribute('data-label');
						const value = el.getAttribute('data-value');
						const percent = el.getAttribute('data-percent');
						const text = label + ': ' + value + ' (' + percent + '%)';

						overlay = $ot.tooltip(wrap, { text }, { position: { x: 'center', y: 'top' }, offset: { x: 0, y: -6 } });
					});

					el.addEventListener('mouseleave', () =>
					{
						if(overlay)
						{
							overlay.Remove();
							overlay = null;
						}
					});
				});
			});

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<header ot-if="hasHead" class="head">
						<div ot-if="title" class="title">{{ title }}</div>
						<div ot-if="description" class="desc">{{ description }}</div>
					</header>

					<div class="canvas">
						<div class="chart" :style="'width: ' + chartSize + 'px; height: ' + chartSize + 'px'">
							<div ot-if="hasCenter" class="center">
								<div ot-if="center.value !== undefined" class="value">{{ center.value }}</div>
								<div ot-if="center.label" class="label">{{ center.label }}</div>
							</div>
						</div>

						<div ot-if="legend" class="legend">
							<div ot-for="segment in segments" :class="'item color-' + segment.color">
								<span class="dot"></span>
								<span class="name">{{ segment.label }}</span>
								<span ot-if="percents" class="percent">{{ segment.percent }}%</span>
							</div>
						</div>
					</div>
				</div>
			`;
		}
	});
});
