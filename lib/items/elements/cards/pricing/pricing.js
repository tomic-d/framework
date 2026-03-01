onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'cards-pricing',
		icon: 'payments',
		name: 'Pricing Card',
		description: 'Pricing plan card with name, price, features list, and CTA button.',
		category: 'Cards',
		author: 'OneType',
		config: {
			name: {
				type: 'string',
				value: ''
			},
			price: {
				type: 'number',
				value: 0
			},
			period: {
				type: 'string',
				value: '/mo'
			},
			yearly: {
				type: 'string',
				value: ''
			},
			badge: {
				type: 'string',
				value: ''
			},
			description: {
				type: 'string',
				value: ''
			},
			features: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						text: { type: 'string', value: '' },
						included: { type: 'boolean', value: true }
					}
				}
			},
			href: {
				type: 'string',
				value: ''
			},
			variant: {
				type: 'array',
				value: ['bg-2'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'highlighted']
			},
			_click: {
				type: 'function'
			}
		},
		render: function()
		{
			this.handle = (e) =>
			{
				if (this._click)
				{
					this._click(e);
				}
			};

			return `
				<div :class="'holder ' + variant.join(' ')">
					<div class="header">
						<span ot-if="badge" class="badge">{{ badge }}</span>
						<h3 class="name">{{ name }}</h3>
						<p ot-if="description" class="description">{{ description }}</p>
						<div class="price">
							<span class="currency">$</span>
							<span class="amount">{{ price }}</span>
							<span ot-if="period" class="period">{{ period }}</span>
						</div>
						<span ot-if="yearly" class="yearly">{{ yearly }}</span>
					</div>
					<div class="features">
						<div ot-for="feature in features" :class="'feature' + (feature.included ? '' : ' disabled')">
							<i class="icon">{{ feature.included ? 'check_circle' : 'remove' }}</i>
							<span class="text">{{ feature.text }}</span>
						</div>
					</div>
					<div ot-if="href" class="action">
						<e-form-button text="Get Started" icon="arrow_forward" :href="href" :variant="variant.includes('highlighted') ? ['brand', 'size-m', 'full'] : ['bg-2', 'border', 'size-m', 'full']" ot-click="handle"></e-form-button>
					</div>
				</div>
			`;
		}
	});
});
