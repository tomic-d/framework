onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-button',
		icon: 'smart_button',
		name: 'Button',
		description: 'Button with icons, loading state, and variant support.',
		category: 'Form',
		author: 'OneType',
		config: {
			icon: {
				type: 'string',
				value: ''
			},
			iconRight: {
				type: 'string',
				value: ''
			},
			text: {
				type: 'string',
				value: 'Button'
			},
			href: {
				type: 'string',
				value: ''
			},
			target: {
				type: 'string',
				value: null,
				options: ['_blank', '_self', '_parent', '_top']
			},
			type: {
				type: 'string',
				value: 'button',
				options: ['button', 'submit', 'reset']
			},
			disabled: {
				type: 'boolean',
				value: false
			},
			loading: {
				type: 'boolean',
				value: false
			},
			variant: {
				type: 'array',
				value: ['brand', 'size-m'],
				options: [
					'brand', 'blue', 'red', 'orange', 'green',
					'soft-brand', 'soft-blue', 'soft-red', 'soft-orange', 'soft-green',
					'outline-brand', 'outline-blue', 'outline-red', 'outline-orange', 'outline-green',
					'bg-1', 'bg-2', 'bg-3', 'bg-4',
					'ghost', 'glass', 'border', 'transparent',
					'size-s', 'size-m', 'size-l',
					'full', 'icon-only', 'rounded'
				]
			},
			_click: {
				type: 'function'
			}
		},
		render: function()
		{
			this.handle = (e) =>
			{
				if (this.disabled || this.loading) return;

				if (this._click)
				{
					this._click(e);
				}
			};

			const classes = "'holder ' + variant.join(' ') + (disabled ? ' disabled' : '') + (loading ? ' loading' : '')";

			const content = `
				<span ot-if="loading" class="spinner"><i>progress_activity</i></span>
				<span ot-if="!loading" class="content">
					<i ot-if="icon" class="left">{{ icon }}</i>
					<span ot-if="text && !variant.includes('icon-only')" class="text">{{ text }}</span>
					<i ot-if="iconRight" class="right">{{ iconRight }}</i>
				</span>
			`;

			if (this.href)
			{
				return `
					<a :class="${classes}" :href="href" :target="target" ot-click="handle">
						${content}
					</a>
				`;
			}

			return `
				<button :class="${classes}" :type="type" :disabled="disabled" ot-click="handle">
					${content}
				</button>
			`;
		}
	});
});
