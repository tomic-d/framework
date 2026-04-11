onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'charts-sparkline',
		icon: 'show_chart',
		name: 'Sparkline',
		description: 'Minimal inline chart — line, area or bar — for stat cards and tables. No axes, no grid.',
		category: 'Charts',
		author: 'OneType',
		config: {
			values: {
				type: 'array',
				value: [],
				each: { type: 'number' }
			},
			type: {
				type: 'string',
				value: 'area',
				options: ['line', 'area', 'bar']
			},
			color: {
				type: 'string',
				value: 'brand',
				options: ['brand', 'blue', 'red', 'orange', 'green']
			},
			height: {
				type: 'number',
				value: 40
			},
			smooth: {
				type: 'boolean',
				value: true
			},
			variant: {
				type: 'array',
				value: [],
				options: []
			}
		},
		render: function()
		{
			this.width = 120;
			this.padding = 2;

			const values = this.values.length ? this.values : [0];
			const min = Math.min(...values);
			const max = Math.max(...values);
			const range = max - min || 1;

			const count = values.length;
			const stepX = count > 1 ? (this.width - this.padding * 2) / (count - 1) : 0;

			const points = values.map((value, index) =>
			{
				const x = this.padding + index * stepX;
				const y = this.padding + (this.height - this.padding * 2) * (1 - (value - min) / range);
				return { x, y, value };
			});

			// Smooth bezier path

			const smoothPath = (pts) =>
			{
				if(pts.length < 2)
				{
					return '';
				}

				let d = `M ${pts[0].x} ${pts[0].y}`;

				for(let i = 0; i < pts.length - 1; i++)
				{
					const current = pts[i];
					const next = pts[i + 1];
					const controlX = (current.x + next.x) / 2;
					d += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
				}

				return d;
			};

			const linePath = (pts) =>
			{
				if(!pts.length)
				{
					return '';
				}

				return 'M ' + pts.map(pt => `${pt.x} ${pt.y}`).join(' L ');
			};

			this.linePath = this.smooth ? smoothPath(points) : linePath(points);
			this.areaPath = this.linePath ? this.linePath + ` L ${points[points.length - 1].x} ${this.height - this.padding} L ${points[0].x} ${this.height - this.padding} Z` : '';

			// Bar mode

			this.bars = [];

			if(this.type === 'bar' && count)
			{
				const gap = 1;
				const barWidth = Math.max(1, (this.width - this.padding * 2 - gap * (count - 1)) / count);

				this.bars = values.map((value, index) =>
				{
					const normalized = (value - min) / range;
					const h = Math.max(1, normalized * (this.height - this.padding * 2));
					const x = this.padding + index * (barWidth + gap);
					const y = this.height - this.padding - h;
					return { x, y, width: barWidth, height: h };
				});
			}

			const isLine = this.type === 'line';
			const isArea = this.type === 'area';
			const isBar = this.type === 'bar';
			const gradientId = 'sparkline-fill-' + onetype.GenerateUID();

			const defs = isArea
				? `<defs>
						<linearGradient id="${gradientId}" x1="0" x2="0" y1="0" y2="1">
							<stop offset="0%" class="area-start" />
							<stop offset="100%" class="area-end" />
						</linearGradient>
					</defs>`
				: '';

			const areaEl = (isArea && this.areaPath)
				? `<path class="area" d="${this.areaPath}" fill="url(#${gradientId})" />`
				: '';

			const lineEl = ((isLine || isArea) && this.linePath)
				? `<path class="line" d="${this.linePath}" />`
				: '';

			const barsEl = this.bars.map(bar => `<rect class="bar" x="${bar.x}" y="${bar.y}" width="${bar.width}" height="${bar.height}" rx="0.5"></rect>`).join('');

			const svgString = `
				<svg viewBox="0 0 ${this.width} ${this.height}" preserveAspectRatio="none">
					${defs}
					${areaEl}
					${lineEl}
					${barsEl}
				</svg>
			`;

			this.OnReady(() =>
			{
				const wrap = this.Element.querySelector('.holder');

				if(wrap)
				{
					const existing = wrap.querySelector('svg');
					if(existing) existing.remove();
					wrap.insertAdjacentHTML('afterbegin', svgString);
				}
			});

			return /* html */ `
				<div :class="'holder color-' + color"></div>
			`;
		}
	});
});
