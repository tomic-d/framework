onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'data-table',
		icon: 'table_view',
		name: 'Data Table',
		description: 'Data table with sort, search, pagination, row actions, sticky header and loading skeleton.',
		category: 'Data',
		config:
		{
			items:
			{
				type: 'array',
				value: [],
				each:
				{
					type: 'object',
					config:
					{
						id:
						{
							type: 'string|number'
						}
					}
				},
				description: 'Row data array. Each item should have an id.'
			},
			columns:
			{
				type: 'array',
				value: [],
				each:
				{
					type: 'object',
					config:
					{
						id:
						{
							type: 'string',
							value: '',
							description: 'Field key in item data.'
						},
						label:
						{
							type: 'string',
							value: '',
							description: 'Column header text.'
						},
						type:
						{
							type: 'string',
							value: 'text',
							options: ['text', 'description', 'number', 'currency', 'boolean', 'date', 'timeago', 'icon', 'image', 'avatar', 'media', 'badge', 'chip', 'tag', 'tags', 'status', 'metric', 'progress', 'link', 'color', 'count', 'group'],
							description: 'Cell render type from shared type system.'
						},
						width:
						{
							type: 'string',
							value: '1fr',
							description: 'CSS grid column width.'
						},
						align:
						{
							type: 'string',
							value: 'left',
							options: ['left', 'center', 'right'],
							description: 'Cell text alignment.'
						},
						sortable:
						{
							type: 'boolean',
							value: true,
							description: 'Allow sorting by this column.'
						},
						hidden:
						{
							type: 'boolean',
							value: false,
							description: 'Hide column from render.'
						},
						config:
						{
							type: 'object',
							value: {},
							description: 'Type-specific config passed to renderer.'
						},
						render:
						{
							type: 'function',
							description: 'Custom cell render function(item, column).'
						}
					}
				},
				description: 'Column definitions.'
			},
			title:
			{
				type: 'string',
				value: '',
				description: 'Table header title.'
			},
			description:
			{
				type: 'string',
				value: '',
				description: 'Table header description.'
			},
			icon:
			{
				type: 'string',
				value: '',
				description: 'Table header icon.'
			},
			search:
			{
				type: 'object',
				value: { enabled: true, value: '' },
				config:
				{
					enabled:
					{
						type: 'boolean',
						value: true,
						description: 'Show search field in toolbar.'
					},
					value:
					{
						type: 'string',
						value: '',
						description: 'Current search query.'
					}
				},
				description: 'Search toolbar config.'
			},
			sort:
			{
				type: 'object',
				value: { field: '', direction: 'asc' },
				config:
				{
					field:
					{
						type: 'string',
						value: '',
						description: 'Currently sorted column id.'
					},
					direction:
					{
						type: 'string',
						value: 'asc',
						options: ['asc', 'desc'],
						description: 'Sort direction.'
					}
				},
				description: 'Sort state.'
			},
			pagination:
			{
				type: 'object',
				value: null,
				config:
				{
					page:
					{
						type: 'number',
						value: 1,
						description: 'Current page.'
					},
					size:
					{
						type: 'number',
						value: 20,
						description: 'Rows per page.'
					},
					total:
					{
						type: 'number',
						value: 0,
						description: 'Total row count.'
					},
					sizes:
					{
						type: 'array',
						value: [10, 20, 50, 100],
						description: 'Page size options.'
					}
				},
				description: 'Pagination config. Null disables.'
			},
			loading:
			{
				type: 'object',
				value: { enabled: false, rows: 6 },
				config:
				{
					enabled:
					{
						type: 'boolean',
						value: false,
						description: 'Show skeleton loading state.'
					},
					rows:
					{
						type: 'number',
						value: 6,
						description: 'Number of skeleton rows.'
					}
				},
				description: 'Loading skeleton config.'
			},
			actions:
			{
				type: 'array',
				each:
				{
					type: 'object',
					config:
					{
						type:
						{
							type: 'string',
							value: 'action',
							options: ['action', 'link', 'separator', 'header'],
							description: 'Menu item type.'
						},
						id:
						{
							type: 'string',
							description: 'Action identifier.'
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
							description: 'Left icon.'
						},
						iconRight:
						{
							type: 'string',
							description: 'Right icon.'
						},
						shortcut:
						{
							type: 'string',
							description: 'Keyboard shortcut hint.'
						},
						badge:
						{
							type: 'string|number',
							description: 'Badge count or text.'
						},
						href:
						{
							type: 'string',
							description: 'Link URL for link type.'
						},
						target:
						{
							type: 'string',
							description: 'Link target.'
						},
						disabled:
						{
							type: 'boolean',
							description: 'Disabled state.'
						},
						danger:
						{
							type: 'boolean',
							description: 'Red danger styling.'
						},
						color:
						{
							type: 'string',
							options: ['brand', 'blue', 'red', 'orange', 'green'],
							description: 'Accent color.'
						},
						_click:
						{
							type: 'function',
							description: 'Per-action click handler.'
						}
					}
				},
				description: 'Row action menu items (global-menu format).'
			},
			empty:
			{
				type: 'object',
				value: { icon: 'table_view', title: 'No data', description: 'Nothing to show here yet.' },
				config:
				{
					icon:
					{
						type: 'string',
						value: 'table_view',
						description: 'Empty state icon.'
					},
					title:
					{
						type: 'string',
						value: 'No data',
						description: 'Empty state title.'
					},
					description:
					{
						type: 'string',
						value: 'Nothing to show here yet.',
						description: 'Empty state description.'
					}
				},
				description: 'Empty state config.'
			},
			background:
			{
				type: 'string',
				value: 'bg-1',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Background depth.'
			},
			variant:
			{
				type: 'array',
				value: ['border'],
				each: { type: 'string' },
				options: ['border', 'border-bottom', 'clean', 'striped', 'sticky'],
				description: 'Visual modifiers.'
			},
			_click:
			{
				type: 'function',
				description: 'Row click handler. Receives { value, index, event }.'
			},
			_sort:
			{
				type: 'function',
				description: 'Sort handler. Receives { field, direction }.'
			},
			_page:
			{
				type: 'function',
				description: 'Page handler. Receives { page, size }.'
			},
			_search:
			{
				type: 'function',
				description: 'Search handler. Receives { value }.'
			},
			_action:
			{
				type: 'function',
				description: 'Action handler. Receives { action, value, index }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.visibleColumns = this.columns.filter(column => !column.hidden);
			this.hasHead = !!this.title || !!this.icon || !!this.description || !!this.Slots.actions;
			this.hasActions = this.actions && this.actions.length > 0;
			this.hasPagination = !!this.pagination;
			this.hasToolbar = this.search.enabled;
			this.isLoading = !!this.loading.enabled;
			this.loadingSkeleton = Array.from({ length: this.loading.rows || 6 }, (_, index) => index);

			this.template = (() =>
			{
				const parts = this.visibleColumns.map(column => column.width || '1fr');

				if(this.hasActions)
				{
					parts.push('60px');
				}

				return parts.join(' ');
			})();

			this.headerCells = this.visibleColumns.map(column => ({
				id: column.id,
				label: column.label || '',
				align: column.align || 'left',
				sortable: column.sortable !== false,
				isSorted: this.sort.field === column.id,
				sortIcon: this.sort.field === column.id
					? (this.sort.direction === 'asc' ? 'arrow_upward' : 'arrow_downward')
					: 'unfold_more'
			}));

			this.rows = this.items.map((item, index) =>
			{
				const key = (item && item.id !== undefined) ? item.id : index;
				const cells = this.visibleColumns.map(column => ({
					html: elements.Fn('type.render', column, item),
					align: column.align || 'left'
				}));

				return { key, item, index, cells };
			});

			this.hasItems = this.rows.length > 0;

			if(this.hasPagination)
			{
				const page = this.pagination.page || 1;
				const size = this.pagination.size || 20;
				const total = this.pagination.total !== undefined ? this.pagination.total : this.items.length;
				const pages = Math.max(1, Math.ceil(total / size));
				const start = total === 0 ? 0 : (page - 1) * size + 1;
				const end = Math.min(page * size, total);

				this.paginationComputed = { page, size, total, pages, start, end };
			}

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.background];

				this.variant.forEach(v => list.push(v));

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

			this.onSort = (column) =>
			{
				if(column.sortable === false)
				{
					return;
				}

				let direction = 'asc';

				if(this.sort.field === column.id)
				{
					direction = this.sort.direction === 'asc' ? 'desc' : 'asc';
				}

				if(this._sort)
				{
					this._sort({ field: column.id, direction });
				}
			};

			this.onRowClick = (row, event) =>
			{
				if(event.target.closest('.actions-cell, button, a, input'))
				{
					return;
				}

				if(this._click)
				{
					this._click({ value: row.item, index: row.index, event });
				}
			};

			this.onSearchInput = ({ value }) =>
			{
				if(this._search)
				{
					this._search({ value });
				}
			};

			this.onPageChange = (page) =>
			{
				if(!this.hasPagination)
				{
					return;
				}

				const computed = this.paginationComputed;

				if(page < 1 || page > computed.pages)
				{
					return;
				}

				if(this._page)
				{
					this._page({ page, size: computed.size });
				}
			};

			this.openActions = (row, event) =>
			{
				event.stopPropagation();

				const popupId = 'data-table-actions-' + row.key;
				const actions = this.actions;
				const item = row.item;
				const index = row.index;
				const emit = this._action;

				$ot.popup(event.target, function()
				{
					this.actions = actions;

					this.onSelect = ({ value }) =>
					{
						const action = actions.find(entry => (entry.id || entry.label) === value);

						if(!action)
						{
							$ot.popup.close(popupId);
							return;
						}

						if(action._click)
						{
							action._click(item, index);
						}

						if(emit)
						{
							emit({ action: action.id || action.label, value: item, index });
						}

						$ot.popup.close(popupId);
					};

					return /* html */ `
						<e-global-menu
							:items="actions"
							:_select="onSelect"
						></e-global-menu>
					`;
				}, {
					id: popupId,
					position: { x: 'right-in', y: 'bottom' },
					offset: { x: 0, y: 4 }
				});
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<header ot-if="hasHead" class="head">
						<div ot-if="icon" class="head-icon">
							<i>{{ icon }}</i>
						</div>
						<div class="head-text">
							<h3 ot-if="title" class="head-title">{{ title }}</h3>
							<p ot-if="description" class="head-description">{{ description }}</p>
						</div>
						<div class="head-actions">
							<slot name="actions"></slot>
						</div>
					</header>

					<div ot-if="hasToolbar" class="toolbar">
						<div ot-if="search.enabled" class="toolbar-search">
							<e-form-input
								icon="search"
								placeholder="Search…"
								:value="search.value || ''"
								:_input="onSearchInput"
								background="bg-2"
								size="s"
							></e-form-input>
						</div>
					</div>

					<div ot-if="isLoading" class="table">
						<div class="row head-row" :style="'grid-template-columns:' + template">
							<div ot-for="header in headerCells" :class="'cell head-cell align-' + header.align">{{ header.label }}</div>
							<div ot-if="hasActions" class="cell actions-cell"></div>
						</div>
						<div ot-for="skel in loadingSkeleton" class="row skeleton-row" :style="'grid-template-columns:' + template">
							<div ot-for="header in headerCells" class="cell">
								<div class="skeleton skeleton-line"></div>
							</div>
							<div ot-if="hasActions" class="cell actions-cell"></div>
						</div>
					</div>

					<div ot-if="!isLoading && hasItems" class="table">
						<div class="row head-row" :style="'grid-template-columns:' + template">
							<div
								ot-for="header in headerCells"
								:class="'cell head-cell align-' + header.align + (header.sortable ? ' sortable' : '') + (header.isSorted ? ' sorted' : '')"
								ot-click="() => header.sortable && onSort(header)"
							>
								<span>{{ header.label }}</span>
								<i ot-if="header.sortable" class="sort-icon">{{ header.sortIcon }}</i>
							</div>
							<div ot-if="hasActions" class="cell actions-cell"></div>
						</div>

						<div ot-for="row in rows" :ot-key="row.key">
							<div
								:class="'row body-row' + (_click ? ' clickable' : '')"
								:style="'grid-template-columns:' + template"
								ot-click="({ event }) => onRowClick(row, event)"
							>
								<div ot-for="cell in row.cells" :class="'cell align-' + cell.align">
									<span ot-html="cell.html"></span>
								</div>

								<div ot-if="hasActions" class="cell actions-cell">
									<button
										type="button"
										class="actions-trigger"
										ot-click="({ event }) => openActions(row, event)"
									>
										<i>more_horiz</i>
									</button>
								</div>
							</div>
						</div>
					</div>

					<div ot-if="!isLoading && !hasItems" class="empty">
						<e-status-empty
							:icon="empty.icon"
							:title="empty.title"
							:description="empty.description"
						></e-status-empty>
					</div>

					<footer ot-if="hasPagination && !isLoading" class="pagination">
						<div class="pagination-info">
							<span>{{ paginationComputed.start }}–{{ paginationComputed.end }} of {{ paginationComputed.total }}</span>
						</div>

						<div class="pagination-controls">
							<button
								type="button"
								class="page-btn"
								:disabled="paginationComputed.page <= 1"
								ot-click="() => onPageChange(1)"
							>
								<i>first_page</i>
							</button>
							<button
								type="button"
								class="page-btn"
								:disabled="paginationComputed.page <= 1"
								ot-click="() => onPageChange(paginationComputed.page - 1)"
							>
								<i>chevron_left</i>
							</button>
							<span class="page-current">{{ paginationComputed.page }} / {{ paginationComputed.pages }}</span>
							<button
								type="button"
								class="page-btn"
								:disabled="paginationComputed.page >= paginationComputed.pages"
								ot-click="() => onPageChange(paginationComputed.page + 1)"
							>
								<i>chevron_right</i>
							</button>
							<button
								type="button"
								class="page-btn"
								:disabled="paginationComputed.page >= paginationComputed.pages"
								ot-click="() => onPageChange(paginationComputed.pages)"
							>
								<i>last_page</i>
							</button>
						</div>
					</footer>
				</div>
			`;
		}
	});
});
