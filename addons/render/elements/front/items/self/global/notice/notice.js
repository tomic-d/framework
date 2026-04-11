onetype.AddonReady('elements', (elements) =>
{
	const DEFAULT_ICONS = {
		red: 'error',
		orange: 'warning',
		green: 'check_circle',
		blue: 'info',
		brand: 'bolt'
	};

	elements.ItemAdd({
		id: 'global-notice',
		icon: 'info',
		name: 'Notice',
		description: 'Notice banner with icon, title, text, actions slot and close button.',
		category: 'Global',
		author: 'OneType',
		config: {
			icon: {
				type: 'string'
			},
			title: {
				type: 'string'
			},
			text: {
				type: 'string'
			},
			closable: {
				type: 'boolean'
			},
			variant: {
				type: 'array',
				value: ['blue', 'size-m'],
				options: ['red', 'green', 'blue', 'orange', 'brand', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'filled', 'accent', 'size-s', 'size-m', 'size-l']
			},
			_close: {
				type: 'function'
			}
		},
		render: function()
		{
			this.hasActions = !!this.Slots.actions;
			this.closed = false;

			const color = this.variant.find(v => DEFAULT_ICONS[v]);
			this.resolvedIcon = this.icon || (color ? DEFAULT_ICONS[color] : 'info');

			this.close = (event) =>
			{
				this.closed = true;

				if(this._close)
				{
					this._close({ event });
				}
			};

			return /* html */ `
				<div ot-if="!closed" :class="'holder ' + variant.join(' ')">
					<i class="icon">{{ resolvedIcon }}</i>
					<div class="body">
						<div ot-if="title" class="title">{{ title }}</div>
						<div ot-if="text" class="text">{{ text }}</div>
					</div>
					<div ot-if="hasActions" class="actions">
						<slot name="actions"></slot>
					</div>
					<button ot-if="closable" type="button" class="close" ot-click="close">
						<i>close</i>
					</button>
				</div>
			`;
		}
	});
});
