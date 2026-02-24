import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'code',
	icon: 'code',
	name: 'Code',
	description: 'Code block with label header and preformatted content.',
	category: 'Global',
	author: 'OneType',
	config: {
		label: {
			type: 'string',
			value: ''
		}
	},
	render: function()
	{
		this.copied = false;

		this.copy = (event, ctx) =>
		{
			const text = ctx.node.closest('.holder').querySelector('.content').textContent;
			navigator.clipboard.writeText(text);
			this.copied = true;
			this.Update();
			setTimeout(() => { this.copied = false; this.Update(); }, 2000);
		};

		return `
			<div class="holder">
				<div class="label">
					<span ot-if="label">{{ label }}</span>
					<button class="copy" ot-click="copy"><i ot-if="!copied">content_copy</i><i ot-if="copied">check</i></button>
				</div>
				<pre class="content"><slot name="content"></slot></pre>
			</div>
		`;
	}
});
