import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'button',
	icon: 'smart_button',
	name: 'Button',
	description: 'Premium button with icons, variants, animations, and ripple effects.',
	category: 'Form',
	author: 'Divhunt',
	example: [
		{ title: 'Solid', code: '<e-button text="Brand" icon="add"></e-button>' },
		{ title: 'Soft', code: '<e-button text="Soft" icon="cloud" :variant="[\'soft-brand\']"></e-button>' },
		{ title: 'Outline', code: '<e-button text="Outline" icon="edit" :variant="[\'outline-brand\']"></e-button>' },
		{ title: 'Border', code: '<e-button text="Border" :variant="[\'border\']"></e-button>' },
		{ title: 'Ghost', code: '<e-button text="Ghost" :variant="[\'ghost\']"></e-button>' },
		{ title: 'Icon Only', code: '<e-button icon="add" :variant="[\'icon-only\']"></e-button>' }
	],
	config: {
		icon: {
			type: 'string',
		},
		iconRight: {
			type: 'string',
		},
		text: {
			type: 'string',
			value: 'Button'
		},
		href: {
			type: 'string',
		},
		target: {
			type: 'string',
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
		this.handleClick = (e) =>
		{
			if(this.disabled || this.loading)
			{
				return;
			}

			if(this._click)
			{
				this._click(e);
			}
		};

		const content = `
			<span dh-if="loading" class="spinner"><i>progress_activity</i></span>
			<span dh-if="!loading" class="content">
				<i dh-if="icon" class="icon-left">{{ icon }}</i>
				<span dh-if="text && !variant.includes('icon-only')" class="text">{{ text }}</span>
				<i dh-if="iconRight" class="icon-right">{{ iconRight }}</i>
			</span>
		`;

		if(this.href)
		{
			return `
				<a class="holder" :href="href" :target="target" :variant="variant.join(' ')" :disabled="disabled" :loading="loading" dh-click="handleClick">
					${content}
				</a>
			`;
		}

		return `
			<button class="holder" :type="type" :variant="variant.join(' ')" :disabled="disabled" :loading="loading" dh-click="handleClick">
				${content}
			</button>
		`;
	}
});
