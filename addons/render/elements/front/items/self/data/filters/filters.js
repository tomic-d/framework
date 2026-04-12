onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'data-filters',
		icon: 'filter_alt',
		name: 'Data Filters',
		description: 'Filter panel with collapsible groups, multiple types and active counts.',
		category: 'Data',
		config:
		{
			title:
			{
				type: 'string',
				value: 'Filters',
				description: 'Panel header title.'
			},
			icon:
			{
				type: 'string',
				value: 'filter_alt',
				description: 'Header icon.'
			},
			groups:
			{
				type: 'array',
				value: [],
				each: { type: 'object' },
				description: 'Filter groups. Each: { id, label, type, options, config, collapsed, max }.'
			},
			value:
			{
				type: 'object',
				value: null,
				description: 'Filter state keyed by group id.'
			},
			collapsible:
			{
				type: 'boolean',
				value: true,
				description: 'Allow collapsing groups.'
			},
			showClear:
			{
				type: 'boolean',
				value: true,
				description: 'Show clear all button.'
			},
			showCount:
			{
				type: 'boolean',
				value: true,
				description: 'Show active filter counts.'
			},
			sticky:
			{
				type: 'boolean',
				value: false,
				description: 'Sticky positioning.'
			},
			orientation:
			{
				type: 'string',
				value: 'vertical',
				options: ['vertical', 'horizontal'],
				description: 'Layout direction.'
			},
			clearLabel:
			{
				type: 'string',
				value: 'Clear all',
				description: 'Clear button label.'
			},
			applyLabel:
			{
				type: 'string',
				value: '',
				description: 'Apply button label. Empty hides footer.'
			},
			background:
			{
				type: 'string',
				value: 'bg-1',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Background depth.'
			},
			border:
			{
				type: 'boolean',
				value: true,
				description: 'Show outer border.'
			},
			variant:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				options: ['clean'],
				description: 'Visual modifiers.'
			},
			_change:
			{
				type: 'function',
				description: 'Change handler. Receives { value }.'
			},
			_clear:
			{
				type: 'function',
				description: 'Clear all handler.'
			},
			_apply:
			{
				type: 'function',
				description: 'Apply handler. Receives { value }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

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

			this.hasApply = !!this.applyLabel;

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.background, this.orientation];

				if(this.border)
				{
					list.push('border');
				}

				if(this.sticky)
				{
					list.push('sticky');
				}

				this.variant.forEach(v => list.push(v));

				return list.join(' ');
			};

			/* ===== COUNTS ===== */

			this.groupActiveCount = (group) =>
			{
				const value = this.state[group.id];

				if(!value)
				{
					return 0;
				}

				if(Array.isArray(value))
				{
					return value.length;
				}

				if(typeof value === 'object')
				{
					return Object.values(value).filter(v => v !== null && v !== undefined && v !== '').length;
				}

				return 1;
			};

			this.isGroupActive = (group) =>
			{
				return this.groupActiveCount(group) > 0;
			};

			this.totalActiveCount = () =>
			{
				return this.groups.reduce((sum, group) => sum + this.groupActiveCount(group), 0);
			};

			this.totalActive = this.totalActiveCount();
			this.hasActive = this.totalActive > 0;

			/* ===== GETTERS ===== */

			this.isChecked = (groupId, optionId) =>
			{
				const value = this.state[groupId];
				return Array.isArray(value) && value.indexOf(optionId) !== -1;
			};

			this.isSelected = (groupId, optionId) =>
			{
				return this.state[groupId] === optionId;
			};

			this.getValue = (groupId, fallback) =>
			{
				const value = this.state[groupId];
				return value !== undefined && value !== null ? value : fallback;
			};

			this.getRangeValue = (groupId, key) =>
			{
				const value = this.state[groupId];
				return value && typeof value === 'object' && value[key] !== undefined ? value[key] : '';
			};

			/* ===== HANDLERS ===== */

			this.emit = () =>
			{
				if(this._change)
				{
					this._change({ value: { ...this.state } });
				}
			};

			this.set = (groupId, value) =>
			{
				this.state = { ...this.state, [groupId]: value };
				this.emit();
				this.Update();
			};

			this.setRange = (groupId, key, value) =>
			{
				const range = this.state[groupId] && typeof this.state[groupId] === 'object' ? this.state[groupId] : {};
				this.state = { ...this.state, [groupId]: { ...range, [key]: value } };
				this.emit();
				this.Update();
			};

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

				this.set(group.id, current);
			};

			this.selectRadio = (group, optionId) =>
			{
				this.set(group.id, this.state[group.id] === optionId ? null : optionId);
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

			/* ===== RENDER ===== */

			return /* html */ `
				<aside :class="classes()">
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
											background="bg-2"
											:variant="['border']"
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
											background="bg-2"
											:variant="['border']"
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

								<!-- TAGS -->
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
									:value="getValue(group.id, '')"
									:options="group.options"
									:placeholder="(group.config && group.config.placeholder) || 'Select…'"
									:searchable="group.searchable"
									:_change="({ value }) => set(group.id, value)"
									background="bg-2"
									:border="true"
								></e-form-select>

								<!-- SEARCH -->
								<e-form-input
									ot-if="group.type === 'search'"
									icon="search"
									:value="getValue(group.id, '')"
									:placeholder="(group.config && group.config.placeholder) || 'Search…'"
									:_input="({ value }) => set(group.id, value)"
									background="bg-2"
									:border="true"
									size="s"
								></e-form-input>

								<!-- RANGE -->
								<div ot-if="group.type === 'range'" class="range">
									<e-form-input
										type="number"
										:value="getRangeValue(group.id, 'min')"
										:placeholder="(group.config && group.config.minPlaceholder) || 'Min'"
										:_change="({ value }) => setRange(group.id, 'min', value)"
										background="bg-2"
										:border="true"
										size="s"
									></e-form-input>
									<span class="range-dash">—</span>
									<e-form-input
										type="number"
										:value="getRangeValue(group.id, 'max')"
										:placeholder="(group.config && group.config.maxPlaceholder) || 'Max'"
										:_change="({ value }) => setRange(group.id, 'max', value)"
										background="bg-2"
										:border="true"
										size="s"
									></e-form-input>
								</div>

								<!-- SLIDER -->
								<div ot-if="group.type === 'slider'" class="slider-wrap">
									<e-form-slider
										:value="getValue(group.id, (group.config && group.config.min) || 0)"
										:min="(group.config && group.config.min) || 0"
										:max="(group.config && group.config.max) || 100"
										:step="(group.config && group.config.step) || 1"
										:showValue="true"
										:_change="({ value }) => set(group.id, value)"
										color="brand"
									></e-form-slider>
								</div>

								<!-- DATE -->
								<div ot-if="group.type === 'date'" class="date-range">
									<e-form-date
										:value="getRangeValue(group.id, 'from')"
										:placeholder="(group.config && group.config.fromPlaceholder) || 'From'"
										:_change="({ value }) => setRange(group.id, 'from', value)"
										background="bg-2"
										:border="true"
										size="s"
									></e-form-date>
									<e-form-date
										:value="getRangeValue(group.id, 'to')"
										:placeholder="(group.config && group.config.toPlaceholder) || 'To'"
										:_change="({ value }) => setRange(group.id, 'to', value)"
										background="bg-2"
										:border="true"
										size="s"
									></e-form-date>
								</div>

								<!-- TOGGLE -->
								<div ot-if="group.type === 'toggle'" class="toggle-wrap">
									<e-form-toggle
										:label="(group.config && group.config.label) || group.label"
										:value="!!state[group.id]"
										:_change="({ value }) => set(group.id, value)"
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
							color="brand"
							:variant="['full']"
						></e-form-button>
					</footer>
				</aside>
			`;
		}
	});
});
