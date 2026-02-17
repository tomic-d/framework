import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'plans',
	icon: 'credit_card',
	name: 'Plans',
	description: 'Pricing plan cards with features and call-to-action.',
	category: 'Data',
	author: 'Divhunt',
	config: {
		plans: {
			type: 'array',
			value: [
				{
					name: 'Starter',
					price: '$9',
					oldPrice: '',
					period: 'month',
					description: 'Perfect for individuals',
					discount: '',
					features: [
						{ text: '5 Projects', included: true },
						{ text: '10GB Storage', included: true },
						{ text: 'Basic Support', included: true },
						{ text: 'Advanced Analytics', included: false },
						{ text: 'Custom Domain', included: false }
					],
					button: 'Get Started',
					highlighted: false
				},
				{
					name: 'Pro',
					price: '$29',
					oldPrice: '$36',
					period: 'month',
					description: 'Best for professionals',
					discount: 'Save 20%',
					features: [
						{ text: 'Unlimited Projects', included: true },
						{ text: '100GB Storage', included: true },
						{ text: 'Priority Support', included: true },
						{ text: 'Advanced Analytics', included: true },
						{ text: 'Custom Domain', included: false }
					],
					button: 'Get Started',
					highlighted: true
				},
				{
					name: 'Enterprise',
					price: '$99',
					oldPrice: '',
					period: 'month',
					description: 'For large teams',
					discount: '',
					features: [
						{ text: 'Unlimited Projects', included: true },
						{ text: 'Unlimited Storage', included: true },
						{ text: '24/7 Support', included: true },
						{ text: 'Advanced Analytics', included: true },
						{ text: 'Custom Domain', included: true }
					],
					button: 'Contact Sales',
					highlighted: false
				}
			]
		},
		variant: {
			type: 'array',
			value: ['border'],
			options: ['border', 'bg-1', 'bg-2', 'bg-3', 'size-s', 'size-m', 'size-l']
		}
	},
	render: function()
	{
		return `
			<div class="holder" :variant="variant.join(' ')">
				<div dh-for="plan in plans" class="plan" :highlighted="plan.highlighted">
					<div dh-if="plan.highlighted" class="badge">Popular</div>
					<div class="header">
						<h3 class="name">{{ plan.name }}</h3>
						<div class="description">{{ plan.description }}</div>
					</div>
					<div class="pricing">
						<div class="price-wrapper">
							<span dh-if="plan.oldPrice" class="old-price">{{ plan.oldPrice }}</span>
							<span class="price">{{ plan.price }}</span>
							<span class="period">/{{ plan.period }}</span>
						</div>
						<div dh-if="plan.discount" class="discount">{{ plan.discount }}</div>
					</div>
					<div class="features">
						<div dh-for="feature in plan.features" class="feature" :included="feature.included">
							<i class="icon">{{ feature.included ? 'check_circle' : 'cancel' }}</i>
							<span class="text">{{ feature.text }}</span>
						</div>
					</div>
					<e-button :variant="plan.highlighted ? ['brand', 'block'] : ['outline', 'block']">
						{{ plan.button }}
					</e-button>
				</div>
			</div>
		`;
	}
});
