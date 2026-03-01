onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-code',
		icon: 'code',
		name: 'Code',
		description: 'Code block with label header and preformatted content.',
		category: 'Global',
		author: 'OneType',
		config: {
			label: {
				type: 'string',
				value: ''
			},
			source: {
				type: 'string',
				value: ''
			},
			variant: {
				type: 'array',
				value: ['bg-2'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'size-s', 'size-m', 'size-l']
			}
		},
		render: function()
		{
			this.copied = false;
			this.escaped = this.source ? this.source.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';

			this.copy = (event, ctx) =>
			{
				const text = ctx.node.closest('.holder').querySelector('.content').textContent;
				navigator.clipboard.writeText(text);
				this.copied = true;
				this.Update();
				setTimeout(() => { this.copied = false; this.Update(); }, 2000);
			};

			return `
				<div :class="'holder ' + variant.join(' ')">
					<div class="label">
						<span ot-if="label">{{ label }}</span>
						<button class="copy" ot-click="copy"><i>{{ copied ? 'check' : 'content_copy' }}</i></button>
					</div>
					<pre ot-if="escaped" class="content"><div ot-html="escaped"></div></pre>
					<pre ot-if="!escaped" class="content"><slot name="content"></slot></pre>
				</div>
			`;
		}
	});
});
