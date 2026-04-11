onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-heading',
		icon: 'title',
		name: 'Heading',
		description: 'Page or section heading with eyebrow, icon, serif title, description and right/bottom slots.',
		category: 'Global',
		author: 'OneType',
		config: {
			eyebrow: {
				type: 'string'
			},
			icon: {
				type: 'string'
			},
			title: {
				type: 'string'
			},
			description: {
				type: 'string'
			},
			element: {
				type: 'string',
				value: 'h2',
				options: ['h1', 'h2']
			},
			variant: {
				type: 'array',
				value: ['left', 'size-m'],
				options: ['left', 'center', 'right', 'border-bottom', 'size-s', 'size-m', 'size-l']
			}
		},
		render: function()
		{
			this.hasRight = !!this.Slots.right;
			this.hasBottom = !!this.Slots.bottom;
			this.isH1 = this.element === 'h1';

			return /* html */ `
				<div :class="'holder ' + variant.join(' ')">
					<div class="top">
						<div ot-if="icon" class="icon"><i>{{ icon }}</i></div>
						<div class="text">
							<div ot-if="eyebrow" class="eyebrow">{{ eyebrow }}</div>
							<h1 ot-if="isH1" class="title"><span ot-html="title"></span></h1>
							<h2 ot-if="!isH1" class="title"><span ot-html="title"></span></h2>
							<p ot-if="description" class="description">{{ description }}</p>
						</div>
						<div ot-if="hasRight" class="right">
							<slot name="right"></slot>
						</div>
					</div>
					<div ot-if="hasBottom" class="bottom">
						<slot name="bottom"></slot>
					</div>
				</div>
			`;
		}
	});
});
