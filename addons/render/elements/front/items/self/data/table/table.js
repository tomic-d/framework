import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'table',
	icon: 'table_chart',
	name: 'Table',
	description: 'Data table with columns, rows, sorting, and row actions. Supports dynamic column definitions and custom cell rendering.',
	category: 'Data',
	author: 'Divhunt',
	config: {
		columns: {
			type: 'array',
			value: [
				{ id: 'name', label: 'Name' },
				{ id: 'email', label: 'Email' },
				{ id: 'role', label: 'Role' },
				{ id: 'status', label: 'Status' }
			]
		},
		rows: {
			type: 'array',
			value: [
				{ name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
				{ name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' },
				{ name: 'Bob Wilson', email: 'bob@example.com', role: 'Viewer', status: 'Inactive' }
			]
		},
		variant: {
			type: 'array',
			value: ['border', 'hover', 'size-m'],
			options: ['border', 'bg-1', 'bg-2', 'bg-3', 'striped', 'compact', 'hover', 'size-s', 'size-m', 'size-l']
		},
		sortable: {
			type: 'boolean',
			value: false
		},
		onRowClick: {
			type: 'function'
		},
		onSort: {
			type: 'function'
		}
	},
	render: function()
	{
		this.sortColumn = null;
		this.sortDirection = 'asc';

		this.handleSort = (column) =>
		{
			if (!this.sortable) return;

			if (this.sortColumn === column.id)
			{
				this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
			}
			else
			{
				this.sortColumn = column.id;
				this.sortDirection = 'asc';
			}

			if (this.onSort)
			{
				this.onSort({ column: column.id, direction: this.sortDirection });
			}
		};

		this.handleRowClick = (row, index) =>
		{
			if (this.onRowClick)
			{
				this.onRowClick({ row, index });
			}
		};

		this.getSortIcon = (columnId) =>
		{
			if (this.sortColumn !== columnId) return 'unfold_more';
			return this.sortDirection === 'asc' ? 'expand_less' : 'expand_more';
		};

		this.getCellValue = (row, columnId) =>
		{
			return row[columnId] !== undefined ? row[columnId] : '';
		};

		return `
			<div class="holder" :variant="variant.join(' ')">
				<div class="header">
					<div dh-for="column in columns" class="cell" :style="column.width ? 'width:' + column.width : ''" dh-click="handleSort(column)">
						<span class="label">{{ column.label }}</span>
						<i dh-if="sortable" class="icon sort-icon">{{ getSortIcon(column.id) }}</i>
					</div>
				</div>
				<div class="body">
					<div dh-for="row, index in rows" class="row" dh-click="handleRowClick(row, index)">
						<div dh-for="column in columns" class="cell" :style="column.width ? 'width:' + column.width : ''">
							{{ getCellValue(row, column.id) }}
						</div>
					</div>
				</div>
			</div>
		`;
	}
});
