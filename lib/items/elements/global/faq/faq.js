onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-faq',
		icon: 'help',
		name: 'FAQ',
		description: 'Expandable FAQ accordion.',
		category: 'Global',
		author: 'OneType',
		config: {
			items: {
				type: 'array',
				value: []
			}
		},
		render: function()
		{
			this.open = -1;

			this.toggle = (index) =>
			{
				this.open = this.open === index ? -1 : index;
				this.Update();
			};

			this.isOpen = (index) =>
			{
				return this.open === index;
			};

			return `
				<div class="holder">
					<div ot-for="item, index in items" :class="'item' + (isOpen(index) ? ' active' : '')" ot-click="toggle(index)">
						<div class="question">
							<span class="text">{{ item.question }}</span>
							<i class="icon">{{ isOpen(index) ? 'remove' : 'add' }}</i>
						</div>
						<div ot-if="isOpen(index)" class="answer">{{ item.answer }}</div>
					</div>
				</div>
			`;
		}
	});
});
