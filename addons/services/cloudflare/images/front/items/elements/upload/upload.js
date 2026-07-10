onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'cloudflare-images-upload',
		icon: 'cloud_upload',
		name: 'Images Upload',
		description: 'Cloudflare Images upload wrapper for form-upload.',
		category: 'Form',
		config:
		{
			value:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				description: 'Array of image URLs.'
			},
			max:
			{
				type: 'number',
				description: 'Maximum number of files.'
			},
			accept:
			{
				type: 'string',
				value: 'image/*',
				description: 'Accepted file types.'
			},
			label:
			{
				type: 'string',
				value: 'Click to browse',
				description: 'Dropzone label text.'
			},
			hint:
			{
				type: 'string',
				value: '',
				description: 'Hint text below label.'
			},
			icon:
			{
				type: 'string',
				value: 'cloud_upload',
				description: 'Dropzone icon.'
			},
			background:
			{
				type: 'string',
				value: 'bg-2',
				options: ['bg-1', 'bg-2', 'bg-3'],
				description: 'Background depth.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Size.'
			},
			variant:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				options: ['border', 'border-bottom'],
				description: 'Visual modifiers.'
			},
			disabled:
			{
				type: 'boolean',
				value: false,
				description: 'Disabled state.'
			},
			_change:
			{
				type: 'function',
				description: 'Change handler. Receives { value }.'
			},
			_error:
			{
				type: 'function',
				description: 'Error handler. Receives { errors }.'
			}
		},
		render: function()
		{
			this.change = ({ value }) =>
			{
				if(this._change)
				{
					this._change({ value });
				}
			};

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
							this._error({ errors: [result.message || 'Upload failed.'] });
						}

						return null;
					}

					return result.data.image.url;
				}
				catch(error)
				{
if(this._error)
					{
						this._error({ errors: [error.message || 'Upload failed.'] });
					}

					return null;
				}
			};

			return /* html */ `
				<e-form-upload-many
					:value="value"
					:max="max"
					:accept="accept"
					:label="label"
					:hint="hint"
					:icon="icon"
					:background="background"
					:size="size"
					:variant="variant"
					:disabled="disabled"
					:_upload="upload"
					:_change="change"
					:_error="_error"
				></e-form-upload-many>
			`;
		}
	});
});
