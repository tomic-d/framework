onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-gallery',
		icon: 'photo_library',
		name: 'Gallery',
		description: 'Image gallery with bento, grid and carousel layouts plus built-in lightbox.',
		category: 'Global',
		config:
		{
			images:
			{
				type: 'array',
				value: [],
				each: { type: 'string|object' },
				description: 'Array of URL strings or { src, alt, caption, thumb } objects.'
			},
			layout:
			{
				type: 'string',
				value: 'bento',
				options: ['bento', 'grid', 'carousel'],
				description: 'Gallery layout mode.'
			},
			columns:
			{
				type: 'number',
				value: 4,
				description: 'Grid column count.'
			},
			ratio:
			{
				type: 'string',
				value: '16/9',
				description: 'Aspect ratio for grid items and carousel stage.'
			},
			gap:
			{
				type: 'number',
				value: 4,
				description: 'Gap between items in pixels.'
			},
			height:
			{
				type: 'string',
				value: 'default',
				options: ['compact', 'default', 'tall'],
				description: 'Bento layout height.'
			},
			maxVisible:
			{
				type: 'number',
				value: 5,
				description: 'Max visible images in bento before show-all badge.'
			},
			lightbox:
			{
				type: 'boolean',
				value: true,
				description: 'Enable lightbox on click.'
			},
			showAll:
			{
				type: 'boolean',
				value: true,
				description: 'Show floating all-photos button in bento.'
			},
			rounded:
			{
				type: 'boolean',
				value: true,
				description: 'Apply border-radius to gallery.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Gallery size scale.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.normalized = this.images.map((image, index) =>
			{
				if(typeof image === 'string')
				{
					return { src: image, alt: '', caption: '', thumb: image, index };
				}

				return {
					src: image.src || '',
					alt: image.alt || '',
					caption: image.caption || '',
					thumb: image.thumb || image.src || '',
					index
				};
			});

			this.total = this.normalized.length;
			this.hero = this.normalized[0] || null;
			this.thumbs = this.normalized.slice(1, this.maxVisible);
			this.remaining = Math.max(0, this.total - this.maxVisible);
			this.hasThumbs = this.thumbs.length > 0;
			this.hasHero = !!this.hero;
			this.gridImages = this.normalized;
			this.activeIndex = 0;
			this.activeImage = this.normalized[0] || null;

			this.isBento = this.layout === 'bento';
			this.isGrid = this.layout === 'grid';
			this.isCarousel = this.layout === 'carousel';

			this.gridStyle = `grid-template-columns: repeat(${this.columns}, minmax(0, 1fr)); gap: ${this.gap}px;`;
			this.bentoStyle = `gap: ${this.gap}px;`;

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', 'layout-' + this.layout, 'size-' + this.size];

				if(this.height !== 'default')
				{
					list.push(this.height);
				}

				if(this.rounded)
				{
					list.push('rounded');
				}

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

			this.selectCarousel = (index) =>
			{
				if(index < 0 || index >= this.total)
				{
					return;
				}

				this.activeIndex = index;
				this.activeImage = this.normalized[index];
			};

			this.next = () =>
			{
				this.selectCarousel((this.activeIndex + 1) % this.total);
			};

			this.prev = () =>
			{
				this.selectCarousel((this.activeIndex - 1 + this.total) % this.total);
			};

			this.openLightbox = (startIndex) =>
			{
				if(!this.lightbox || !this.total)
				{
					return;
				}

				const images = this.normalized;
				const total = this.total;

				popup.Fn('modal', function()
				{
					this.images = images;
					this.total = total;
					this.index = startIndex || 0;
					this.current = images[this.index];

					this.OnReady(() =>
					{
						this.keydown = (event) =>
						{
							if(event.key === 'ArrowRight')
							{
								this.next();
							}
							else if(event.key === 'ArrowLeft')
							{
								this.prev();
							}
						};

						document.addEventListener('keydown', this.keydown);
					});

					this.OnDestroy(() =>
					{
						if(this.keydown)
						{
							document.removeEventListener('keydown', this.keydown);
						}
					});

					this.go = (index) =>
					{
						if(index < 0)
						{
							index = this.total - 1;
						}

						if(index >= this.total)
						{
							index = 0;
						}

						this.index = index;
						this.current = this.images[index];
					};

					this.next = () => this.go(this.index + 1);
					this.prev = () => this.go(this.index - 1);
					this.close = () => $ot.close();

					return /* html */ `
						<div class="lightbox-box">
							<button class="lightbox-close" type="button" ot-click="close">
								<i>close</i>
							</button>

							<div class="lightbox-counter">{{ (index + 1) + ' / ' + total }}</div>

							<button ot-if="total > 1" class="lightbox-nav prev" type="button" ot-click="prev">
								<i>chevron_left</i>
							</button>

							<div class="lightbox-stage">
								<img :src="current.src" :alt="current.alt || ''" />
								<div ot-if="current.caption" class="lightbox-caption">{{ current.caption }}</div>
							</div>

							<button ot-if="total > 1" class="lightbox-nav next" type="button" ot-click="next">
								<i>chevron_right</i>
							</button>

							<div ot-if="total > 1" class="lightbox-thumbs">
								<button
									ot-for="image, i in images"
									type="button"
									:class="'lightbox-thumb' + (i === index ? ' active' : '')"
									ot-click="() => go(i)"
								>
									<img :src="image.thumb" alt="" />
								</button>
							</div>
						</div>
					`;
				}, { id: 'gallery-lightbox', backdrop: 0.85 });
			};

			this.openAt = (image) =>
			{
				this.openLightbox(image.index);
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<div ot-if="isBento && hasHero" class="bento" :style="bentoStyle">
						<div class="bento-main" ot-click="() => openAt(hero)">
							<img :src="hero.src" :alt="hero.alt || ''" />
						</div>

						<div ot-if="hasThumbs" class="bento-side" :style="'gap: ' + gap + 'px'">
							<div
								ot-for="thumb in thumbs"
								class="bento-thumb"
								ot-click="() => openAt(thumb)"
							>
								<img :src="thumb.src" :alt="thumb.alt || ''" />
							</div>
						</div>

						<button
							ot-if="showAll && remaining > 0"
							type="button"
							class="show-all"
							ot-click="() => openLightbox(0)"
						>
							<i>grid_view</i>
							<span>Show all {{ total }} photos</span>
						</button>
					</div>

					<div ot-if="isGrid" class="grid" :style="gridStyle">
						<div
							ot-for="image in gridImages"
							class="grid-item"
							:style="'aspect-ratio: ' + ratio"
							ot-click="() => openAt(image)"
						>
							<img :src="image.src" :alt="image.alt || ''" />
						</div>
					</div>

					<div ot-if="isCarousel && hasHero" class="carousel">
						<div class="carousel-stage" :style="'aspect-ratio: ' + ratio">
							<img :src="activeImage.src" :alt="activeImage.alt || ''" ot-click="() => openAt(activeImage)" />

							<button ot-if="total > 1" class="carousel-nav prev" type="button" ot-click="prev">
								<i>chevron_left</i>
							</button>

							<button ot-if="total > 1" class="carousel-nav next" type="button" ot-click="next">
								<i>chevron_right</i>
							</button>

							<div ot-if="total > 1" class="carousel-counter">{{ (activeIndex + 1) + ' / ' + total }}</div>
						</div>

						<div ot-if="total > 1" class="carousel-thumbs">
							<button
								ot-for="image, i in normalized"
								type="button"
								:class="'carousel-thumb' + (i === activeIndex ? ' active' : '')"
								ot-click="() => selectCarousel(i)"
							>
								<img :src="image.thumb" :alt="image.alt || ''" />
							</button>
						</div>
					</div>
				</div>
			`;
		}
	});
});
