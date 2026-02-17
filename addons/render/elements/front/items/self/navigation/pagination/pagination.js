import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'pagination',
	icon: 'last_page',
	name: 'Pagination',
	description: 'Pagination component with page numbers, previous/next buttons, and customizable appearance.',
	category: 'Navigation',
	author: 'Divhunt',
	config: {
		page: {
			type: 'number',
			value: 1
		},
		pages: {
			type: 'number',
			value: 10
		},
		visible: {
			type: 'number',
			value: 5
		},
		first: {
			type: 'boolean',
			value: true
		},
		last: {
			type: 'boolean',
			value: true
		},
		prev: {
			type: 'boolean',
			value: true
		},
		next: {
			type: 'boolean',
			value: true
		},
		variant: {
			type: 'array',
			value: ['size-m'],
			options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'size-s', 'size-m', 'size-l']
		},
		onChange: {
			type: 'function'
		}
	},
	render: function()
	{
		this.getPages = () =>
		{
			const pageList = [];
			const half = Math.floor(this.visible / 2);
			let start = Math.max(1, this.page - half);
			let end = Math.min(this.pages, start + this.visible - 1);

			if (end - start + 1 < this.visible)
			{
				start = Math.max(1, end - this.visible + 1);
			}

			if (start > 1)
			{
				pageList.push(1);
				if (start > 2)
				{
					pageList.push('...');
				}
			}

			for (let i = start; i <= end; i++)
			{
				pageList.push(i);
			}

			if (end < this.pages)
			{
				if (end < this.pages - 1)
				{
					pageList.push('...');
				}
				pageList.push(this.pages);
			}

			return pageList;
		};

		this.goToPage = (pageNum) =>
		{
			if (pageNum !== '...' && pageNum !== this.page && pageNum >= 1 && pageNum <= this.pages)
			{
				this.page = pageNum;
				if (this.onChange)
				{
					this.onChange(pageNum);
				}
			}
		};

		this.goToFirst = () => this.goToPage(1);
		this.goToLast = () => this.goToPage(this.pages);
		this.goToPrev = () => this.goToPage(this.page - 1);
		this.goToNext = () => this.goToPage(this.page + 1);

		return `
			<div class="holder" :variant="variant.join(' ')">
				<button dh-if="first" class="button first" :disabled="page === 1" dh-click="goToFirst">
					<i class="icon">first_page</i>
				</button>

				<button dh-if="prev" class="button prev" :disabled="page === 1" dh-click="goToPrev">
					<i class="icon">chevron_left</i>
				</button>

				<div class="pages">
					<button dh-for="pageNum in getPages()" class="page" :active="pageNum === page ? 'true' : 'false'" :disabled="pageNum === '...'" dh-click="() => goToPage(pageNum)">
						{{ pageNum }}
					</button>
				</div>

				<button dh-if="next" class="button next" :disabled="page === pages" dh-click="goToNext">
					<i class="icon">chevron_right</i>
				</button>

				<button dh-if="last" class="button last" :disabled="page === pages" dh-click="goToLast">
					<i class="icon">last_page</i>
				</button>
			</div>
		`;
	}
});
