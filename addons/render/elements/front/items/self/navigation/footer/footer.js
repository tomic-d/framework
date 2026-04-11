onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'navigation-footer',
		icon: 'call_to_action',
		name: 'Footer',
		description: 'Premium site footer with brand column, link groups, social icons, newsletter, legal bar and slots.',
		category: 'Navigation',
		author: 'OneType',
		config: {
			logo: {
				type: 'string'
			},
			logoAlt: {
				type: 'string',
				value: 'Logo'
			},
			brandHref: {
				type: 'string',
				value: '/'
			},
			tagline: {
				type: 'string'
			},
			groups: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						title: { type: 'string' },
						items: {
							type: 'array',
							each: {
								type: 'object',
								config: {
									icon: { type: 'string' },
									label: { type: 'string' },
									href: { type: 'string' },
									target: { type: 'string' },
									badge: { type: 'string' }
								}
							}
						}
					}
				}
			},
			social: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						icon: { type: 'string' },
						label: { type: 'string' },
						href: { type: 'string' }
					}
				}
			},
			legal: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						label: { type: 'string' },
						href: { type: 'string' }
					}
				}
			},
			copyright: {
				type: 'string'
			},
			newsletter: {
				type: 'boolean'
			},
			newsletterTitle: {
				type: 'string',
				value: 'Stay in the loop'
			},
			newsletterDescription: {
				type: 'string',
				value: 'Get product updates and tips straight to your inbox.'
			},
			newsletterPlaceholder: {
				type: 'string',
				value: 'you@example.com'
			},
			newsletterButton: {
				type: 'string',
				value: 'Subscribe'
			},
			variant: {
				type: 'array',
				value: ['bg-1', 'border-top'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border-top', 'clean']
			},
			_subscribe: {
				type: 'function'
			}
		},
		render: function()
		{
			this.hasTopSlot = !!this.Slots.top;
			this.hasBottomSlot = !!this.Slots.bottom;
			this.hasLogo = !!this.logo;
			this.hasTagline = !!this.tagline;
			this.hasGroups = this.groups && this.groups.length > 0;
			this.hasSocial = this.social && this.social.length > 0;
			this.hasLegal = this.legal && this.legal.length > 0;
			this.hasCopyright = !!this.copyright;
			this.hasBottomBar = this.hasLegal || this.hasCopyright || this.hasSocial;
			this.hasNewsletter = !!this.newsletter;

			this.newsletterEmail = '';

			this.onNewsletterInput = ({ value }) =>
			{
				this.newsletterEmail = value;
			};

			this.subscribe = () =>
			{
				if(!this.newsletterEmail)
				{
					return;
				}

				if(this._subscribe)
				{
					this._subscribe({ value: this.newsletterEmail });
				}

				this.newsletterEmail = '';
			};

			return /* html */ `
				<footer :class="'holder ' + variant.join(' ')">
					<div ot-if="hasTopSlot" class="top-slot">
						<slot name="top"></slot>
					</div>

					<div class="main">
						<div class="brand-col">
							<a ot-if="hasLogo" class="brand" :href="brandHref">
								<img class="brand-logo" :src="logo" :alt="logoAlt" />
							</a>

							<p ot-if="hasTagline" class="tagline">{{ tagline }}</p>

							<div ot-if="hasNewsletter" class="newsletter">
								<div class="newsletter-text">
									<h4 class="newsletter-title">{{ newsletterTitle }}</h4>
									<p ot-if="newsletterDescription" class="newsletter-description">{{ newsletterDescription }}</p>
								</div>
								<form class="newsletter-form" ot-submit.prevent="subscribe">
									<e-form-input
										type="email"
										icon="mail"
										:placeholder="newsletterPlaceholder"
										:value="newsletterEmail"
										:_input="onNewsletterInput"
										:variant="['bg-2', 'border', 'size-m']"
									></e-form-input>
									<e-form-button
										:text="newsletterButton"
										icon-right="arrow_forward"
										:_click="subscribe"
										:variant="['brand', 'size-m']"
									></e-form-button>
								</form>
							</div>
						</div>

						<div ot-if="hasGroups" class="groups">
							<div ot-for="group in groups" class="group">
								<h4 ot-if="group.title" class="group-title">{{ group.title }}</h4>
								<ul class="group-list">
									<li ot-for="item in group.items">
										<a class="group-link" :href="item.href || 'javascript:void(0)'" :target="item.target || null">
											<i ot-if="item.icon">{{ item.icon }}</i>
											<span>{{ item.label }}</span>
											<span ot-if="item.badge" class="group-badge">{{ item.badge }}</span>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div ot-if="hasBottomBar" class="bottom">
						<div ot-if="hasCopyright" class="copyright">{{ copyright }}</div>

						<div ot-if="hasLegal" class="legal">
							<a ot-for="entry in legal" class="legal-link" :href="entry.href || 'javascript:void(0)'">{{ entry.label }}</a>
						</div>

						<div ot-if="hasSocial" class="social">
							<a
								ot-for="entry in social"
								class="social-link"
								:href="entry.href || 'javascript:void(0)'"
								target="_blank"
								rel="noopener"
								:ot-tooltip="{ text: entry.label || '', position: { x: 'center', y: 'top' } }"
							>
								<i>{{ entry.icon }}</i>
							</a>
						</div>
					</div>

					<div ot-if="hasBottomSlot" class="bottom-slot">
						<slot name="bottom"></slot>
					</div>
				</footer>
			`;
		}
	});
});
