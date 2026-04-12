onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-transfer',
		icon: 'swap_horiz',
		name: 'Transfer',
		description: 'Two-panel transfer list with search, bulk actions and max limit.',
		category: 'Form',
		config:
		{
			value:
			{
				type: 'array',
				value: [],
				each: { type: 'string|number' },
				description: 'Selected item IDs.'
			},
			items:
			{
				type: 'array|function',
				value: [],
				each:
				{
					type: 'object',
					config:
					{
						id:
						{
							type: 'string|number',
							description: 'Unique item identifier.'
						},
						label:
						{
							type: 'string',
							description: 'Display label.'
						},
						description:
						{
							type: 'string',
							description: 'Secondary text.'
						},
						icon:
						{
							type: 'string',
							description: 'Material icon name.'
						},
						disabled:
						{
							type: 'boolean',
							description: 'Prevent moving this item.'
						}
					}
				},
				description: 'All available items.'
			},
			max:
			{
				type: 'number',
				description: 'Maximum selectable items.'
			},
			searchable:
			{
				type: 'boolean',
				value: true,
				description: 'Show search inputs.'
			},
			leftTitle:
			{
				type: 'string',
				value: 'Available',
				description: 'Left panel heading.'
			},
			rightTitle:
			{
				type: 'string',
				value: 'Selected',
				description: 'Right panel heading.'
			},
			emptyLeft:
			{
				type: 'string',
				value: 'No items',
				description: 'Left panel empty text.'
			},
			emptyRight:
			{
				type: 'string',
				value: 'None selected',
				description: 'Right panel empty text.'
			},
			background:
			{
				type: 'string',
				value: 'bg-1',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Panel background depth.'
			},
			variant:
			{
				type: 'array',
				value: ['border'],
				each: { type: 'string' },
				options: ['border', 'border-bottom'],
				description: 'Visual modifiers.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Component size.'
			},
			disabled:
			{
				type: 'boolean',
				value: false,
				description: 'Disable all interaction.'
			},
			_change:
			{
				type: 'function',
				description: 'Change handler. Receives { value }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.leftSelected = [];
			this.rightSelected = [];
			this.leftSearch = '';
			this.rightSearch = '';
			this.loading = false;

			/* ===== ASYNC ITEMS ===== */

			if(typeof this.items === 'function')
			{
				const callback = this.items;
				this.items = [];
				this.loading = true;

				this.OnInit(async () =>
				{
					try
					{
						const result = await callback.call(this);
						this.items = Array.isArray(result) ? result : [];
					}
					catch(error)
					{
						this.items = [];
					}

					this.loading = false;
					this.sync();
					this.Update();
				});
			}

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.background, 'size-' + this.size];

				if(this.variant.includes('border'))
				{
					list.push('border');
				}

				if(this.variant.includes('border-bottom'))
				{
					list.push('border-bottom');
				}

				if(this.disabled)
				{
					list.push('disabled');
				}

				return list.join(' ');
			};

			/* ===== HELPERS ===== */

			this.isSelected = (id) =>
			{
				return this.value.includes(id);
			};

			this.filter = (list, query) =>
			{
				if(!query)
				{
					return list;
				}

				const search = query.toLowerCase();

				return list.filter(item =>
				{
					const label = (item.label || '').toLowerCase();
					const description = (item.description || '').toLowerCase();

					return label.includes(search) || description.includes(search);
				});
			};

			this.atMax = () =>
			{
				return this.max && this.value.length >= this.max;
			};

			this.slotsLeft = () =>
			{
				if(!this.max)
				{
					return Infinity;
				}

				return Math.max(0, this.max - this.value.length);
			};

			this.computed = () =>
			{
				const available = this.items.filter(item => !this.isSelected(item.id));
				const selected = this.items.filter(item => this.isSelected(item.id));

				return {
					available,
					selected,
					availableFiltered: this.filter(available, this.leftSearch),
					selectedFiltered: this.filter(selected, this.rightSearch)
				};
			};

			/* ===== HANDLERS ===== */

			this.toggleLeft = (item) =>
			{
				if(this.disabled || item.disabled)
				{
					return;
				}

				const index = this.leftSelected.indexOf(item.id);

				if(index === -1)
				{
					this.leftSelected.push(item.id);
				}
				else
				{
					this.leftSelected.splice(index, 1);
				}

				this.Update();
			};

			this.toggleRight = (item) =>
			{
				if(this.disabled || item.disabled)
				{
					return;
				}

				const index = this.rightSelected.indexOf(item.id);

				if(index === -1)
				{
					this.rightSelected.push(item.id);
				}
				else
				{
					this.rightSelected.splice(index, 1);
				}

				this.Update();
			};

			this.emit = () =>
			{
				const ordered = this.items.filter(item => this.value.includes(item.id)).map(item => item.id);
				this.value = ordered;

				if(this._change)
				{
					this._change({ value: this.value });
				}
			};

			this.moveRight = () =>
			{
				if(this.disabled)
				{
					return;
				}

				const slots = this.slotsLeft();
				const ids = this.leftSelected.slice(0, slots);

				ids.forEach(id =>
				{
					if(!this.value.includes(id))
					{
						this.value.push(id);
					}
				});

				this.leftSelected = [];
				this.emit();
				this.sync();
				this.Update();
			};

			this.moveLeft = () =>
			{
				if(this.disabled)
				{
					return;
				}

				this.value = this.value.filter(id => !this.rightSelected.includes(id));
				this.rightSelected = [];
				this.emit();
				this.sync();
				this.Update();
			};

			this.moveAllRight = () =>
			{
				if(this.disabled)
				{
					return;
				}

				const eligible = this.items.filter(item => !item.disabled && !this.isSelected(item.id));
				const slots = this.slotsLeft();
				const ids = eligible.slice(0, slots).map(item => item.id);

				ids.forEach(id =>
				{
					if(!this.value.includes(id))
					{
						this.value.push(id);
					}
				});

				this.leftSelected = [];
				this.emit();
				this.sync();
				this.Update();
			};

			this.moveAllLeft = () =>
			{
				if(this.disabled)
				{
					return;
				}

				const keepIds = this.items.filter(item => item.disabled && this.isSelected(item.id)).map(item => item.id);
				this.value = keepIds;
				this.rightSelected = [];
				this.emit();
				this.sync();
				this.Update();
			};

			this.changeLeftSearch = ({ value }) =>
			{
				this.leftSearch = value;
			};

			this.changeRightSearch = ({ value }) =>
			{
				this.rightSearch = value;
			};

			/* ===== BUTTON STATES ===== */

			this.canMoveRight = () =>
			{
				return !this.disabled && this.leftSelected.length > 0 && !this.atMax();
			};

			this.canMoveLeft = () =>
			{
				return !this.disabled && this.rightSelected.length > 0;
			};

			this.canMoveAllRight = () =>
			{
				if(this.disabled || this.atMax())
				{
					return false;
				}

				return this.items.some(item => !item.disabled && !this.isSelected(item.id));
			};

			this.canMoveAllLeft = () =>
			{
				if(this.disabled)
				{
					return false;
				}

				return this.items.some(item => !item.disabled && this.isSelected(item.id));
			};

			/* ===== SYNC ===== */

			this.sync = () =>
			{
				const state = this.computed();

				this.availableList = state.availableFiltered;
				this.selectedList = state.selectedFiltered;
				this.availableCount = state.available.length;
				this.selectedCount = state.selected.length;
				this.totalCount = this.items.length;
				this.maxLabel = this.max ? this.max : this.items.length;
			};

			this.sync();

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<div class="panel">
						<header class="head">
							<span class="title">{{ leftTitle }}</span>
							<span class="counter">{{ availableCount }} / {{ totalCount }}</span>
						</header>

						<div ot-if="searchable" class="search">
							<e-form-input
								icon="search"
								placeholder="Search…"
								:value="leftSearch"
								:_input="changeLeftSearch"
								background="transparent"
								size="s"
							></e-form-input>
						</div>

						<div class="list">
							<div ot-if="!availableList.length" class="empty">
								<i>inbox</i>
								<span>{{ emptyLeft }}</span>
							</div>
							<button
								ot-for="item in availableList"
								type="button"
								:class="'item' + (leftSelected.includes(item.id) ? ' selected' : '') + (item.disabled ? ' disabled' : '')"
								:disabled="item.disabled || disabled"
								ot-click="() => toggleLeft(item)"
							>
								<i ot-if="item.icon" class="item-icon">{{ item.icon }}</i>
								<div class="item-text">
									<span class="item-label">{{ item.label }}</span>
									<span ot-if="item.description" class="item-desc">{{ item.description }}</span>
								</div>
								<i ot-if="leftSelected.includes(item.id)" class="item-check">check</i>
							</button>
						</div>
					</div>

					<div class="controls">
						<button
							type="button"
							class="control"
							:disabled="!canMoveAllRight()"
							ot-click="moveAllRight"
							:ot-tooltip="{ text: 'Move all', position: { x: 'center', y: 'top' } }"
						>
							<i>keyboard_double_arrow_right</i>
						</button>
						<button
							type="button"
							class="control accent"
							:disabled="!canMoveRight()"
							ot-click="moveRight"
							:ot-tooltip="{ text: 'Move selected', position: { x: 'center', y: 'top' } }"
						>
							<i>chevron_right</i>
						</button>
						<button
							type="button"
							class="control accent"
							:disabled="!canMoveLeft()"
							ot-click="moveLeft"
							:ot-tooltip="{ text: 'Remove selected', position: { x: 'center', y: 'top' } }"
						>
							<i>chevron_left</i>
						</button>
						<button
							type="button"
							class="control"
							:disabled="!canMoveAllLeft()"
							ot-click="moveAllLeft"
							:ot-tooltip="{ text: 'Remove all', position: { x: 'center', y: 'top' } }"
						>
							<i>keyboard_double_arrow_left</i>
						</button>
					</div>

					<div class="panel">
						<header class="head">
							<span class="title">{{ rightTitle }}</span>
							<span class="counter">{{ selectedCount }} / {{ maxLabel }}</span>
						</header>

						<div ot-if="searchable" class="search">
							<e-form-input
								icon="search"
								placeholder="Search…"
								:value="rightSearch"
								:_input="changeRightSearch"
								background="transparent"
								size="s"
							></e-form-input>
						</div>

						<div class="list">
							<div ot-if="!selectedList.length" class="empty">
								<i>playlist_add</i>
								<span>{{ emptyRight }}</span>
							</div>
							<button
								ot-for="item in selectedList"
								type="button"
								:class="'item' + (rightSelected.includes(item.id) ? ' selected' : '') + (item.disabled ? ' disabled' : '')"
								:disabled="item.disabled || disabled"
								ot-click="() => toggleRight(item)"
							>
								<i ot-if="item.icon" class="item-icon">{{ item.icon }}</i>
								<div class="item-text">
									<span class="item-label">{{ item.label }}</span>
									<span ot-if="item.description" class="item-desc">{{ item.description }}</span>
								</div>
								<i ot-if="rightSelected.includes(item.id)" class="item-check">check</i>
							</button>
						</div>
					</div>
				</div>
			`;
		}
	});
});
