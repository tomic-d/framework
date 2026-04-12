onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'cards-share',
		icon: 'share',
		name: 'Share Card',
		description: 'Share toolbar with copy, native share, bookmark, like and social platforms.',
		category: 'Cards',
		config:
		{
			title:
			{
				type: 'string',
				value: '',
				description: 'Optional label above actions.'
			},
			url:
			{
				type: 'string',
				value: '',
				description: 'URL to share and copy.'
			},
			text:
			{
				type: 'string',
				value: '',
				description: 'Share text for social platforms.'
			},
			actions:
			{
				type: 'array',
				value: ['copy', 'share', 'bookmark', 'like'],
				each:
				{
					type: 'string',
					options: ['copy', 'share', 'bookmark', 'like']
				},
				description: 'Visible action buttons.'
			},
			platforms:
			{
				type: 'array',
				value: [],
				each:
				{
					type: 'string',
					options: ['twitter', 'facebook', 'linkedin', 'whatsapp', 'telegram', 'email']
				},
				description: 'Social platform links.'
			},
			liked:
			{
				type: 'boolean',
				value: false,
				description: 'Pre-filled liked state.'
			},
			saved:
			{
				type: 'boolean',
				value: false,
				description: 'Pre-filled saved state.'
			},
			likes:
			{
				type: 'number',
				description: 'Like count display.'
			},
			comments:
			{
				type: 'number',
				description: 'Comment count display.'
			},
			shares:
			{
				type: 'number',
				description: 'Share count display.'
			},
			orientation:
			{
				type: 'string',
				value: 'horizontal',
				options: ['horizontal', 'vertical'],
				description: 'Layout direction.'
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
				description: 'Action button size.'
			},
			variant:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				options: ['border', 'compact', 'inline'],
				description: 'Visual modifiers.'
			},
			_copy:
			{
				type: 'function',
				description: 'Copy handler. Receives { value }.'
			},
			_share:
			{
				type: 'function',
				description: 'Share handler. Receives { value }.'
			},
			_save:
			{
				type: 'function',
				description: 'Save handler. Receives { value }.'
			},
			_like:
			{
				type: 'function',
				description: 'Like handler. Receives { value }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.copied = false;
			this.hasCopy = this.actions.includes('copy');
			this.hasShare = this.actions.includes('share');
			this.hasBookmark = this.actions.includes('bookmark');
			this.hasLike = this.actions.includes('like');
			this.hasPlatforms = this.platforms.length > 0;

			this.buildHref = (key) =>
			{
				const url = encodeURIComponent(this.url || '');
				const text = encodeURIComponent(this.text || '');

				const urls = {
					twitter: 'https://twitter.com/intent/tweet?url=' + url + '&text=' + text,
					facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
					linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + url,
					whatsapp: 'https://wa.me/?text=' + text + '%20' + url,
					telegram: 'https://t.me/share/url?url=' + url + '&text=' + text,
					email: 'mailto:?subject=' + text + '&body=' + url
				};

				return urls[key] || '#';
			};

			this.platformList = this.platforms.map(key =>
			{
				const meta = platforms[key];

				if(!meta)
				{
					return null;
				}

				return {
					id: key,
					label: meta.label,
					svg: meta.svg || '',
					icon: meta.icon || '',
					href: this.buildHref(key)
				};
			}).filter(Boolean);

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.orientation, this.background, 'size-' + this.size];

				this.variant.forEach(v => list.push(v));

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

			this.copy = () =>
			{
				if(navigator.clipboard && this.url)
				{
					navigator.clipboard.writeText(this.url);
				}

				this.copied = true;

				if(this._copy)
				{
					this._copy({ value: this.url });
				}

				setTimeout(() =>
				{
					this.copied = false;
				}, 1800);
			};

			this.share = async () =>
			{
				if(navigator.share && this.url)
				{
					try
					{
						await navigator.share({
							title: this.title,
							text: this.text,
							url: this.url
						});
					}
					catch(error)
					{
					}
				}

				if(this._share)
				{
					this._share({ value: this.url });
				}
			};

			this.toggleSave = () =>
			{
				this.saved = !this.saved;

				if(this._save)
				{
					this._save({ value: this.saved });
				}
			};

			this.toggleLike = () =>
			{
				this.liked = !this.liked;

				if(this._like)
				{
					this._like({ value: this.liked });
				}
			};

			this.formatCount = (value) =>
			{
				if(value == null)
				{
					return '';
				}

				if(value >= 1000000)
				{
					return (value / 1000000).toFixed(1) + 'M';
				}

				if(value >= 1000)
				{
					return (value / 1000).toFixed(1) + 'K';
				}

				return String(value);
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<div ot-if="title" class="title">{{ title }}</div>

					<div class="actions">
						<button
							ot-if="hasCopy"
							type="button"
							:class="'action' + (copied ? ' copied' : '')"
							:ot-tooltip="{ text: copied ? 'Copied!' : 'Copy link', position: { x: 'center', y: 'top' } }"
							ot-click="copy"
						>
							<i ot-if="!copied">link</i>
							<i ot-if="copied">check</i>
						</button>

						<button
							ot-if="hasShare"
							type="button"
							class="action"
							:ot-tooltip="{ text: 'Share', position: { x: 'center', y: 'top' } }"
							ot-click="share"
						>
							<i>ios_share</i>
							<span ot-if="shares != null" class="count">{{ formatCount(shares) }}</span>
						</button>

						<button
							ot-if="hasBookmark"
							type="button"
							:class="'action' + (saved ? ' saved' : '')"
							:ot-tooltip="{ text: saved ? 'Saved' : 'Save', position: { x: 'center', y: 'top' } }"
							ot-click="toggleSave"
						>
							<i ot-if="!saved">bookmark_border</i>
							<i ot-if="saved">bookmark</i>
						</button>

						<button
							ot-if="hasLike"
							type="button"
							:class="'action' + (liked ? ' liked' : '')"
							:ot-tooltip="{ text: liked ? 'Liked' : 'Like', position: { x: 'center', y: 'top' } }"
							ot-click="toggleLike"
						>
							<i ot-if="!liked">favorite_border</i>
							<i ot-if="liked">favorite</i>
							<span ot-if="likes != null" class="count">{{ formatCount(likes) }}</span>
						</button>
					</div>

					<div ot-if="hasPlatforms" class="platforms">
						<a
							ot-for="platform in platformList"
							class="platform"
							:href="platform.href"
							target="_blank"
							rel="noopener"
							:data-platform="platform.id"
							:ot-tooltip="{ text: platform.label, position: { x: 'center', y: 'top' } }"
						>
							<span ot-if="platform.svg" ot-html="platform.svg"></span>
							<i ot-if="!platform.svg && platform.icon">{{ platform.icon }}</i>
						</a>
					</div>
				</div>
			`;
		}
	});

	/* ===== PLATFORM META ===== */

	const platforms =
	{
		twitter:
		{
			label: 'Twitter',
			svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>'
		},
		facebook:
		{
			label: 'Facebook',
			svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'
		},
		linkedin:
		{
			label: 'LinkedIn',
			svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>'
		},
		whatsapp:
		{
			label: 'WhatsApp',
			svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>'
		},
		telegram:
		{
			label: 'Telegram',
			svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>'
		},
		email:
		{
			label: 'Email',
			icon: 'mail'
		}
	};
});
