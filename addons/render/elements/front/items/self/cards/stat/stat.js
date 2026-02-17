import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'card-stat',
	icon: 'analytics',
	name: 'Card Stat',
	description: 'Metric card with value, trend indicator, comparison, and sparkline visualization.',
	category: 'Cards',
	author: 'Divhunt',
	config: {
		icon: {
			type: 'string',
			value: 'trending_up'
		},
		value: {
			type: 'string',
			value: '$12,847'
		},
		label: {
			type: 'string',
			value: 'Total Revenue'
		},
		subtitle: {
			type: 'string',
			value: 'Last 30 days'
		},
		change: {
			type: 'string',
			value: '+23.5%'
		},
		trend: {
			type: 'string',
			value: 'up',
			options: ['', 'up', 'down']
		},
		comparison: {
			type: 'object',
			value: {
				value: '$9,432',
				label: 'vs last month'
			},
			config: {
				value: { type: 'string', value: '' },
				label: { type: 'string', value: '' }
			}
		},
		sparkline: {
			type: 'array',
			value: [30, 45, 35, 50, 40, 60, 55, 70, 65, 80, 75, 90],
			each: {
				type: 'number'
			}
		},
		variant: {
			type: 'array',
			value: ['bg-2', 'border', 'size-m'],
			options: ['border', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'brand', 'blue', 'red', 'orange', 'green', 'size-s', 'size-m', 'size-l']
		},
		onClick: {
			type: 'function'
		}
	},
	render: function()
	{
		this.handleClick = () =>
		{
			if (this.onClick)
			{
				this.onClick();
			}
		};

		this.getSparklinePath = () =>
		{
			if (!this.sparkline || !this.sparkline.length) return '';

			const width = 80;
			const height = 24;
			const max = Math.max(...this.sparkline);
			const min = Math.min(...this.sparkline);
			const range = max - min || 1;
			const step = width / (this.sparkline.length - 1);

			const points = this.sparkline.map((val, i) =>
			{
				const x = i * step;
				const y = height - ((val - min) / range) * height;
				return `${x},${y}`;
			});

			return `M${points.join(' L')}`;
		};

		return `
			<div class="holder" :variant="variant.join(' ')" dh-click="handleClick">
				<div class="header">
					<i dh-if="icon">{{ icon }}</i>
					<e-tag dh-if="change" :text="change" :variant="[trend === 'up' ? 'green' : trend === 'down' ? 'red' : 'bg-3', 'size-s']"></e-tag>
				</div>
				<div class="content">
					<strong>{{ value }}</strong>
					<span dh-if="label">{{ label }}</span>
					<small dh-if="subtitle">{{ subtitle }}</small>
				</div>
				<div dh-if="comparison?.value || sparkline.length" class="footer">
					<div dh-if="comparison?.value" class="comparison">
						<strong>{{ comparison.value }}</strong>
						<span dh-if="comparison.label">{{ comparison.label }}</span>
					</div>
					<svg dh-if="sparkline.length" class="sparkline" viewBox="0 0 80 24" preserveAspectRatio="none">
						<path :d="getSparklinePath()" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</div>
			</div>
		`;
	}
});
