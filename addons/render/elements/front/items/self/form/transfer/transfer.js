onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-transfer',
		icon: 'swap_horiz',
		name: 'Form Transfer',
		description: 'Two-panel transfer list — move items from available to selected with single, bulk and clear actions, search and max limit.',
		category: 'Form',
		author: 'OneType',
		config: {
			value: {
				type: 'array',
				value: [],
				each: { type: 'string|number' }
			},
			items: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						id: { type: 'string|number' },
						label: { type: 'string' },
						description: { type: 'string' },
						icon: { type: 'string' },
						disabled: { type: 'boolean' }
					}
				}
			},
			max: {
				type: 'number'
			},
			searchable: {
				type: 'boolean',
				value: true
			},
			leftTitle: {
				type: 'string',
				value: 'Available'
			},
			rightTitle: {
				type: 'string',
				value: 'Selected'
			},
			emptyLeft: {
				type: 'string',
				value: 'No items'
			},
			emptyRight: {
				type: 'string',
				value: 'None selected'
			},
			disabled: {
				type: 'boolean'
			},
			variant: {
				type: 'array',
				value: ['bg-1', 'border', 'size-m'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'size-s', 'size-m', 'size-l']
			},
			_change: {
				type: 'function'
			}
		},
		render: function()
		{
			// Local UI state

			this.leftSelected = [];
			this.rightSelected = [];
			this.leftSearch = '';
			this.rightSearch = '';

			// Helpers

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
				if(!this.max)
				{
					return false;
				}

				return this.value.length >= this.max;
			};

			this.slotsLeft = () =>
			{
				if(!this.max)
				{
					return Infinity;
				}

				return Math.max(0, this.max - this.value.length);
			};

			// Derived lists

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

			// Toggle selection inside a panel

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

			// Emit change in original items order

			this.emit = () =>
			{
				const ordered = this.items.filter(item => this.value.includes(item.id)).map(item => item.id);
				this.value = ordered;

				if(this._change)
				{
					this._change({ value: this.value });
				}
			};

			// Move actions

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
				this.Update();
			};

			// Search handlers

			this.changeLeftSearch = ({ value }) =>
			{
				this.leftSearch = value;
			};

			this.changeRightSearch = ({ value }) =>
			{
				this.rightSearch = value;
			};

			// Button states

			this.canMoveRight = () =>
			{
				if(this.disabled || !this.leftSelected.length)
				{
					return false;
				}

				if(this.atMax())
				{
					return false;
				}

				return true;
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

				const eligible = this.items.filter(item => !item.disabled && !this.isSelected(item.id));
				return eligible.length > 0;
			};

			this.canMoveAllLeft = () =>
			{
				if(this.disabled)
				{
					return false;
				}

				const removable = this.items.filter(item => !item.disabled && this.isSelected(item.id));
				return removable.length > 0;
			};

			// Build lists for rendering

			const state = this.computed();

			this.availableList = state.availableFiltered;
			this.selectedList = state.selectedFiltered;
			this.availableCount = state.available.length;
			this.selectedCount = state.selected.length;
			this.totalCount = this.items.length;
			this.maxLabel = this.max ? this.max : this.totalCount;

			return /* html */ `
				<div :class="'holder ' + variant.join(' ') + (disabled ? ' disabled' : '')">
					<div class="panel">
						<header class="panel-head">
							<span class="title">{{ leftTitle }}</span>
							<span class="counter">{{ availableCount }} / {{ totalCount }}</span>
						</header>

						<div ot-if="searchable" class="panel-search">
							<e-form-input
								icon="search"
								placeholder="Search…"
								:value="leftSearch"
								:_input="changeLeftSearch"
								:variant="['transparent', 'size-s']"
							></e-form-input>
						</div>

						<div class="panel-list">
							<div ot-if="!availableList.length" class="panel-empty">
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
									<span ot-if="item.description" class="item-description">{{ item.description }}</span>
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
							class="control primary"
							:disabled="!canMoveRight()"
							ot-click="moveRight"
							:ot-tooltip="{ text: 'Move selected', position: { x: 'center', y: 'top' } }"
						>
							<i>chevron_right</i>
						</button>
						<button
							type="button"
							class="control primary"
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
						<header class="panel-head">
							<span class="title">{{ rightTitle }}</span>
							<span class="counter">{{ selectedCount }} / {{ maxLabel }}</span>
						</header>

						<div ot-if="searchable" class="panel-search">
							<e-form-input
								icon="search"
								placeholder="Search…"
								:value="rightSearch"
								:_input="changeRightSearch"
								:variant="['transparent', 'size-s']"
							></e-form-input>
						</div>

						<div class="panel-list">
							<div ot-if="!selectedList.length" class="panel-empty">
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
									<span ot-if="item.description" class="item-description">{{ item.description }}</span>
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
