onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'charts-line',
		icon: 'show_chart',
		name: 'Line Chart',
		description: 'Line chart with multi-series, smooth/step, area fill, dots, grid and legend.',
		category: 'Charts',
		config:
		{
			series:
			{
				type: 'array',
				value: [],
				each:
				{
					type: 'object',
					config:
					{
						label:
						{
							type: 'string',
							description: 'Series name for legend.'
						},
						color:
						{
							type: 'string',
							value: 'brand',
							options: ['brand', 'blue', 'red', 'orange', 'green'],
							description: 'Line and fill color.'
						},
						values:
						{
							type: 'array',
							each: { type: 'number' },
							description: 'Data points.'
						}
					}
				},
				description: 'Data series array.'
			},
			labels:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				description: 'X-axis labels.'
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
				description: 'Subtitle below title.'
			},
			smooth:
			{
				type: 'boolean',
				value: true,
				description: 'Bezier curve between points.'
			},
			fill:
			{
				type: 'boolean',
				value: true,
				description: 'Gradient area below line.'
			},
			showDots:
			{
				type: 'boolean',
				value: true,
				description: 'Show data point circles.'
			},
			showGrid:
			{
				type: 'boolean',
				value: true,
				description: 'Horizontal grid lines with y-axis labels.'
			},
			showLegend:
			{
				type: 'boolean',
				value: true,
				description: 'Series legend below chart.'
			},
			showLabels:
			{
				type: 'boolean',
				value: true,
				description: 'X-axis text labels.'
			},
			height:
			{
				type: 'number',
				value: 240,
				description: 'SVG viewBox height.'
			},
			background:
			{
				type: 'string',
				value: 'bg-1',
				options: ['', 'bg-1', 'bg-2', 'bg-3', 'bg-4'],
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

			/* ===== FORMAT ===== */

			this.formatValue = (value) =>
			{
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

			/* ===== STATE ===== */

			this.Compute(() =>
			{
				this.hasHead = !!this.title || !!this.description;
				this.hasLegend = this.showLegend && this.series.length > 0;

				this.width = 640;
				this.padding = { top: 12, right: 12, bottom: this.showLabels ? 28 : 12, left: 40 };

				const allValues = this.series.flatMap(s => s.values || []);
				const max = allValues.length ? Math.max(...allValues) : 1;
				const min = Math.min(0, ...allValues);
				const niceMax = max > 0 ? max * 1.1 : 1;

				const pointCount = this.labels.length || Math.max(...this.series.map(s => (s.values || []).length), 0);
				const chartWidth = this.width - this.padding.left - this.padding.right;
				const chartHeight = this.height - this.padding.top - this.padding.bottom;

				const stepX = pointCount > 1 ? chartWidth / (pointCount - 1) : 0;

				this.computedSeries = this.series.map(series =>
				{
					const values = series.values || [];

					const points = values.map((value, index) =>
					{
						const x = this.padding.left + index * stepX;
						const y = this.padding.top + chartHeight * (1 - (value - min) / (niceMax - min || 1));
						return { x, y, value, index };
					});

					let linePath = '';

					if(points.length)
					{
						if(this.smooth)
						{
							linePath = `M ${points[0].x} ${points[0].y}`;

							for(let i = 0; i < points.length - 1; i++)
							{
								const current = points[i];
								const next = points[i + 1];
								const controlX = (current.x + next.x) / 2;
								linePath += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
							}
						}
						else
						{
							linePath = 'M ' + points.map(p => `${p.x} ${p.y}`).join(' L ');
						}
					}

					const areaPath = linePath && points.length > 1
						? linePath + ` L ${points[points.length - 1].x} ${this.padding.top + chartHeight} L ${points[0].x} ${this.padding.top + chartHeight} Z`
						: '';

					return {
						label: series.label || '',
						color: series.color || 'brand',
						linePath,
						areaPath,
						points
					};
				});

				this.gridLines = [0, 0.25, 0.5, 0.75, 1].map(fraction =>
				{
					const y = this.padding.top + chartHeight * (1 - fraction);
					const value = min + (niceMax - min) * fraction;

					return {
						y,
						x1: this.padding.left,
						x2: this.width - this.padding.right,
						label: this.formatValue(value)
					};
				});

				this.xLabels = (this.labels || []).map((label, index) => ({
					x: this.padding.left + index * stepX,
					y: this.height - 4,
					label
				}));
			});

			/* ===== SVG ===== */

			const uid = onetype.GenerateUID();

			const defs = this.computedSeries.map(series => `
				<linearGradient id="line-fill-${uid}-${series.color}" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" class="area-start color-${series.color}" />
					<stop offset="100%" class="area-end color-${series.color}" />
				</linearGradient>
			`).join('');

			const gridEl = this.showGrid
				? `<g class="grid">
					${this.gridLines.map(line => `<line x1="${line.x1}" x2="${line.x2}" y1="${line.y}" y2="${line.y}" class="grid-line"></line>`).join('')}
					${this.gridLines.map(line => `<text x="${this.padding.left - 6}" y="${line.y + 3}" class="grid-label" text-anchor="end">${line.label}</text>`).join('')}
				</g>`
				: '';

			const seriesEl = this.computedSeries.map(series =>
			{
				const area = (this.fill && series.areaPath) ? `<path class="area" d="${series.areaPath}" fill="url(#line-fill-${uid}-${series.color})" />` : '';
				const line = series.linePath ? `<path class="line" d="${series.linePath}" />` : '';
				const dots = this.showDots ? series.points.map(point => `<circle class="dot" cx="${point.x}" cy="${point.y}" r="3.5" data-label="${series.label}" data-value="${this.formatValue(point.value)}"></circle>`).join('') : '';

				return `<g class="series color-${series.color}">${area}${line}${dots}</g>`;
			}).join('');

			const labelsEl = this.showLabels
				? `<g class="labels">${this.xLabels.map(label => `<text x="${label.x}" y="${label.y}" class="x-label" text-anchor="middle">${label.label}</text>`).join('')}</g>`
				: '';

			const svgString = `
				<svg viewBox="0 0 ${this.width} ${this.height}" preserveAspectRatio="xMidYMid meet">
					<defs>${defs}</defs>
					${gridEl}
					${seriesEl}
					${labelsEl}
				</svg>
			`;

			/* ===== MOUNT ===== */

			this.OnReady(() =>
			{
				const canvas = this.Element.querySelector('.canvas');

				if(!canvas)
				{
					return;
				}

				const existing = canvas.querySelector('svg');

				if(existing)
				{
					existing.remove();
				}

				canvas.insertAdjacentHTML('afterbegin', svgString);

				/* Dot tooltips */

				canvas.querySelectorAll('.dot').forEach(dot =>
				{
					let overlay = null;

					dot.addEventListener('mouseenter', () =>
					{
						const label = dot.getAttribute('data-label');
						const value = dot.getAttribute('data-value');
						const text = label ? label + ': ' + value : value;

						overlay = $ot.float.tooltip(dot, { text }, { position: { x: 'center', y: 'top' }, offset: { x: 0, y: -6 } });
					});

					dot.addEventListener('mouseleave', () =>
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
						<div ot-if="description" class="description">{{ description }}</div>
					</header>

					<div class="canvas"></div>

					<footer ot-if="hasLegend" class="legend">
						<div ot-for="series in computedSeries" :class="'legend-item color-' + series.color">
							<span class="dot-marker"></span>
							<span>{{ series.label }}</span>
						</div>
					</footer>
				</div>
			`;
		}
	});
});
