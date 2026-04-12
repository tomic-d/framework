onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'navigation-footer',
		icon: 'call_to_action',
		name: 'Footer',
		description: 'Site footer with brand column, link groups, social icons, newsletter, legal bar and slots.',
		category: 'Navigation',
		config:
		{
			logo:
			{
				type: 'string',
				value: '',
				description: 'Logo image URL.'
			},
			logoAlt:
			{
				type: 'string',
				value: 'Logo',
				description: 'Logo alt text.'
			},
			brandHref:
			{
				type: 'string',
				value: '/',
				description: 'Logo link destination.'
			},
			tagline:
			{
				type: 'string',
				value: '',
				description: 'Short brand description.'
			},
			groups:
			{
				type: 'array',
				value: [],
				description: 'Link groups with title and items.',
				each:
				{
					type: 'object',
					config:
					{
						title: { type: 'string', description: 'Group heading.' },
						items:
						{
							type: 'array',
							each:
							{
								type: 'object',
								config:
								{
									icon: { type: 'string', description: 'Item icon.' },
									label: { type: 'string', description: 'Item label.' },
									href: { type: 'string', description: 'Item link.' },
									target: { type: 'string', description: 'Link target.' },
									badge: { type: 'string', description: 'Badge text.' }
								}
							}
						}
					}
				}
			},
			social:
			{
				type: 'array',
				value: [],
				description: 'Social media links.',
				each:
				{
					type: 'object',
					config:
					{
						icon: { type: 'string', description: 'Icon name.' },
						label: { type: 'string', description: 'Tooltip label.' },
						href: { type: 'string', description: 'Profile URL.' }
					}
				}
			},
			legal:
			{
				type: 'array',
				value: [],
				description: 'Legal links in bottom bar.',
				each:
				{
					type: 'object',
					config:
					{
						label: { type: 'string', description: 'Link label.' },
						href: { type: 'string', description: 'Link URL.' }
					}
				}
			},
			copyright:
			{
				type: 'string',
				value: '',
				description: 'Copyright text.'
			},
			newsletter:
			{
				type: 'boolean',
				value: false,
				description: 'Show newsletter form.'
			},
			newsletterTitle:
			{
				type: 'string',
				value: 'Stay in the loop',
				description: 'Newsletter heading.'
			},
			newsletterDescription:
			{
				type: 'string',
				value: 'Get product updates and tips straight to your inbox.',
				description: 'Newsletter subtext.'
			},
			newsletterPlaceholder:
			{
				type: 'string',
				value: 'you@example.com',
				description: 'Email input placeholder.'
			},
			newsletterButton:
			{
				type: 'string',
				value: 'Subscribe',
				description: 'Submit button text.'
			},
			background:
			{
				type: 'string',
				value: 'bg-1',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Footer background depth.'
			},
			variant:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				options: ['border', 'clean'],
				description: 'Visual modifiers.'
			},
			_subscribe:
			{
				type: 'function',
				description: 'Newsletter submit handler. Receives { value }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

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

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.background];

				if(this.variant.includes('border'))
				{
					list.push('border');
				}

				if(this.variant.includes('clean'))
				{
					list.push('clean');
				}

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

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

			/* ===== RENDER ===== */

			return /* html */ `
				<footer :class="classes()">
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
										background="bg-2"
									></e-form-input>
									<e-form-button
										:text="newsletterButton"
										icon-right="arrow_forward"
										:_click="subscribe"
										color="brand"
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
