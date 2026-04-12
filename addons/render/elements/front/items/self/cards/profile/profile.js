onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'cards-profile',
		icon: 'account_circle',
		name: 'Profile Card',
		description: 'Profile card with avatar, cover, stats, tags, socials and actions.',
		category: 'Cards',
		config:
		{
			avatar:
			{
				type: 'string',
				value: '',
				description: 'Avatar image URL.'
			},
			name:
			{
				type: 'string',
				value: '',
				description: 'Display name.'
			},
			role:
			{
				type: 'string',
				value: '',
				description: 'Role or subtitle.'
			},
			verified:
			{
				type: 'boolean',
				value: false,
				description: 'Show verified badge.'
			},
			cover:
			{
				type: 'string',
				value: '',
				description: 'Cover image URL.'
			},
			description:
			{
				type: 'string',
				value: '',
				description: 'Bio or short description.'
			},
			meta:
			{
				type: 'string',
				value: '',
				description: 'Small meta text.'
			},
			href:
			{
				type: 'string',
				value: '',
				description: 'Card link URL.'
			},
			tags:
			{
				type: 'array',
				value: [],
				each:
				{
					type: 'object',
					config:
					{
						icon: { type: 'string' },
						label: { type: 'string' }
					}
				},
				description: 'Pill tags with optional icon.'
			},
			stats:
			{
				type: 'array',
				value: [],
				each:
				{
					type: 'object',
					config:
					{
						num: { type: 'string|number' },
						label: { type: 'string' }
					}
				},
				description: 'Stat pairs with value and label.'
			},
			socials:
			{
				type: 'array',
				value: [],
				each:
				{
					type: 'object',
					config:
					{
						icon: { type: 'string' },
						label: { type: 'string' },
						href: { type: 'string' },
						target: { type: 'string' }
					}
				},
				description: 'Social link icons.'
			},
			following:
			{
				type: 'boolean',
				value: false,
				description: 'Follow state.'
			},
			orientation:
			{
				type: 'string',
				value: 'vertical',
				options: ['vertical', 'horizontal'],
				description: 'Card layout direction.'
			},
			background:
			{
				type: 'string',
				value: 'bg-1',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Background depth.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Card size.'
			},
			variant:
			{
				type: 'array',
				value: ['border'],
				each: { type: 'string' },
				options: ['border'],
				description: 'Visual modifiers.'
			},
			_follow:
			{
				type: 'function',
				description: 'Follow handler. Receives { event, value }.'
			},
			_click:
			{
				type: 'function',
				description: 'Click handler. Receives { event }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.hasCover = !!this.cover;
			this.hasTags = this.tags && this.tags.length > 0;
			this.hasStats = this.stats && this.stats.length > 0;
			this.hasSocials = this.socials && this.socials.length > 0;
			this.hasActions = !!this.Slots.actions;
			this.hasFollow = !this.hasActions && !!this._follow;

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.orientation, this.background, 'size-' + this.size];

				this.variant.forEach(v => list.push(v));

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

			this.toggle = ({ event }) =>
			{
				this.following = !this.following;

				if(this._follow)
				{
					this._follow({ event, value: this.following });
				}
			};

			this.click = ({ event }) =>
			{
				if(this._click)
				{
					this._click({ event });
				}
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<div ot-if="hasCover" class="cover" :style="'background-image: url(' + cover + ')'"></div>

					<div class="body">
						<div class="head">
							<div class="avatar" :style="avatar ? 'background-image: url(' + avatar + ')' : ''">
								<i ot-if="!avatar">person</i>
							</div>
							<div class="identity">
								<div class="name">
									<span>{{ name }}</span>
									<i ot-if="verified" class="verified">verified</i>
								</div>
								<div ot-if="role" class="role">{{ role }}</div>
							</div>
						</div>

						<p ot-if="description" class="description">{{ description }}</p>

						<div ot-if="hasTags" class="tags">
							<span ot-for="tag in tags" class="tag">
								<i ot-if="tag.icon">{{ tag.icon }}</i>
								<span>{{ tag.label }}</span>
							</span>
						</div>

						<div ot-if="meta" class="meta">{{ meta }}</div>

						<div ot-if="hasStats" class="stats">
							<div ot-for="stat in stats" class="stat">
								<div class="num">{{ stat.num }}</div>
								<div class="label">{{ stat.label }}</div>
							</div>
						</div>

						<div ot-if="hasSocials" class="socials">
							<a
								ot-for="social in socials"
								class="social"
								:href="social.href"
								:target="social.target"
								:ot-tooltip="social.label ? { text: social.label, position: { x: 'center', y: 'top' } } : null"
							>
								<i>{{ social.icon }}</i>
							</a>
						</div>

						<div ot-if="hasActions" class="actions">
							<slot name="actions"></slot>
						</div>

						<button
							ot-if="hasFollow"
							:class="'follow' + (following ? ' active' : '')"
							type="button"
							ot-click="toggle"
						>
							<i ot-if="!following">add</i>
							<i ot-if="following">check</i>
							<span>{{ following ? 'Following' : 'Follow' }}</span>
						</button>
					</div>

					<a ot-if="href" class="link" :href="href" ot-click="click"></a>
				</div>
			`;
		}
	});
});
