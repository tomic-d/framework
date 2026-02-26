onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'sections-pricing',
		icon: 'payments',
		name: 'Pricing Card',
		description: 'Pricing plan card with name, price, features list, and CTA button.',
		category: 'Section',
		author: 'OneType',
		config: {
			name: {
				type: 'string',
				value: 'Plan'
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
				value: []
			},
			highlighted: {
				type: 'boolean',
				value: false
			},
			href: {
				type: 'string',
				value: ''
			}
		},
		render: function()
		{
			return `
				<div :class="'holder' + (highlighted ? ' highlighted' : '')">
					<div class="header">
						<span ot-if="badge" class="badge">{{ badge }}</span>
						<h3 class="name">{{ name }}</h3>
						<p ot-if="description" class="description">{{ description }}</p>
						<div class="price">
							<span class="currency">$</span>
							<span class="amount">{{ price }}</span>
							<span class="period">{{ period }}</span>
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
						<e-form-button text="Get Started" icon="arrow_forward" :href="href" :variant="highlighted ? ['brand', 'size-m', 'full'] : ['bg-2', 'border', 'size-m', 'full']"></e-form-button>
					</div>
				</div>
			`;
		}
	});
});
