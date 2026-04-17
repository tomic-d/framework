onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-upload-one',
		icon: 'upload',
		name: 'Upload Input',
		description: 'Single file upload input with image preview, file picker and clear.',
		category: 'Form',
		config:
		{
			value:
			{
				type: 'string',
				value: '',
				description: 'File URL.'
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
				value: '',
				description: 'Accepted file types for picker.'
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
			_upload:
			{
				type: 'function',
				description: 'Upload handler. Receives { file }. Must return URL string or null.'
			},
			_error:
			{
				type: 'function',
				description: 'Error handler. Receives { error }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.uploading = false;

			/* ===== HELPERS ===== */

			this.suffix = (url) =>
			{
				if(!url)
				{
					return '';
				}

				const hash = url.split('#')[1];

				if(hash)
				{
					const dot = hash.lastIndexOf('.');
					return dot !== -1 ? hash.substring(dot + 1).toLowerCase() : hash.toLowerCase();
				}

				const clean = url.split('?')[0];
				const segment = clean.split('/').pop();
				const dot = segment.lastIndexOf('.');

				if(dot === -1)
				{
					return '';
				}

				return segment.substring(dot + 1).toLowerCase();
			};

			this.isImage = (url) =>
			{
				const ext = this.suffix(url);
				return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'avif', 'ico', 'bmp'].includes(ext);
			};

			this.fileIcon = (url) =>
			{
				const ext = this.suffix(url);

				if(this.isImage(url)) return 'image';
				if(['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) return 'movie';
				if(['mp3', 'wav', 'ogg', 'flac', 'aac'].includes(ext)) return 'audio_file';
				if(ext === 'pdf') return 'picture_as_pdf';
				if(['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'folder_zip';
				if(['doc', 'docx'].includes(ext)) return 'description';
				if(['xls', 'xlsx', 'csv'].includes(ext)) return 'table_chart';
				if(['ppt', 'pptx'].includes(ext)) return 'slideshow';

				return 'insert_drive_file';
			};

			this.Compute(() =>
			{
				this.hasPreview = this.value && this.isImage(this.value);
				this.hasFile = !!this.value;
			});

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.background, 'size-' + this.size];

				if(this.variant.includes('border'))
				{
					list.push('border');
				}

				if(this.variant.includes('border-bottom'))
				{
					list.push('border-bottom');
				}

				if(this.disabled)
				{
					list.push('disabled');
				}

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

			this.change = ({ value }) =>
			{
				this.value = value || '';
				this.hasPreview = this.value && this.isImage(this.value);
				this.hasFile = !!this.value;

				if(this._change)
				{
					this._change({ value: this.value });
				}
			};

			this.browse = () =>
			{
				if(this.disabled)
				{
					return;
				}

				const input = this.Element.querySelector('.picker');

				if(input)
				{
					input.click();
				}
			};

			this.pick = async ({ event }) =>
			{
				const file = event.target.files?.[0];

				if(!file)
				{
					return;
				}

				event.target.value = '';

				if(!this._upload)
				{
					return;
				}

				this.uploading = true;

				try
				{
					const url = await this._upload({ file });

					if(url && typeof url === 'string')
					{
						this.value = url;
						this.hasPreview = this.isImage(url);
						this.hasFile = true;

						if(this._change)
						{
							this._change({ value: url });
						}
					}
				}
				catch(error)
				{
					if(this._error)
					{
						this._error({ error: error.message || 'Upload failed.' });
					}
				}

				this.uploading = false;
			};

			this.clear = () =>
			{
				if(this.disabled)
				{
					return;
				}

				this.value = '';
				this.hasPreview = false;
				this.hasFile = false;

				if(this._change)
				{
					this._change({ value: '' });
				}
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<div class="field">
						<div ot-if="hasPreview" class="preview">
							<img :src="value" />
						</div>
						<div ot-if="hasFile && !hasPreview" class="preview placeholder">
							<i>{{ fileIcon(value) }}</i>
						</div>
						<i ot-if="!hasFile" class="icon">link</i>
						<input
							class="input"
							type="text"
							:name="name"
							:value="value"
							:placeholder="placeholder"
							:disabled="disabled || null"
							autocomplete="off"
							ot-change="change"
						/>
						<i ot-if="uploading" class="icon spin">progress_activity</i>
						<button
							ot-if="hasFile && !disabled"
							type="button"
							class="action"
							ot-click.stop="clear"
						>
							<i>close</i>
						</button>
						<button
							ot-if="!disabled && !uploading"
							type="button"
							class="action"
							ot-click.stop="browse"
						>
							<i>upload</i>
						</button>
					</div>
					<input
						class="picker"
						type="file"
						:accept="accept || null"
						:disabled="disabled || null"
						ot-change="pick"
					/>
				</div>
			`;
		}
	});
});
