onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'data-table',
		icon: 'table_view',
		name: 'Data Table',
		description: 'Premium data table with sort, search, filters, pagination, selection, row actions, bulk actions, sticky header, loading skeleton and responsive card-stack on mobile.',
		category: 'Data',
		author: 'OneType',
		config: {
			items: {
				type: 'array',
				value: [],
				each: { type: 'object' }
			},
			columns: {
				type: 'array',
				value: [],
				each: { type: 'object' }
			},
			rowKey: {
				type: 'string|function',
				value: 'id'
			},
			selectable: {
				type: 'boolean'
			},
			selected: {
				type: 'array',
				value: []
			},
			searchable: {
				type: 'boolean'
			},
			searchPlaceholder: {
				type: 'string',
				value: 'Search…'
			},
			filterable: {
				type: 'boolean'
			},
			sortField: {
				type: 'string'
			},
			sortDirection: {
				type: 'string',
				value: 'asc',
				options: ['asc', 'desc']
			},
			pagination: {
				type: 'object',
				value: null
			},
			pageSizes: {
				type: 'array',
				value: [10, 20, 50, 100]
			},
			loading: {
				type: 'boolean'
			},
			loadingRows: {
				type: 'number',
				value: 6
			},
			title: {
				type: 'string'
			},
			description: {
				type: 'string'
			},
			icon: {
				type: 'string'
			},
			actions: {
				type: 'array',
				value: [],
				each: { type: 'object' }
			},
			bulkActions: {
				type: 'array',
				value: [],
				each: { type: 'object' }
			},
			empty: {
				type: 'object',
				value: null
			},
			variant: {
				type: 'array',
				value: ['bg-1', 'border'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'clean', 'striped', 'sticky-header']
			},
			_click: {
				type: 'function'
			},
			_sort: {
				type: 'function'
			},
			_select: {
				type: 'function'
			},
			_page: {
				type: 'function'
			},
			_search: {
				type: 'function'
			},
			_filter: {
				type: 'function'
			},
			_action: {
				type: 'function'
			}
		},
		render: function()
		{
			// Local state

			this.search = '';
			this.filters = {};

			// Derive row key

			this.getKey = (item, index) =>
			{
				if(typeof this.rowKey === 'function')
				{
					return this.rowKey(item);
				}

				if(item && item[this.rowKey] !== undefined)
				{
					return item[this.rowKey];
				}

				return index;
			};

			// Format helpers

			this.escape = (value) =>
			{
				return String(value === null || value === undefined ? '' : value)
					.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
					.replace(/"/g, '&quot;');
			};

			this.formatNumber = (value) =>
			{
				if(value === null || value === undefined || value === '') return '—';
				if(typeof value !== 'number') return String(value);

				if(Math.abs(value) >= 1000000) return (value / 1000000).toFixed(1) + 'M';
				if(Math.abs(value) >= 1000) return (value / 1000).toFixed(1) + 'k';

				return String(value);
			};

			this.formatCurrency = (value, currency) =>
			{
				if(value === null || value === undefined || value === '') return '—';
				const symbol = currency || '€';
				if(typeof value !== 'number') return symbol + value;
				return symbol + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
			};

			this.formatDate = (value) =>
			{
				if(!value) return '—';
				const date = new Date(value);
				if(isNaN(date)) return '—';
				return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
			};

			this.formatTimeAgo = (value) =>
			{
				if(!value) return '—';
				const then = new Date(value).getTime();
				if(isNaN(then)) return '—';

				const diff = Math.floor((Date.now() - then) / 1000);

				if(diff < 60) return 'just now';
				if(diff < 3600) return Math.floor(diff / 60) + 'm ago';
				if(diff < 86400) return Math.floor(diff / 3600) + 'h ago';
				if(diff < 604800) return Math.floor(diff / 86400) + 'd ago';
				if(diff < 2592000) return Math.floor(diff / 604800) + 'w ago';
				return Math.floor(diff / 2592000) + 'mo ago';
			};

			// Cell renderer — returns HTML string

			this.renderCell = (column, item) =>
			{
				if(column.render)
				{
					return column.render(item, column);
				}

				const type = column.type || 'text';
				const config = column.config || {};
				const raw = item[column.id];

				if(type === 'text')
				{
					return '<span class="cell-text">' + this.escape(raw === null || raw === undefined || raw === '' ? '—' : raw) + '</span>';
				}

				if(type === 'number')
				{
					return '<span class="cell-number">' + this.escape(this.formatNumber(raw)) + '</span>';
				}

				if(type === 'currency')
				{
					return '<span class="cell-number">' + this.escape(this.formatCurrency(raw, config.currency)) + '</span>';
				}

				if(type === 'boolean')
				{
					return raw
						? '<i class="cell-boolean yes">check_circle</i>'
						: '<i class="cell-boolean no">cancel</i>';
				}

				if(type === 'date')
				{
					return '<span class="cell-date">' + this.escape(this.formatDate(raw)) + '</span>';
				}

				if(type === 'timeago')
				{
					return '<span class="cell-date">' + this.escape(this.formatTimeAgo(raw)) + '</span>';
				}

				if(type === 'icon')
				{
					return raw ? '<i class="cell-icon">' + this.escape(raw) + '</i>' : '';
				}

				if(type === 'image')
				{
					const src = typeof raw === 'string' ? raw : (raw && raw.src);
					return src
						? '<div class="cell-image" style="background-image:url(\'' + this.escape(src) + '\')"></div>'
						: '<div class="cell-image empty"></div>';
				}

				if(type === 'avatar')
				{
					const src = typeof raw === 'string' ? raw : (raw && raw.src);
					const name = (raw && raw.name) || '';
					return src
						? '<div class="cell-avatar"><img src="' + this.escape(src) + '" alt="' + this.escape(name) + '"/></div>'
						: '<div class="cell-avatar cell-avatar-fallback"><i>person</i></div>';
				}

				if(type === 'media')
				{
					const image = item[config.image || 'image'];
					const title = item[config.title || 'name'] || '';
					const subtitle = item[config.subtitle || 'subtitle'] || '';

					return '<div class="cell-media">'
						+ (image ? '<div class="cell-media-thumb" style="background-image:url(\'' + this.escape(image) + '\')"></div>' : '<div class="cell-media-thumb empty"><i>image</i></div>')
						+ '<div class="cell-media-info">'
							+ '<div class="cell-media-title">' + this.escape(title) + '</div>'
							+ (subtitle ? '<div class="cell-media-subtitle">' + this.escape(subtitle) + '</div>' : '')
						+ '</div>'
					+ '</div>';
				}

				if(type === 'badge')
				{
					const obj = (typeof raw === 'object' && raw) ? raw : { label: raw };
					const icon = obj.icon || '';
					const label = obj.label !== undefined ? obj.label : obj;
					const color = obj.color || config.color || 'neutral';

					return '<span class="cell-badge color-' + this.escape(color) + '">'
						+ (icon ? '<i>' + this.escape(icon) + '</i>' : '')
						+ '<span>' + this.escape(label || '—') + '</span>'
					+ '</span>';
				}

				if(type === 'chip')
				{
					return '<span class="cell-chip">' + this.escape(raw === null || raw === undefined ? '—' : raw) + '</span>';
				}

				if(type === 'tag')
				{
					return '<span class="cell-tag">' + this.escape(raw === null || raw === undefined ? '—' : raw) + '</span>';
				}

				if(type === 'tags')
				{
					if(!Array.isArray(raw) || !raw.length) return '<span class="cell-text">—</span>';
					return '<div class="cell-tags">' + raw.map(tag => '<span class="cell-tag">' + this.escape(tag) + '</span>').join('') + '</div>';
				}

				if(type === 'status')
				{
					const map = {
						live: 'green', published: 'green', active: 'green', success: 'green', approved: 'green',
						pending: 'orange', draft: 'neutral', review: 'orange',
						rejected: 'red', error: 'red', failed: 'red', inactive: 'red',
						archived: 'neutral', disabled: 'neutral'
					};
					const key = raw ? String(raw).toLowerCase() : '';
					const tone = map[key] || config.color || 'neutral';
					const label = raw ? String(raw).charAt(0).toUpperCase() + String(raw).slice(1) : '—';

					return '<span class="cell-status color-' + tone + '"><span class="cell-status-dot"></span>' + this.escape(label) + '</span>';
				}

				if(type === 'metric')
				{
					const value = typeof raw === 'object' && raw ? raw.value : raw;
					const delta = typeof raw === 'object' && raw ? raw.delta : null;
					const direction = delta && String(delta).startsWith('-') ? 'down' : 'up';

					return '<span class="cell-metric">'
						+ '<span class="cell-metric-value">' + this.escape(value === null || value === undefined ? '—' : value) + '</span>'
						+ (delta ? '<span class="cell-metric-delta ' + direction + '">' + this.escape(delta) + '</span>' : '')
					+ '</span>';
				}

				if(type === 'progress')
				{
					const value = Math.max(0, Math.min(100, Number(raw) || 0));
					const color = config.color || 'brand';

					return '<div class="cell-progress">'
						+ '<div class="cell-progress-track"><div class="cell-progress-bar color-' + this.escape(color) + '" style="width:' + value + '%"></div></div>'
						+ '<span class="cell-progress-label">' + value + '%</span>'
					+ '</div>';
				}

				if(type === 'link')
				{
					const obj = (typeof raw === 'object' && raw) ? raw : { label: raw, href: '#' };
					return '<a class="cell-link" href="' + this.escape(obj.href || '#') + '">' + this.escape(obj.label || raw || '—') + '</a>';
				}

				return '<span class="cell-text">' + this.escape(raw === null || raw === undefined ? '—' : raw) + '</span>';
			};

			// Derived columns

			this.visibleColumns = this.columns.filter(column => !column.hidden);

			// Grid template columns

			this.buildTemplate = () =>
			{
				const parts = [];
				if(this.selectable) parts.push('44px');
				this.visibleColumns.forEach(column => parts.push(column.width || '1fr'));
				if(this.actions && this.actions.length) parts.push('60px');
				return parts.join(' ');
			};

			this.template = this.buildTemplate();

			// Filtering + sorting client-side

			this.filteredItems = () =>
			{
				let result = this.items;

				// Search filter

				if(this.searchable && this.search)
				{
					const query = this.search.toLowerCase();
					result = result.filter(item =>
					{
						return this.visibleColumns.some(column =>
						{
							const value = item[column.id];
							if(value === null || value === undefined) return false;
							if(typeof value === 'object') return false;
							return String(value).toLowerCase().includes(query);
						});
					});
				}

				// Column filters

				Object.keys(this.filters).forEach(columnId =>
				{
					const filterValue = this.filters[columnId];
					if(!filterValue) return;

					result = result.filter(item =>
					{
						const value = item[columnId];
						if(value === null || value === undefined) return false;
						return String(value).toLowerCase() === String(filterValue).toLowerCase();
					});
				});

				// Sorting

				if(this.sortField)
				{
					const direction = this.sortDirection === 'desc' ? -1 : 1;
					result = [...result].sort((a, b) =>
					{
						const aValue = a[this.sortField];
						const bValue = b[this.sortField];

						if(aValue === bValue) return 0;
						if(aValue === null || aValue === undefined) return 1;
						if(bValue === null || bValue === undefined) return -1;

						if(typeof aValue === 'number' && typeof bValue === 'number')
						{
							return (aValue - bValue) * direction;
						}

						return String(aValue).localeCompare(String(bValue)) * direction;
					});
				}

				return result;
			};

			this.computedItems = this.filteredItems();

			// Rows for render

			this.rows = this.computedItems.map((item, index) =>
			{
				const key = this.getKey(item, index);
				const cells = this.visibleColumns.map(column => ({
					html: this.renderCell(column, item),
					align: column.align || 'left'
				}));

				return {
					key,
					item,
					index,
					cells,
					selected: this.selected.includes(key)
				};
			});

			// Headers

			this.headerCells = this.visibleColumns.map(column => ({
				id: column.id,
				label: column.label || '',
				align: column.align || 'left',
				sortable: column.sortable !== false,
				isSorted: this.sortField === column.id,
				sortIcon: this.sortField === column.id
					? (this.sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward')
					: 'unfold_more'
			}));

			// State detection

			this.hasHead = !!this.title || !!this.icon || !!this.description || !!this.Slots.actions;
			this.hasItems = this.rows.length > 0;
			this.hasActions = this.actions && this.actions.length > 0;
			this.hasBulkActions = this.bulkActions && this.bulkActions.length > 0;
			this.hasSelection = this.selected.length > 0;
			this.hasPagination = !!this.pagination;
			this.hasToolbar = this.searchable || this.filterable || this.hasBulkActions;
			this.allSelected = this.rows.length > 0 && this.rows.every(row => row.selected);
			this.someSelected = !this.allSelected && this.rows.some(row => row.selected);
			this.loadingSkeleton = Array.from({ length: this.loadingRows }, (_, index) => index);

			// Pagination computed

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

			// Actions

			this.onSort = (column) =>
			{
				if(column.sortable === false) return;

				let direction = 'asc';

				if(this.sortField === column.id)
				{
					direction = this.sortDirection === 'asc' ? 'desc' : 'asc';
				}

				this.sortField = column.id;
				this.sortDirection = direction;

				if(this._sort)
				{
					this._sort({ field: column.id, direction });
				}
			};

			this.onRowClick = (row, event) =>
			{
				if(event.target.closest('.select-cell, .actions-cell, button, a, input'))
				{
					return;
				}

				if(this._click)
				{
					this._click({ value: row.item, index: row.index, event });
				}
			};

			this.onSelect = (row, event) =>
			{
				event.stopPropagation();

				const next = row.selected
					? this.selected.filter(key => key !== row.key)
					: [...this.selected, row.key];

				this.selected = next;

				if(this._select)
				{
					this._select({ value: next });
				}
			};

			this.onSelectAll = () =>
			{
				const allKeys = this.rows.map(row => row.key);

				if(this.allSelected)
				{
					this.selected = this.selected.filter(key => !allKeys.includes(key));
				}
				else
				{
					this.selected = [...new Set([...this.selected, ...allKeys])];
				}

				if(this._select)
				{
					this._select({ value: this.selected });
				}
			};

			this.onSearchInput = ({ value }) =>
			{
				this.search = value;

				if(this._search)
				{
					this._search({ value });
				}
			};

			this.onPageChange = (page) =>
			{
				if(!this.hasPagination) return;

				const computed = this.paginationComputed;
				if(page < 1 || page > computed.pages) return;

				this.pagination = { ...this.pagination, page };

				if(this._page)
				{
					this._page({ page, size: computed.size });
				}
			};

			this.onPageSizeChange = ({ value }) =>
			{
				if(!this.hasPagination) return;

				this.pagination = { ...this.pagination, size: Number(value), page: 1 };

				if(this._page)
				{
					this._page({ page: 1, size: Number(value) });
				}
			};

			this.onAction = (row, action, event) =>
			{
				event.stopPropagation();

				if(action.onClick)
				{
					action.onClick(row.item, row.index);
				}

				if(this._action)
				{
					this._action({ action: action.id || action.label, value: row.item, index: row.index });
				}
			};

			this.openActions = (row, event) =>
			{
				event.stopPropagation();
				const target = event.currentTarget;
				const actions = this.actions;
				const item = row.item;
				const index = row.index;
				const emit = this._action;

				$ot.popup(target, function()
				{
					this.actions = actions;

					this.run = (action) =>
					{
						if(action.onClick)
						{
							action.onClick(item, index);
						}

						if(emit)
						{
							emit({ action: action.id || action.label, value: item, index });
						}

						$ot.close();
					};

					return /* html */ `
						<div class="data-table-actions">
							<button
								ot-for="action in actions"
								type="button"
								:class="'data-table-action' + (action.danger ? ' danger' : '')"
								ot-click="() => run(action)"
							>
								<i ot-if="action.icon">{{ action.icon }}</i>
								<span>{{ action.label }}</span>
							</button>
						</div>
					`;
				}, {
					id: 'data-table-actions-' + row.key,
					position: { x: 'right-in', y: 'bottom' },
					offset: { x: 0, y: 4 }
				});
			};

			this.runBulkAction = (action) =>
			{
				const items = this.rows.filter(row => row.selected).map(row => row.item);

				if(action.onClick)
				{
					action.onClick(items);
				}

				if(this._action)
				{
					this._action({ action: action.id || action.label, value: items, bulk: true });
				}
			};

			this.clearSelection = () =>
			{
				this.selected = [];

				if(this._select)
				{
					this._select({ value: [] });
				}
			};

			return /* html */ `
				<div :class="'holder ' + variant.join(' ')">
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
						<div ot-if="searchable" class="toolbar-search">
							<e-form-input
								icon="search"
								:placeholder="searchPlaceholder"
								:value="search"
								:_input="onSearchInput"
								:variant="['bg-2', 'border', 'size-s']"
							></e-form-input>
						</div>

						<div ot-if="hasBulkActions && hasSelection" class="toolbar-bulk">
							<span class="toolbar-bulk-count">{{ selected.length }} selected</span>
							<div class="toolbar-bulk-actions">
								<button
									ot-for="action in bulkActions"
									type="button"
									:class="'bulk-action' + (action.danger ? ' danger' : '')"
									ot-click="() => runBulkAction(action)"
								>
									<i ot-if="action.icon">{{ action.icon }}</i>
									<span>{{ action.label }}</span>
								</button>
								<button type="button" class="bulk-clear" ot-click="clearSelection">
									<i>close</i>
								</button>
							</div>
						</div>
					</div>

					<div ot-if="loading" class="table">
						<div class="row head-row" :style="'grid-template-columns:' + template">
							<div ot-if="selectable" class="cell select-cell"></div>
							<div ot-for="header in headerCells" :class="'cell head-cell align-' + header.align">{{ header.label }}</div>
							<div ot-if="hasActions" class="cell actions-cell"></div>
						</div>
						<div ot-for="skel in loadingSkeleton" class="row skeleton-row" :style="'grid-template-columns:' + template">
							<div ot-if="selectable" class="cell select-cell"><div class="skeleton skeleton-box"></div></div>
							<div ot-for="header in headerCells" class="cell"><div class="skeleton skeleton-line"></div></div>
							<div ot-if="hasActions" class="cell actions-cell"></div>
						</div>
					</div>

					<div ot-if="!loading && hasItems" class="table">
						<div class="row head-row" :style="'grid-template-columns:' + template">
							<div ot-if="selectable" class="cell select-cell">
								<button
									type="button"
									:class="'select-box' + (allSelected ? ' checked' : '') + (someSelected ? ' indeterminate' : '')"
									ot-click="onSelectAll"
								>
									<i ot-if="allSelected">check</i>
									<i ot-if="someSelected">remove</i>
								</button>
							</div>
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

						<div ot-for="row in rows">
							<div
								:class="'row body-row' + (row.selected ? ' selected' : '')"
								:style="'grid-template-columns:' + template"
								ot-click="({ event }) => onRowClick(row, event)"
							>
								<div ot-if="selectable" class="cell select-cell">
									<button
										type="button"
										:class="'select-box' + (row.selected ? ' checked' : '')"
										ot-click="({ event }) => onSelect(row, event)"
									>
										<i ot-if="row.selected">check</i>
									</button>
								</div>

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

					<div ot-if="!loading && !hasItems" class="empty">
						<e-status-empty
							:icon="(empty && empty.icon) || 'table_view'"
							:title="(empty && empty.title) || 'No data'"
							:description="(empty && empty.description) || 'Nothing to show here yet.'"
						></e-status-empty>
					</div>

					<footer ot-if="hasPagination && !loading" class="pagination">
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
