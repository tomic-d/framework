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
						value:
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
				value: 'bg-2',
				options: ['bg-1', 'bg-2', 'bg-3'],
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

			this.leftSearch = '';
			this.rightSearch = '';
			this.loading = false;

			/* ===== ASYNC ITEMS ===== */

			this.itemsCallback = null;
			this.resolved = [];

			this.fetchItems = async (search) =>
			{
				this.loading = true;
				this.State.ready && this.Update();

				try
				{
					const result = await this.itemsCallback.call(this, { search: search || '', selected: this.value || [] });
					this.resolved = Array.isArray(result) ? result : [];
				}
				catch(error)
				{
					this.resolved = [];
				}

				this.loading = false;
				this.sync();
				this.State.ready && this.Update();
			};

			this.fetchItemsDebounced = onetype.HelperDebounce((search) => this.fetchItems(search), 300);

			/* Props can re-push the raw items on every data update, so nothing reads them
			   directly. list() resolves at read time, a function becomes the fetched list. */

			this.list = () =>
			{
				if(typeof this.items === 'function')
				{
					if(this.itemsCallback !== this.items)
					{
						this.itemsCallback = this.items;
						this.resolved = [];
						this.fetchItems('');
					}

					return this.resolved;
				}

				if(this.itemsCallback)
				{
					return this.resolved;
				}

				return Array.isArray(this.items) ? this.items : [];
			};


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
				if(this.itemsCallback || !query)
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
				const available = this.list().filter(item => !this.isSelected(item.value));
				const selected = this.list().filter(item => this.isSelected(item.value));

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

				/* Single click moves the item to the selected side immediately. */

				if(this.slotsLeft() <= 0 && !this.value.includes(item.value))
				{
					return;
				}

				if(!this.value.includes(item.value))
				{
					this.value.push(item.value);
				}

				this.emit();
				this.sync();
				this.Update();
			};

			this.toggleRight = (item) =>
			{
				if(this.disabled || item.disabled)
				{
					return;
				}

				/* Single click moves the item back to the available side. */

				this.value = this.value.filter(id => id !== item.value);
				this.emit();
				this.sync();
				this.Update();
			};

			this.emit = () =>
			{
				const ordered = this.list().filter(item => this.value.includes(item.value)).map(item => item.value);
				this.value = ordered;

				if(this._change)
				{
					this._change({ value: this.value });
				}
			};

			this.moveAllRight = () =>
			{
				if(this.disabled)
				{
					return;
				}

				const eligible = this.list().filter(item => !item.disabled && !this.isSelected(item.value));
				const slots = this.slotsLeft();
				const ids = eligible.slice(0, slots).map(item => item.value);

				ids.forEach(id =>
				{
					if(!this.value.includes(id))
					{
						this.value.push(id);
					}
				});

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

				const keepIds = this.list().filter(item => item.disabled && this.isSelected(item.value)).map(item => item.value);
				this.value = keepIds;
				this.emit();
				this.sync();
				this.Update();
			};

			this.changeLeftSearch = ({ value }) =>
			{
				this.leftSearch = value;

				if(this.itemsCallback)
				{
					this.fetchItemsDebounced(value);
				}
			};

			this.changeRightSearch = ({ value }) =>
			{
				this.rightSearch = value;
			};

			/* ===== BUTTON STATES ===== */

			this.canMoveAllRight = () =>
			{
				if(this.disabled || this.atMax())
				{
					return false;
				}

				return this.list().some(item => !item.disabled && !this.isSelected(item.value));
			};

			this.canMoveAllLeft = () =>
			{
				if(this.disabled)
				{
					return false;
				}

				return this.list().some(item => !item.disabled && this.isSelected(item.value));
			};

			/* ===== SYNC ===== */

			this.sync = () =>
			{
				const state = this.computed();

				this.availableList = state.availableFiltered;
				this.selectedList = state.selectedFiltered;
				this.availableCount = state.available.length;
				this.selectedCount = state.selected.length;
				this.totalCount = this.list().length;
				this.maxLabel = this.max ? this.max : this.list().length;
			};

			this.Compute(() =>
			{
				this.sync();
			});

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
								:class="'item' + (item.disabled ? ' disabled' : '')"
								:disabled="item.disabled || disabled"
								ot-click="() => toggleLeft(item)"
							>
								<i ot-if="item.icon" class="item-icon">{{ item.icon }}</i>
								<div class="item-text">
									<span class="item-label">{{ item.label }}</span>
									<span ot-if="item.description" class="item-desc">{{ item.description }}</span>
								</div>
								<i class="item-move">add</i>
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
								:class="'item' + (item.disabled ? ' disabled' : '')"
								:disabled="item.disabled || disabled"
								ot-click="() => toggleRight(item)"
							>
								<i ot-if="item.icon" class="item-icon">{{ item.icon }}</i>
								<div class="item-text">
									<span class="item-label">{{ item.label }}</span>
									<span ot-if="item.description" class="item-desc">{{ item.description }}</span>
								</div>
								<i class="item-move">close</i>
							</button>
						</div>
					</div>
				</div>
			`;
		}
	});
});
