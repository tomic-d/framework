onetype.AddonReady('elements', (elements) =>
{
	const ICONS = {
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
		description: 'Notice banner with icon, title, text, actions slot and dismiss button.',
		category: 'Global',
		config:
		{
			icon:
			{
				type: 'string',
				value: '',
				description: 'Override auto-resolved icon.'
			},
			title:
			{
				type: 'string',
				value: '',
				description: 'Notice title.'
			},
			text:
			{
				type: 'string',
				value: '',
				description: 'Supporting text below title.'
			},
			closable:
			{
				type: 'boolean',
				value: false,
				description: 'Show close button.'
			},
			color:
			{
				type: 'string',
				value: 'blue',
				options: ['brand', 'blue', 'red', 'orange', 'green'],
				description: 'Notice color.'
			},
			tone:
			{
				type: 'string',
				value: 'soft',
				options: ['soft', 'filled', 'accent'],
				description: 'Visual tone.'
			},
			background:
			{
				type: 'string',
				value: '',
				options: ['', 'bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Neutral background when no color.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Notice size.'
			},
			_close:
			{
				type: 'function',
				description: 'Close handler. Receives { event }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.closed = false;

			this.Compute(() =>
			{
				this.hasActions = !!this.Slots.actions;
				this.resolvedIcon = this.icon || ICONS[this.color] || 'info';
			});

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.tone, 'size-' + this.size];

				if(this.background)
				{
					list.push(this.background);
				}
				else if(this.color)
				{
					list.push(this.color);
				}

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

			this.close = ({ event }) =>
			{
				this.closed = true;

				if(this._close)
				{
					this._close({ event });
				}
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div ot-if="!closed" :class="classes()">
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
