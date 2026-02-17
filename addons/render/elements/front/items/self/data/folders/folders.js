import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'folders',
	icon: 'folder',
	name: 'Folders',
	description: 'Folder grid with item counts and colors.',
	category: 'Data',
	author: 'Divhunt',
	config: {
		folders: {
			type: 'array',
			value: [
				{
					name: 'Projects',
					count: 24,
					color: 'brand'
				},
				{
					name: 'Documents',
					count: 156,
					color: 'blue'
				},
				{
					name: 'Images',
					count: 89,
					color: 'green'
				},
				{
					name: 'Videos',
					count: 12,
					color: 'orange'
				},
				{
					name: 'Archives',
					count: 7,
					color: 'red'
				},
				{
					name: 'Templates',
					count: 32,
					color: 'brand'
				}
			]
		},
		variant: {
			type: 'array',
			value: ['grid'],
			options: ['grid', 'list', 'compact', 'border']
		}
	},
	render: function()
	{
		return `
			<div class="holder" :variant="variant.join(' ')">
				<div dh-for="folder in folders" class="folder" :color="folder.color">
					<div class="icon-wrapper">
						<i class="icon">folder</i>
					</div>
					<div class="info">
						<div class="name">{{ folder.name }}</div>
						<div class="count">{{ folder.count }} items</div>
					</div>
					<div class="actions">
						<e-button :variant="['ghost', 'size-s']">
							<i class="icon">more_vert</i>
						</e-button>
					</div>
				</div>
			</div>
		`;
	}
});
