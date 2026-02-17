import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'files',
	icon: 'description',
	name: 'Files',
	description: 'File list with icons, sizes, and actions.',
	category: 'Data',
	author: 'Divhunt',
	config: {
		files: {
			type: 'array',
			value: [
				{
					name: 'Project Proposal.pdf',
					type: 'pdf',
					size: '2.4 MB',
					modified: '2 hours ago',
					icon: 'picture_as_pdf'
				},
				{
					name: 'Design Mockups.fig',
					type: 'figma',
					size: '8.1 MB',
					modified: 'Yesterday',
					icon: 'palette'
				},
				{
					name: 'Budget Spreadsheet.xlsx',
					type: 'excel',
					size: '156 KB',
					modified: '3 days ago',
					icon: 'table_chart'
				},
				{
					name: 'Meeting Notes.docx',
					type: 'word',
					size: '45 KB',
					modified: '1 week ago',
					icon: 'description'
				},
				{
					name: 'Presentation.pptx',
					type: 'powerpoint',
					size: '12.3 MB',
					modified: '2 weeks ago',
					icon: 'slideshow'
				}
			]
		},
		variant: {
			type: 'array',
			value: ['border'],
			options: ['border', 'bg-1', 'bg-2', 'bg-3', 'compact', 'grid']
		}
	},
	render: function()
	{
		return `
			<div class="holder" :variant="variant.join(' ')">
				<div dh-for="file in files" class="file">
					<div class="icon-wrapper">
						<i class="icon">{{ file.icon }}</i>
					</div>
					<div class="info">
						<div class="name">{{ file.name }}</div>
						<div class="meta">
							<span class="size">{{ file.size }}</span>
							<span class="separator">•</span>
							<span class="modified">{{ file.modified }}</span>
						</div>
					</div>
					<div class="actions">
						<e-button :variant="['ghost', 'size-s']">
							<i class="icon">download</i>
						</e-button>
						<e-button :variant="['ghost', 'size-s']">
							<i class="icon">more_vert</i>
						</e-button>
					</div>
				</div>
			</div>
		`;
	}
});
