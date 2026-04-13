onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-rating',
		icon: 'star',
		name: 'Rating',
		description: 'Star rating with half-stars, custom icon, label and review count.',
		category: 'Form',
		config:
		{
			label:
			{
				type: 'string',
				value: '',
				description: 'Label above stars.'
			},
			description:
			{
				type: 'string',
				value: '',
				description: 'Description below label.'
			},
			value:
			{
				type: 'number',
				value: 0,
				description: 'Current rating value.'
			},
			max:
			{
				type: 'number',
				value: 5,
				description: 'Maximum number of stars.'
			},
			precision:
			{
				type: 'number',
				value: 1,
				options: [1, 0.5],
				description: 'Rating step. 1 for full, 0.5 for half.'
			},
			icon:
			{
				type: 'string',
				value: 'star',
				description: 'Icon name for each star.'
			},
			count:
			{
				type: 'number',
				description: 'Review count shown after stars.'
			},
			showValue:
			{
				type: 'boolean',
				value: false,
				description: 'Show numeric value after stars.'
			},
			color:
			{
				type: 'string',
				value: 'brand',
				options: ['brand', 'blue', 'red', 'orange', 'green'],
				description: 'Fill color for active stars.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Star size.'
			},
			readonly:
			{
				type: 'boolean',
				value: false,
				description: 'Display only, no interaction.'
			},
			disabled:
			{
				type: 'boolean',
				value: false,
				description: 'Disabled state.'
			},
			_change:
			{
				type: 'function',
				description: 'Change handler. Receives { event, value }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.hover = null;

			this.Compute(() =>
			{
				this.hasInfo = !!this.label || !!this.description;
				this.hasMeta = this.showValue || this.count != null;
				this.locked = this.readonly || this.disabled;
			});

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.color, 'size-' + this.size];

				if(this.readonly)
				{
					list.push('readonly');
				}

				if(this.disabled)
				{
					list.push('disabled');
				}

				return list.join(' ');
			};

			/* ===== HELPERS ===== */

			this.stars = () =>
			{
				const result = [];

				for(let i = 0; i < this.max; i++)
				{
					result.push(i);
				}

				return result;
			};

			this.fillFor = (index) =>
			{
				const current = this.hover !== null ? this.hover : this.value;
				const diff = current - index;

				if(diff >= 1)
				{
					return 100;
				}

				if(diff >= 0.5 && this.precision === 0.5)
				{
					return 50;
				}

				if(diff > 0 && this.precision === 1)
				{
					return 100;
				}

				return 0;
			};

			this.computed = () =>
			{
				return this.stars().map(index =>
				{
					const fill = this.fillFor(index);

					return {
						index,
						fill,
						active: fill > 0
					};
				});
			};

			this.formatValue = (value) =>
			{
				if(value == null)
				{
					return '';
				}

				return Number(value).toFixed(this.precision === 0.5 ? 1 : 0);
			};

			/* ===== HANDLERS ===== */

			this.select = (event, index, half) =>
			{
				if(this.locked)
				{
					return;
				}

				let next;

				if(this.precision === 0.5 && half)
				{
					next = index + 0.5;
				}
				else
				{
					next = index + 1;
				}

				if(this.value === next)
				{
					this.value = 0;
				}
				else
				{
					this.value = next;
				}

				if(this._change)
				{
					this._change({ event, value: this.value });
				}
			};

			this.enter = (index, half) =>
			{
				if(this.locked)
				{
					return;
				}

				if(this.precision === 0.5 && half)
				{
					this.hover = index + 0.5;
				}
				else
				{
					this.hover = index + 1;
				}
			};

			this.leave = () =>
			{
				if(this.locked)
				{
					return;
				}

				this.hover = null;
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<div ot-if="hasInfo" class="info">
						<span ot-if="label" class="label">{{ label }}</span>
						<span ot-if="description" class="text">{{ description }}</span>
					</div>
					<div class="row">
						<div class="stars" ot-mouse-leave="leave">
							<button
								ot-for="star in computed()"
								type="button"
								:class="'star fill-' + star.fill + (star.active ? ' active' : '')"
								:disabled="locked"
								ot-click="(event) => select(event, star.index, false)"
								ot-mouse-enter="() => enter(star.index, false)"
							>
								<i class="base">{{ icon }}</i>
								<i class="fill">{{ icon }}</i>
								<span
									ot-if="precision === 0.5"
									class="half"
									ot-click.stop="(event) => select(event, star.index, true)"
									ot-mouse-enter="() => enter(star.index, true)"
								></span>
							</button>
						</div>
						<div ot-if="hasMeta" class="meta">
							<span ot-if="showValue" class="value">{{ formatValue(value) }}</span>
							<span ot-if="count != null" class="count">({{ count }})</span>
						</div>
					</div>
				</div>
			`;
		}
	});
});
