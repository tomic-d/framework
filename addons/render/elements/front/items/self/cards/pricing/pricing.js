onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'cards-pricing',
		icon: 'payments',
		name: 'Pricing Card',
		description: 'Premium pricing plan card with icon, badge, ribbon, highlighted state and flexible CTA.',
		category: 'Cards',
		author: 'OneType',
		config: {
			icon: {
				type: 'string'
			},
			name: {
				type: 'string'
			},
			description: {
				type: 'string'
			},
			badge: {
				type: 'string'
			},
			ribbon: {
				type: 'string'
			},
			currency: {
				type: 'string',
				value: '$'
			},
			price: {
				type: 'string|number'
			},
			originalPrice: {
				type: 'string|number'
			},
			period: {
				type: 'string',
				value: '/mo'
			},
			yearly: {
				type: 'string'
			},
			features: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						text: { type: 'string' },
						icon: { type: 'string' },
						included: { type: 'boolean', value: true },
						highlight: { type: 'boolean' }
					}
				}
			},
			cta: {
				type: 'string',
				value: 'Get started'
			},
			ctaIcon: {
				type: 'string',
				value: 'arrow_forward'
			},
			href: {
				type: 'string'
			},
			variant: {
				type: 'array',
				value: ['bg-1', 'border', 'size-m'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'featured', 'border', 'highlighted', 'size-s', 'size-m', 'size-l']
			},
			_click: {
				type: 'function'
			}
		},
		render: function()
		{
			this.isHighlighted = this.variant.includes('highlighted');
			this.isFeatured = this.variant.includes('featured');
			this.hasRibbon = !!this.ribbon;

			this.handle = (event) =>
			{
				if(this._click)
				{
					this._click({ event });
				}
			};

			this.ctaButtonVariant = () =>
			{
				if(this.isFeatured || this.isHighlighted)
				{
					return ['brand', 'size-m', 'full'];
				}

				return ['bg-2', 'border', 'size-m', 'full'];
			};

			return /* html */ `
				<div :class="'holder ' + variant.join(' ')">
					<div ot-if="hasRibbon" class="ribbon">{{ ribbon }}</div>

					<div class="header">
						<div ot-if="icon || badge" class="top">
							<div ot-if="icon" class="icon"><i>{{ icon }}</i></div>
							<span ot-if="badge" class="badge">{{ badge }}</span>
						</div>

						<h3 class="name">{{ name }}</h3>
						<p ot-if="description" class="description">{{ description }}</p>

						<div class="price">
							<span ot-if="currency" class="currency">{{ currency }}</span>
							<span class="amount">{{ price }}</span>
							<span ot-if="period" class="period">{{ period }}</span>
						</div>

						<span ot-if="originalPrice" class="original"><span class="strike">{{ currency }}{{ originalPrice }}</span></span>
						<span ot-if="yearly" class="yearly">{{ yearly }}</span>
					</div>

					<div ot-if="features.length" class="features">
						<div
							ot-for="feature in features"
							:class="'feature' + (feature.included === false ? ' disabled' : '') + (feature.highlight ? ' highlight' : '')"
						>
							<i class="icon">{{ feature.icon || (feature.included === false ? 'remove' : 'check_circle') }}</i>
							<span class="text">{{ feature.text }}</span>
						</div>
					</div>

					<div ot-if="cta" class="action">
						<e-form-button
							:text="cta"
							:icon="ctaIcon"
							:href="href"
							:variant="ctaButtonVariant()"
							:_click="handle"
						></e-form-button>
					</div>
				</div>
			`;
		}
	});
});
