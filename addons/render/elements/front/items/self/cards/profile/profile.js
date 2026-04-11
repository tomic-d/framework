onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'cards-profile',
		icon: 'account_circle',
		name: 'Profile Card',
		description: 'Generic profile card with avatar, name, role, bio, stats, tags, meta and action slots.',
		category: 'Cards',
		author: 'OneType',
		config: {
			avatar: {
				type: 'string'
			},
			name: {
				type: 'string'
			},
			role: {
				type: 'string'
			},
			verified: {
				type: 'boolean'
			},
			cover: {
				type: 'string'
			},
			description: {
				type: 'string'
			},
			meta: {
				type: 'string'
			},
			href: {
				type: 'string'
			},
			tags: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						icon: { type: 'string' },
						label: { type: 'string' }
					}
				}
			},
			stats: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						num: { type: 'string|number' },
						label: { type: 'string' }
					}
				}
			},
			socials: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						icon: { type: 'string' },
						label: { type: 'string' },
						href: { type: 'string' },
						target: { type: 'string' }
					}
				}
			},
			following: {
				type: 'boolean'
			},
			orientation: {
				type: 'string',
				value: 'vertical',
				options: ['vertical', 'horizontal']
			},
			variant: {
				type: 'array',
				value: ['bg-1', 'border', 'size-m'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'size-s', 'size-m', 'size-l']
			},
			_follow: {
				type: 'function'
			},
			_click: {
				type: 'function'
			}
		},
		render: function()
		{
			this.hasCover = !!this.cover;
			this.hasTags = this.tags && this.tags.length > 0;
			this.hasStats = this.stats && this.stats.length > 0;
			this.hasSocials = this.socials && this.socials.length > 0;
			this.hasActions = !!this.Slots.actions;
			this.hasDefaultFollow = !this.hasActions && !!this._follow;

			this.toggle = (event) =>
			{
				this.following = !this.following;

				if(this._follow)
				{
					this._follow({ event, value: this.following });
				}
			};

			this.click = (event) =>
			{
				if(this._click)
				{
					this._click({ event });
				}
			};

			return /* html */ `
				<div :class="'holder ' + orientation + ' ' + variant.join(' ')">
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
							ot-if="hasDefaultFollow"
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
