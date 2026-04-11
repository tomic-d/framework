onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'data-filters',
		icon: 'filter_alt',
		name: 'Data Filters',
		description: 'Premium filters panel with collapsible groups, multiple filter types (checkbox, radio, select, tags, range, slider, search, date, toggle), clear actions and active counts. Reuses form elements.',
		category: 'Data',
		author: 'OneType',
		config: {
			title: {
				type: 'string',
				value: 'Filters'
			},
			icon: {
				type: 'string',
				value: 'filter_alt'
			},
			groups: {
				type: 'array',
				value: [],
				each: { type: 'object' }
			},
			value: {
				type: 'object',
				value: null
			},
			collapsible: {
				type: 'boolean',
				value: true
			},
			showClear: {
				type: 'boolean',
				value: true
			},
			showCount: {
				type: 'boolean',
				value: true
			},
			sticky: {
				type: 'boolean'
			},
			orientation: {
				type: 'string',
				value: 'vertical',
				options: ['vertical', 'horizontal']
			},
			clearLabel: {
				type: 'string',
				value: 'Clear all'
			},
			applyLabel: {
				type: 'string'
			},
			variant: {
				type: 'array',
				value: ['bg-1', 'border'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'clean']
			},
			_change: {
				type: 'function'
			},
			_clear: {
				type: 'function'
			},
			_apply: {
				type: 'function'
			}
		},
		render: function()
		{
			// Local state — clone value

			this.state = this.value ? { ...this.value } : {};
			this.collapsed = {};
			this.expanded = {};

			this.groups.forEach(group =>
			{
				if(group.collapsed)
				{
					this.collapsed[group.id] = true;
				}
			});

			// Count helpers

			this.isGroupActive = (group) =>
			{
				const value = this.state[group.id];
				if(value === undefined || value === null || value === '') return false;
				if(Array.isArray(value)) return value.length > 0;
				if(typeof value === 'object')
				{
					return Object.values(value).some(v => v !== null && v !== undefined && v !== '');
				}
				return true;
			};

			this.groupActiveCount = (group) =>
			{
				const value = this.state[group.id];
				if(!value) return 0;
				if(Array.isArray(value)) return value.length;
				if(typeof value === 'object')
				{
					return Object.values(value).filter(v => v !== null && v !== undefined && v !== '').length;
				}
				return 1;
			};

			this.totalActiveCount = () =>
			{
				return this.groups.reduce((sum, group) => sum + this.groupActiveCount(group), 0);
			};

			// Value getters

			this.isChecked = (groupId, optionId) =>
			{
				const value = this.state[groupId];
				return Array.isArray(value) && value.indexOf(optionId) !== -1;
			};

			this.isSelected = (groupId, optionId) =>
			{
				return this.state[groupId] === optionId;
			};

			this.getSearchValue = (groupId) =>
			{
				const value = this.state[groupId];
				return typeof value === 'string' ? value : '';
			};

			this.getNumberValue = (groupId) =>
			{
				const value = this.state[groupId];
				return typeof value === 'number' ? value : 0;
			};

			this.getRangeValue = (groupId, key) =>
			{
				const value = this.state[groupId];
				return value && typeof value === 'object' && value[key] !== undefined ? value[key] : '';
			};

			this.getBooleanValue = (groupId) =>
			{
				return !!this.state[groupId];
			};

			// Emit

			this.emit = () =>
			{
				if(this._change)
				{
					this._change({ value: { ...this.state } });
				}
			};

			// Actions

			this.toggleCollapse = (groupId) =>
			{
				this.collapsed[groupId] = !this.collapsed[groupId];
				this.Update();
			};

			this.toggleExpand = (groupId) =>
			{
				this.expanded[groupId] = !this.expanded[groupId];
				this.Update();
			};

			this.toggleCheckbox = (group, optionId) =>
			{
				const current = Array.isArray(this.state[group.id]) ? [...this.state[group.id]] : [];
				const index = current.indexOf(optionId);

				if(index === -1)
				{
					current.push(optionId);
				}
				else
				{
					current.splice(index, 1);
				}

				this.state = { ...this.state, [group.id]: current };
				this.emit();
				this.Update();
			};

			this.selectRadio = (group, optionId) =>
			{
				const next = this.state[group.id] === optionId ? null : optionId;
				this.state = { ...this.state, [group.id]: next };
				this.emit();
				this.Update();
			};

			this.changeSelect = (group, { value }) =>
			{
				this.state = { ...this.state, [group.id]: value };
				this.emit();
				this.Update();
			};

			this.changeSearch = (group, { value }) =>
			{
				this.state = { ...this.state, [group.id]: value };
				this.emit();
			};

			this.changeSlider = (group, { value }) =>
			{
				this.state = { ...this.state, [group.id]: value };
				this.emit();
				this.Update();
			};

			this.changeRangeMin = (group, { value }) =>
			{
				const range = this.state[group.id] && typeof this.state[group.id] === 'object' ? this.state[group.id] : {};
				this.state = { ...this.state, [group.id]: { ...range, min: value } };
				this.emit();
				this.Update();
			};

			this.changeRangeMax = (group, { value }) =>
			{
				const range = this.state[group.id] && typeof this.state[group.id] === 'object' ? this.state[group.id] : {};
				this.state = { ...this.state, [group.id]: { ...range, max: value } };
				this.emit();
				this.Update();
			};

			this.changeDateFrom = (group, { value }) =>
			{
				const range = this.state[group.id] && typeof this.state[group.id] === 'object' ? this.state[group.id] : {};
				this.state = { ...this.state, [group.id]: { ...range, from: value } };
				this.emit();
				this.Update();
			};

			this.changeDateTo = (group, { value }) =>
			{
				const range = this.state[group.id] && typeof this.state[group.id] === 'object' ? this.state[group.id] : {};
				this.state = { ...this.state, [group.id]: { ...range, to: value } };
				this.emit();
				this.Update();
			};

			this.changeToggle = (group, { value }) =>
			{
				this.state = { ...this.state, [group.id]: value };
				this.emit();
				this.Update();
			};

			this.clearGroup = (group, event) =>
			{
				if(event)
				{
					event.stopPropagation();
				}

				const next = { ...this.state };
				delete next[group.id];
				this.state = next;
				this.emit();
				this.Update();
			};

			this.clearAll = () =>
			{
				this.state = {};
				this.expanded = {};
				this.emit();

				if(this._clear)
				{
					this._clear();
				}

				this.Update();
			};

			this.apply = () =>
			{
				if(this._apply)
				{
					this._apply({ value: { ...this.state } });
				}
			};

			// Computed header state

			this.totalActive = this.totalActiveCount();
			this.hasActive = this.totalActive > 0;
			this.hasApply = !!this.applyLabel;

			return /* html */ `
				<aside :class="'holder ' + variant.join(' ') + ' ' + orientation + (sticky ? ' sticky' : '')">
					<header class="head">
						<div class="head-title">
							<i ot-if="icon">{{ icon }}</i>
							<span>{{ title }}</span>
							<span ot-if="showCount && hasActive" class="head-count">{{ totalActive }}</span>
						</div>
						<button
							ot-if="showClear && hasActive"
							type="button"
							class="head-clear"
							ot-click="clearAll"
						>
							<i>refresh</i>
							<span>{{ clearLabel }}</span>
						</button>
					</header>

					<div class="groups">
						<div ot-for="group in groups" :class="'group' + (collapsed[group.id] ? ' collapsed' : '')">
							<div
								ot-if="group.label"
								:class="'group-head' + (collapsible ? ' collapsible' : '')"
								ot-click="() => collapsible && toggleCollapse(group.id)"
							>
								<span class="group-label">{{ group.label }}</span>
								<span ot-if="showCount && groupActiveCount(group) > 0" class="group-count">{{ groupActiveCount(group) }}</span>
								<span class="group-spacer"></span>
								<button
									ot-if="isGroupActive(group)"
									type="button"
									class="group-clear"
									ot-click="({ event }) => clearGroup(group, event)"
									:ot-tooltip="{ text: 'Clear', position: { x: 'center', y: 'top' } }"
								>
									<i>close</i>
								</button>
								<i ot-if="collapsible" class="group-chevron">expand_more</i>
							</div>

							<div ot-if="!collapsed[group.id]" class="group-body">

								<!-- CHECKBOX -->
								<div ot-if="group.type === 'checkbox'" class="options">
									<div ot-for="option, index in group.options" ot-if="!group.max || expanded[group.id] || index < group.max" class="option-wrap">
										<e-form-checkbox
											:label="option.label"
											:icon="option.icon || ''"
											:count="option.count != null ? option.count : ''"
											:value="isChecked(group.id, option.id)"
											:_change="() => toggleCheckbox(group, option.id)"
											:variant="['bg-2', 'border', 'size-m']"
										></e-form-checkbox>
									</div>

									<button
										ot-if="group.max && group.options.length > group.max"
										type="button"
										class="show-more"
										ot-click="() => toggleExpand(group.id)"
									>
										<i>{{ expanded[group.id] ? 'expand_less' : 'expand_more' }}</i>
										<span>{{ expanded[group.id] ? 'Show less' : 'Show ' + (group.options.length - group.max) + ' more' }}</span>
									</button>
								</div>

								<!-- RADIO -->
								<div ot-if="group.type === 'radio'" class="options">
									<div ot-for="option, index in group.options" ot-if="!group.max || expanded[group.id] || index < group.max" class="option-wrap">
										<e-form-radio
											:label="option.label"
											:icon="option.icon || ''"
											:count="option.count != null ? option.count : ''"
											:value="isSelected(group.id, option.id)"
											:_change="() => selectRadio(group, option.id)"
											:variant="['bg-2', 'border', 'size-m']"
										></e-form-radio>
									</div>

									<button
										ot-if="group.max && group.options.length > group.max"
										type="button"
										class="show-more"
										ot-click="() => toggleExpand(group.id)"
									>
										<i>{{ expanded[group.id] ? 'expand_less' : 'expand_more' }}</i>
										<span>{{ expanded[group.id] ? 'Show less' : 'Show ' + (group.options.length - group.max) + ' more' }}</span>
									</button>
								</div>

								<!-- TAGS (pill buttons, multi-select) -->
								<div ot-if="group.type === 'tags'" class="tags">
									<button
										ot-for="option in group.options"
										type="button"
										:class="'tag' + (isChecked(group.id, option.id) ? ' active' : '')"
										ot-click="() => toggleCheckbox(group, option.id)"
									>
										<i ot-if="option.icon">{{ option.icon }}</i>
										<span>{{ option.label }}</span>
										<span ot-if="option.count != null" class="tag-count">{{ option.count }}</span>
									</button>
								</div>

								<!-- SELECT -->
								<e-form-select
									ot-if="group.type === 'select'"
									:value="state[group.id] || ''"
									:options="group.options"
									:placeholder="(group.config && group.config.placeholder) || 'Select…'"
									:searchable="group.searchable"
									:_change="(data) => changeSelect(group, data)"
									:variant="['bg-2', 'border', 'size-m']"
								></e-form-select>

								<!-- SEARCH -->
								<e-form-input
									ot-if="group.type === 'search'"
									icon="search"
									:value="getSearchValue(group.id)"
									:placeholder="(group.config && group.config.placeholder) || 'Search…'"
									:_input="(data) => changeSearch(group, data)"
									:variant="['bg-2', 'border', 'size-m']"
								></e-form-input>

								<!-- RANGE (two inputs) -->
								<div ot-if="group.type === 'range'" class="range">
									<e-form-input
										type="number"
										:value="getRangeValue(group.id, 'min')"
										:placeholder="(group.config && group.config.minPlaceholder) || 'Min'"
										:_change="(data) => changeRangeMin(group, data)"
										:variant="['bg-2', 'border', 'size-m']"
									></e-form-input>
									<span class="range-dash">—</span>
									<e-form-input
										type="number"
										:value="getRangeValue(group.id, 'max')"
										:placeholder="(group.config && group.config.maxPlaceholder) || 'Max'"
										:_change="(data) => changeRangeMax(group, data)"
										:variant="['bg-2', 'border', 'size-m']"
									></e-form-input>
								</div>

								<!-- SLIDER -->
								<div ot-if="group.type === 'slider'" class="slider-wrap">
									<e-form-slider
										:value="getNumberValue(group.id) || (group.config && group.config.min) || 0"
										:min="(group.config && group.config.min) || 0"
										:max="(group.config && group.config.max) || 100"
										:step="(group.config && group.config.step) || 1"
										:_change="(data) => changeSlider(group, data)"
										:variant="['brand', 'size-m']"
									></e-form-slider>
									<div ot-if="state[group.id] != null" class="slider-value">{{ state[group.id] }}</div>
								</div>

								<!-- DATE (from/to) -->
								<div ot-if="group.type === 'date'" class="date-range">
									<e-form-date
										:value="getRangeValue(group.id, 'from')"
										:placeholder="(group.config && group.config.fromPlaceholder) || 'From'"
										:_change="(data) => changeDateFrom(group, data)"
										:variant="['bg-2', 'border', 'size-m']"
									></e-form-date>
									<e-form-date
										:value="getRangeValue(group.id, 'to')"
										:placeholder="(group.config && group.config.toPlaceholder) || 'To'"
										:_change="(data) => changeDateTo(group, data)"
										:variant="['bg-2', 'border', 'size-m']"
									></e-form-date>
								</div>

								<!-- TOGGLE -->
								<div ot-if="group.type === 'toggle'" class="toggle-wrap">
									<e-form-toggle
										:label="(group.config && group.config.label) || group.label"
										:value="getBooleanValue(group.id)"
										:_change="(data) => changeToggle(group, data)"
										:variant="['bg-3', 'size-m']"
									></e-form-toggle>
								</div>
							</div>
						</div>
					</div>

					<footer ot-if="hasApply" class="foot">
						<e-form-button
							:text="applyLabel"
							icon="check"
							:_click="apply"
							:variant="['brand', 'size-m', 'full']"
						></e-form-button>
					</footer>
				</aside>
			`;
		}
	});
});
