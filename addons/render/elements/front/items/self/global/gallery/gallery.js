onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-gallery',
		icon: 'photo_library',
		name: 'Gallery',
		description: 'Premium image gallery with bento, grid and carousel layouts plus built-in lightbox (no transform dependency).',
		category: 'Global',
		author: 'OneType',
		config: {
			images: {
				type: 'array',
				value: [],
				each: { type: 'string|object' }
			},
			layout: {
				type: 'string',
				value: 'bento',
				options: ['bento', 'grid', 'carousel']
			},
			columns: {
				type: 'number',
				value: 4
			},
			ratio: {
				type: 'string',
				value: '16/9'
			},
			gap: {
				type: 'number',
				value: 4
			},
			maxVisible: {
				type: 'number',
				value: 5
			},
			lightbox: {
				type: 'boolean',
				value: true
			},
			showAllButton: {
				type: 'boolean',
				value: true
			},
			variant: {
				type: 'array',
				value: ['rounded'],
				options: ['rounded', 'compact', 'tall', 'size-s', 'size-m', 'size-l']
			}
		},
		render: function()
		{
			// Normalize images — accept string URLs or objects

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

			// Bento layout data

			this.hero = this.normalized[0] || null;
			this.thumbs = this.normalized.slice(1, this.maxVisible);
			this.remaining = Math.max(0, this.total - this.maxVisible);
			this.hasThumbs = this.thumbs.length > 0;
			this.hasHero = !!this.hero;

			// Grid layout — all images

			this.gridImages = this.normalized;

			// Carousel state

			this.activeIndex = 0;
			this.activeImage = this.normalized[0] || null;

			this.isBento = this.layout === 'bento';
			this.isGrid = this.layout === 'grid';
			this.isCarousel = this.layout === 'carousel';

			// Style hooks

			this.gridStyle = `grid-template-columns: repeat(${this.columns}, minmax(0, 1fr)); gap: ${this.gap}px;`;
			this.bentoStyle = `gap: ${this.gap}px;`;
			this.carouselRatio = this.ratio;
			this.gridRatio = this.ratio;

			// Carousel actions

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

			// Lightbox open — builds a self-contained modal render

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
						if(index < 0) index = this.total - 1;
						if(index >= this.total) index = 0;
						this.index = index;
						this.current = this.images[index];
					};

					this.next = () => this.go(this.index + 1);
					this.prev = () => this.go(this.index - 1);

					this.close = () => $ot.close();

					return /* html */ `
						<div class="lightbox-holder">
							<button class="lightbox-close" type="button" ot-click="close">
								<i>close</i>
							</button>

							<div class="lightbox-counter">{{ (index + 1) + ' / ' + total }}</div>

							<button ot-if="total > 1" class="lightbox-nav lightbox-prev" type="button" ot-click="prev">
								<i>chevron_left</i>
							</button>

							<div class="lightbox-stage">
								<img :src="current.src" :alt="current.alt || ''" />
								<div ot-if="current.caption" class="lightbox-caption">{{ current.caption }}</div>
							</div>

							<button ot-if="total > 1" class="lightbox-nav lightbox-next" type="button" ot-click="next">
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

			this.openLightboxAt = (image) =>
			{
				this.openLightbox(image.index);
			};

			return /* html */ `
				<div :class="'holder ' + variant.join(' ') + ' layout-' + layout">
					<div ot-if="isBento && hasHero" class="bento" :style="bentoStyle">
						<div class="bento-main" ot-click="() => openLightboxAt(hero)">
							<img :src="hero.src" :alt="hero.alt || ''" />
						</div>

						<div ot-if="hasThumbs" class="bento-side" :style="'gap: ' + gap + 'px'">
							<div
								ot-for="thumb in thumbs"
								class="bento-thumb"
								ot-click="() => openLightboxAt(thumb)"
							>
								<img :src="thumb.src" :alt="thumb.alt || ''" />
							</div>
						</div>

						<button
							ot-if="showAllButton && remaining > 0"
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
							:style="'aspect-ratio: ' + gridRatio"
							ot-click="() => openLightboxAt(image)"
						>
							<img :src="image.src" :alt="image.alt || ''" />
						</div>
					</div>

					<div ot-if="isCarousel && hasHero" class="carousel">
						<div class="carousel-stage" :style="'aspect-ratio: ' + carouselRatio">
							<img :src="activeImage.src" :alt="activeImage.alt || ''" ot-click="() => openLightboxAt(activeImage)" />

							<button ot-if="total > 1" class="carousel-nav carousel-prev" type="button" ot-click="prev">
								<i>chevron_left</i>
							</button>

							<button ot-if="total > 1" class="carousel-nav carousel-next" type="button" ot-click="next">
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
