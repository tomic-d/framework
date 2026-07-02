onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'popup-drawer',
		icon: 'web_asset',
		name: 'Popup Panel',
		description: 'Chrome for modals, drawers and sheets: header, body and actions.',
		category: 'Float',
		author: 'OneType',
		config: {
			config: {
				type: 'object',
				value: {}
			},
			_close: {
				type: 'function'
			}
		},
		render: function()
		{
			this.Compute(() =>
			{
				this.title = this.config.title || '';
				this.description = this.config.description || '';
				this.content = this.config.content;
				this.actions = this.config.actions || [];
				this.clean = this.config.clean === true;
				this.width = this.config.width || 'm';
				this.pad = this.config.padding || 'm';
				this.place = this.config.place || 'center';
			});

			this.dismiss = () =>
			{
				this._close && this._close();
			};

			this.run = (action) =>
			{
				if(action.onClick)
				{
					action.onClick({ close: this.dismiss });
				}
			};

			this.inner = () =>
			{
				const content = this.content;

				return typeof content === 'function' ? content.call(this) : (content || '');
			};

			return `
				<div :class="'box place-' + place + ' width-' + width + (clean ? ' clean' : '')">
					<div ot-if="!clean" class="head">
						<div class="titles">
							<span class="title">{{ title }}</span>
							<span ot-if="description" class="description">{{ description }}</span>
						</div>
						<button class="close" ot-click="dismiss">
							<i>close</i>
						</button>
					</div>
					<div :class="'body pad-' + pad">
						<div ot-html="inner()"></div>
					</div>
					<div ot-if="actions.length" class="foot">
						<button ot-for="action in actions" :ot-key="action.label" :class="'action' + (action.color ? ' ' + action.color : '')" ot-click="run(action)">
							<i ot-if="action.icon">{{ action.icon }}</i>
							<span>{{ action.label }}</span>
						</button>
					</div>
				</div>
			`;
		}
	});
});
