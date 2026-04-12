onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-heading',
		icon: 'title',
		name: 'Heading',
		description: 'Section or page heading with eyebrow, icon, title, description and slots.',
		category: 'Global',
		config:
		{
			eyebrow:
			{
				type: 'string',
				value: '',
				description: 'Uppercase label above title.'
			},
			icon:
			{
				type: 'string',
				value: '',
				description: 'Leading icon in brand box.'
			},
			title:
			{
				type: 'string',
				value: '',
				description: 'Main heading text. Supports <em> for brand accent.'
			},
			description:
			{
				type: 'string',
				value: '',
				description: 'Subtext below title.'
			},
			element:
			{
				type: 'string',
				value: 'h2',
				options: ['h1', 'h2', 'h3'],
				description: 'Heading HTML element.'
			},
			align:
			{
				type: 'string',
				value: 'left',
				options: ['left', 'center', 'right'],
				description: 'Content alignment.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Heading scale.'
			},
			variant:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				options: ['border'],
				description: 'Visual modifiers.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.hasRight = !!this.Slots.right;
			this.hasBottom = !!this.Slots.bottom;

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.align, 'size-' + this.size];

				if(this.variant.includes('border'))
				{
					list.push('border');
				}

				return list.join(' ');
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<div class="top">
						<div ot-if="icon" class="icon"><i>{{ icon }}</i></div>
						<div class="text">
							<div ot-if="eyebrow" class="eyebrow">{{ eyebrow }}</div>
							<h1 ot-if="element === 'h1'" class="title"><span ot-html="title"></span></h1>
							<h2 ot-if="element === 'h2'" class="title"><span ot-html="title"></span></h2>
							<h3 ot-if="element === 'h3'" class="title"><span ot-html="title"></span></h3>
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
