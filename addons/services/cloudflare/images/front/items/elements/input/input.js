onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'cloudflare-images-input',
		icon: 'cloud_upload',
		name: 'Images Input',
		description: 'Cloudflare Images single upload input.',
		category: 'Form',
		config:
		{
			value:
			{
				type: 'string',
				value: '',
				description: 'Image URL.'
			},
			name:
			{
				type: 'string',
				value: '',
				description: 'Input name attribute.'
			},
			placeholder:
			{
				type: 'string',
				value: 'Paste URL or drop file…',
				description: 'Placeholder text.'
			},
			accept:
			{
				type: 'string',
				value: 'image/*',
				description: 'Accepted file types.'
			},
			disabled:
			{
				type: 'boolean',
				value: false,
				description: 'Disabled state.'
			},
			background:
			{
				type: 'string',
				value: 'bg-2',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Background depth.'
			},
			variant:
			{
				type: 'array',
				value: ['border'],
				each: { type: 'string' },
				options: ['border', 'border-bottom'],
				description: 'Visual modifiers.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Input size.'
			},
			_change:
			{
				type: 'function',
				description: 'Change handler. Receives { value }.'
			},
			_error:
			{
				type: 'function',
				description: 'Error handler. Receives { error }.'
			},
			variables:
			{
				type: 'object',
				value: {},
				description: 'Available variables propagated to the upload input.'
			}
		},
		render: function()
		{
			this.upload = async ({ file }) =>
			{
				const form = new FormData();

				form.append('file', file);
				form.append('filename', file.name);

				try
				{
					const response = await fetch('/api/images', { method: 'POST', body: form });
					const result = await response.json();

					if(result.code !== 200)
					{
						if(this._error)
						{
							this._error({ error: result.message || 'Upload failed.' });
						}

						return null;
					}

					return result.data.image.url;
				}
				catch(error)
				{
					if(this._error)
					{
						this._error({ error: error.message || 'Upload failed.' });
					}

					return null;
				}
			};

			return /* html */ `
				<e-form-upload-one
					:value="value"
					:name="name"
					:placeholder="placeholder"
					:accept="accept"
					:disabled="disabled"
					:background="background"
					:variant="variant"
					:size="size"
					:variables="variables"
					:_upload="upload"
					:_change="_change"
					:_error="_error"
				></e-form-upload-one>
			`;
		}
	});
});
