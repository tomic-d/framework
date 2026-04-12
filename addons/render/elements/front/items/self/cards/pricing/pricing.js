onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'cards-pricing',
		icon: 'payments',
		name: 'Pricing Card',
		description: 'Pricing plan card with icon, badge, ribbon, features and CTA.',
		category: 'Cards',
		config:
		{
			icon:
			{
				type: 'string',
				value: '',
				description: 'Plan icon.'
			},
			name:
			{
				type: 'string',
				value: '',
				description: 'Plan name.'
			},
			description:
			{
				type: 'string',
				value: '',
				description: 'Short tagline.'
			},
			badge:
			{
				type: 'string',
				value: '',
				description: 'Pill badge next to icon.'
			},
			ribbon:
			{
				type: 'string',
				value: '',
				description: 'Corner ribbon label.'
			},
			currency:
			{
				type: 'string',
				value: '$',
				description: 'Currency symbol.'
			},
			price:
			{
				type: 'string|number',
				value: '',
				description: 'Plan price.'
			},
			original:
			{
				type: 'string|number',
				value: '',
				description: 'Strikethrough original price.'
			},
			period:
			{
				type: 'string',
				value: '/mo',
				description: 'Billing period label.'
			},
			yearly:
			{
				type: 'string',
				value: '',
				description: 'Yearly savings caption.'
			},
			features:
			{
				type: 'array',
				value: [],
				each:
				{
					type: 'object',
					config:
					{
						text:
						{
							type: 'string',
							description: 'Feature label.'
						},
						icon:
						{
							type: 'string',
							description: 'Feature icon.'
						},
						included:
						{
							type: 'boolean',
							value: true,
							description: 'Included in plan.'
						},
						highlight:
						{
							type: 'boolean',
							value: false,
							description: 'Emphasize feature.'
						}
					}
				},
				description: 'Feature list.'
			},
			cta:
			{
				type: 'string',
				value: 'Get started',
				description: 'CTA button text.'
			},
			ctaIcon:
			{
				type: 'string',
				value: 'arrow_forward',
				description: 'CTA button icon.'
			},
			href:
			{
				type: 'string',
				value: '',
				description: 'CTA link URL.'
			},
			tone:
			{
				type: 'string',
				value: '',
				options: ['', 'highlighted', 'featured'],
				description: 'Card emphasis level.'
			},
			background:
			{
				type: 'string',
				value: 'bg-1',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Background depth.'
			},
			border:
			{
				type: 'boolean',
				value: true,
				description: 'Show border.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Card size.'
			},
			_click:
			{
				type: 'function',
				description: 'CTA click handler. Receives { event }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.hasRibbon = !!this.ribbon;
			this.hasFeatures = this.features.length > 0;
			this.hasOriginal = !!this.original;
			this.hasYearly = !!this.yearly;

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', 'size-' + this.size];

				if(this.tone)
				{
					list.push(this.tone);
				}
				else
				{
					list.push(this.background);
				}

				if(this.border && this.tone !== 'featured')
				{
					list.push('border');
				}

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

			this.handle = ({ event }) =>
			{
				if(this._click)
				{
					this._click({ event });
				}
			};

			this.featureClass = (feature) =>
			{
				const list = ['feature'];

				if(!feature.included)
				{
					list.push('disabled');
				}

				if(feature.highlight)
				{
					list.push('highlight');
				}

				return list.join(' ');
			};

			this.featureIcon = (feature) =>
			{
				if(feature.icon)
				{
					return feature.icon;
				}

				return feature.included ? 'check_circle' : 'remove';
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<div ot-if="hasRibbon" class="ribbon">{{ ribbon }}</div>

					<div class="header">
						<div ot-if="icon || badge" class="top">
							<div ot-if="icon" class="icon"><i>{{ icon }}</i></div>
							<span ot-if="badge" class="badge">{{ badge }}</span>
						</div>

						<h3 class="name">{{ name }}</h3>
						<p ot-if="description" class="desc">{{ description }}</p>

						<div class="price">
							<span ot-if="currency" class="currency">{{ currency }}</span>
							<span class="amount">{{ price }}</span>
							<span ot-if="period" class="period">{{ period }}</span>
						</div>

						<span ot-if="hasOriginal" class="original"><span class="strike">{{ currency }}{{ original }}</span></span>
						<span ot-if="hasYearly" class="yearly">{{ yearly }}</span>
					</div>

					<div ot-if="hasFeatures" class="features">
						<div
							ot-for="feature in features"
							:class="featureClass(feature)"
						>
							<i class="icon">{{ featureIcon(feature) }}</i>
							<span class="text">{{ feature.text }}</span>
						</div>
					</div>

					<div ot-if="cta" class="action">
						<e-form-button
							:text="cta"
							:icon="ctaIcon"
							:href="href"
							:color="tone === 'featured' || tone === 'highlighted' ? 'brand' : ''"
							:background="tone === 'featured' || tone === 'highlighted' ? '' : 'bg-2'"
							:border="tone !== 'featured' && tone !== 'highlighted'"
							:variant="['full']"
							:_click="handle"
						></e-form-button>
					</div>
				</div>
			`;
		}
	});
});
