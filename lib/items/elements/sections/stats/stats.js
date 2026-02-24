onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'sections-stats',
		icon: 'bar_chart',
		name: 'Stats',
		description: 'Animated statistics row.',
		category: 'Component',
		author: 'OneType',
		config: {
			items: {
				type: 'array',
				value: [
					{ value: 30, suffix: '+', label: 'Actions' },
					{ value: 8, suffix: '+', label: 'Integrations' },
					{ value: 100000, suffix: '+', label: 'Executions' },
					{ value: 1500, suffix: '+', label: 'Users' }
				]
			}
		},
		render: function()
		{
			this.counts = this.items.map(() => 0);

			this.animate = () =>
			{
				const duration = 1500;
				const start = performance.now();

				const step = (now) =>
				{
					const progress = Math.min((now - start) / duration, 1);
					const ease = 1 - Math.pow(1 - progress, 3);

					this.items.forEach((item, i) =>
					{
						this.counts[i] = Math.round(ease * item.value);
					});

					this.Update();

					if(progress < 1)
					{
						requestAnimationFrame(step);
					}
				};

				requestAnimationFrame(step);
			};

			this.format = (num) =>
			{
				return num.toLocaleString('en-US');
			};

			this.display = (index) =>
			{
				const item = this.items[index];
				return (item.prefix || '') + this.format(this.counts[index]) + (item.suffix || '');
			};

			setTimeout(() => this.animate(), 200);

			return `
				<div class="holder">
					<div ot-for="item, index in items" class="item">
						<span class="value">{{ display(index) }}</span>
						<span class="label">{{ item.label }}</span>
					</div>
				</div>
			`;
		}
	});
});
