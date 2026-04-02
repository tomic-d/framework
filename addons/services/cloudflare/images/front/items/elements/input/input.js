elements.ItemAdd({
	id: 'cloudflare-input',
	icon: 'image',
	name: 'Image Input',
	description: 'Image picker input that opens browse modal.',
	category: 'Form',
	author: 'OneType',
	config: {
		value: {
			type: 'string',
			value: ''
		},
		name: {
			type: 'string',
			value: ''
		},
		site: {
			type: 'object',
			value: null
		},
		multiple: {
			type: 'boolean',
			value: false
		},
		placeholder: {
			type: 'string',
			value: 'Select image...'
		},
		disabled: {
			type: 'boolean',
			value: false
		},
		variant: {
			type: 'array',
			value: ['bg-2', 'border', 'size-m'],
			options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'size-s', 'size-m', 'size-l']
		},
		_change: {
			type: 'function'
		}
	},
	render: function()
	{
		const self = this;

		this.images = () =>
		{
			if(!this.value)
			{
				return [];
			}

			return this.multiple ? this.value.split(',').filter(Boolean) : [this.value];
		};

		this.browse = () =>
		{
			if(this.disabled)
			{
				return;
			}

			const site = self.site || $ot.get('site');

			$ot.modal(function()
			{
				this.site = site;
				this.pick = (item) =>
				{
					$ot.modal.close();
					callback(item.url);
				};

				return `<e-cloudflare-images :site="site" :_pick="pick"></e-cloudflare-images>`;
			});
		};

		const callback = (url) =>
		{
			if(this.multiple)
			{
				const current = this.value ? this.value.split(',').filter(Boolean) : [];

				current.push(url);
				this.value = current.join(',');
			}
			else
			{
				this.value = url;
			}

			if(this._change)
			{
				this._change({ value: this.value });
			}
		};

		this.remove = (event, url) =>
		{
			event.stopPropagation();

			if(this.multiple)
			{
				const current = this.value.split(',').filter(v => v !== url);

				this.value = current.join(',');
			}
			else
			{
				this.value = '';
			}

			if(this._change)
			{
				this._change({ value: this.value });
			}
		};

		this.clear = (event) =>
		{
			event.stopPropagation();
			this.value = '';

			if(this._change)
			{
				this._change({ value: this.value });
			}
		};

		return `
			<div :class="'holder ' + variant.join(' ')">
				<input type="hidden" :name="name" :value="value" />
				<div ot-if="!images().length" class="empty" ot-click="browse">
					<i class="icon">image</i>
					<span class="text">{{ placeholder }}</span>
				</div>
				<div ot-if="images().length" class="preview" ot-click="browse">
					<div ot-for="url in images()" class="thumb">
						<img :src="url" loading="lazy" />
						<button class="remove" ot-click="(e) => remove(e, url)"><i>close</i></button>
					</div>
					<button ot-if="value" class="clear" ot-click="clear"><i>delete</i></button>
				</div>
			</div>
		`;
	}
});
