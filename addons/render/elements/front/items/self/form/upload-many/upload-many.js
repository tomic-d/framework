onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-upload-many',
		icon: 'cloud_upload',
		name: 'Upload',
		description: 'File upload with drag-and-drop, URL preview grid, suffix detection and remove.',
		category: 'Form',
		config:
		{
			value:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				description: 'Array of file URLs.'
			},
			max:
			{
				type: 'number',
				description: 'Maximum number of files.'
			},
			accept:
			{
				type: 'string',
				value: '',
				description: 'Accepted file extensions (.png, .pdf) or MIME patterns (image/*).'
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
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Background depth.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Dropzone size.'
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
			_upload:
			{
				type: 'function',
				description: 'Upload handler. Receives { file }. Must return URL string or null.'
			},
			_error:
			{
				type: 'function',
				description: 'Error handler. Receives { errors }.'
			},
			variables:
			{
				type: 'object',
				value: {},
				description: 'Available variables to set the value via the variable builder modal.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.uploading = false;
			this.inputId = 'upload-' + onetype.GenerateUID();

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

			this.isVideo = (url) =>
			{
				const ext = this.suffix(url);
				return ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext);
			};

			this.fileIcon = (url) =>
			{
				const ext = this.suffix(url);

				if(this.isImage(url)) return 'image';
				if(this.isVideo(url)) return 'movie';
				if(['mp3', 'wav', 'ogg', 'flac', 'aac'].includes(ext)) return 'audio_file';
				if(ext === 'pdf') return 'picture_as_pdf';
				if(['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'folder_zip';
				if(['doc', 'docx'].includes(ext)) return 'description';
				if(['xls', 'xlsx', 'csv'].includes(ext)) return 'table_chart';
				if(['ppt', 'pptx'].includes(ext)) return 'slideshow';
				if(['js', 'ts', 'jsx', 'tsx', 'py', 'go', 'rs', 'java', 'c', 'cpp', 'html', 'css', 'json'].includes(ext)) return 'code';

				return 'insert_drive_file';
			};

			this.fileName = (url) =>
			{
				if(!url)
				{
					return '';
				}

				const clean = url.split('?')[0].split('#')[0];
				const slash = clean.lastIndexOf('/');

				return slash !== -1 ? clean.substring(slash + 1) : clean;
			};


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

			this.zoneClasses = () =>
			{
				return this.value.length > 0 ? 'zone compact' : 'zone';
			};

			/* ===== HANDLERS ===== */

			this.addUrls = (urls) =>
			{
const errors = [];
				const accepted = [];

				for(const url of urls)
				{
					if(!url || typeof url !== 'string')
					{
						continue;
					}

					if(this.accept)
					{
						const ext = this.suffix(url);
						const patterns = this.accept.split(',').map(p => p.trim().toLowerCase().replace('.', ''));
						const mime = patterns.some(p => p.includes('/'));

						if(ext && !mime && !patterns.includes(ext))
						{
							errors.push('File "' + this.fileName(url) + '" type not allowed.');
							continue;
						}
					}

					if(this.max && this.value.length + accepted.length >= this.max)
					{
						errors.push('Maximum of ' + this.max + ' files reached.');
						break;
					}

					accepted.push(url);
				}

				this.value = [...this.value, ...accepted];

				if(errors.length && this._error)
				{
					this._error({ errors });
				}

				if(this._change)
				{
this._change({ value: this.value });
				}

				this.Update();
			};

			this.uploadFile = async (file) =>
			{
if(this._upload)
				{
					const url = await this._upload({ file });

if(url && typeof url === 'string')
					{
						return url;
					}
				}

				return null;
			};

			this.addFiles = async (fileList) =>
			{
				if(this.disabled)
				{
					return;
				}

				const files = Array.from(fileList);

				this.uploading = true;
				this.Update();

				await Promise.all(files.map(async (file) =>
				{
					const url = await this.uploadFile(file);

					if(url)
					{
						this.addUrls([url]);
					}
				}));

				this.uploading = false;
			};

			this.remove = (index) =>
			{
				if(this.disabled)
				{
					return;
				}

				this.value.splice(index, 1);

				if(this._change)
				{
					this._change({ value: this.value });
				}

				this.Update();
			};

			this.clear = () =>
			{
				if(this.disabled)
				{
					return;
				}

				this.value = [];

				if(this._change)
				{
					this._change({ value: this.value });
				}

				this.Update();
			};

			this.pick = ({ event }) =>
			{
				const files = event.target.files;

				if(files && files.length)
				{
					this.addFiles(files);
				}

				event.target.value = '';
			};

			this.browse = () =>
			{
				if(this.disabled)
				{
					return;
				}

				const input = this.Element.querySelector('.input');

				if(input)
				{
					input.click();
				}
			};

			/* ===== VARIABLES ===== */

			this.hasVariables = () =>
			{
				return this.variables && typeof this.variables === 'object' && Object.keys(this.variables).length > 0;
			};

			this.isExpression = () =>
			{
				return typeof this.value === 'string' && /^\{\{\s*[\s\S]+\s*\}\}$/.test(this.value.trim());
			};

			this.openVariableBuilder = () =>
			{
				const modalId = 'modal-var-builder-' + Date.now();
				const currentValue = typeof this.value === 'string' ? this.value : '';

				const initial = (() =>
				{
					const m = /^\{\{\s*([\s\S]*?)\s*\}\}$/.exec(String(currentValue).trim());
					return m ? m[1] : '';
				})();

				const onSave = ({ expression }) =>
				{
					const wrapped = '{{ ' + expression + ' }}';
					this.value = wrapped;

					if(this._change)
					{
						this._change({ value: wrapped });
					}

					$ot.modal.close(modalId);
					this.Update();
				};

				const onCancel = () =>
				{
					$ot.modal.close(modalId);
				};

				const variables = this.variables;

				$ot.modal(function()
				{
					this.variables = variables;
					this.initial = initial;
					this.onSave = onSave;
					this.onCancel = onCancel;

					return /* html */ `<e-variable-builder :variables="variables" :value="initial" :_save="onSave" :_cancel="onCancel"></e-variable-builder>`;
				}, { id: modalId });
			};

			this.clearExpression = () =>
			{
				this.value = [];

				if(this._change)
				{
					this._change({ value: [] });
				}

				this.Update();
			};

			/* ===== RENDER ===== */

			if(this.isExpression())
			{
				return /* html */ `
					<div :class="classes()">
						<e-variable-chip
							:value="value"
							:size="'m'"
							:disabled="disabled"
							:_edit="openVariableBuilder"
							:_clear="clearExpression"
						></e-variable-chip>
					</div>
				`;
			}

			return /* html */ `
				<div :class="classes()">
					<button
						ot-if="hasVariables() && !disabled"
						type="button"
						class="variable-btn"
						ot-click.stop="openVariableBuilder"
						:ot-tooltip="{ text: 'Insert variable', position: { x: 'center', y: 'top' } }"
					>
						<i>data_object</i>
					</button>
					<div :class="zoneClasses()">
						<input
							class="input"
							type="file"
							:id="inputId"
							:accept="accept || null"
							multiple
							:disabled="disabled || null"
							ot-change="pick"
						/>

						<div ot-if="value.length === 0" class="prompt" ot-click.stop="browse">
							<div class="badge">
								<i ot-if="!uploading">{{ icon }}</i>
								<i ot-if="uploading" class="spin">progress_activity</i>
							</div>
							<div class="text">
								<span class="label">{{ label }}</span>
								<span ot-if="hint" class="hint">{{ hint }}</span>
								<span ot-if="!hint && accept" class="hint">Accepted: {{ accept }}</span>
							</div>
						</div>

						<div ot-if="value.length > 0" class="grid">
							<div ot-for="url, index in value" class="card">
								<div ot-if="isImage(url)" class="thumb">
									<img :src="url" :alt="fileName(url)" />
								</div>
								<div ot-if="!isImage(url)" class="thumb placeholder">
									<i>{{ fileIcon(url) }}</i>
								</div>
								<button
									type="button"
									class="remove"
									ot-click.stop="() => remove(index)"
								>
									<i>close</i>
								</button>
							</div>

							<div ot-if="uploading" class="card add loading">
								<i class="spin">progress_activity</i>
							</div>
							<div ot-if="!uploading && (!max || value.length < max)" class="card add" ot-click="browse">
								<i>add</i>
							</div>
						</div>
					</div>

					<div ot-if="value.length > 1" class="footer">
						<span class="count">{{ value.length }} file{{ value.length === 1 ? '' : 's' }}</span>
						<button type="button" class="clear" ot-click="clear">
							<i>delete_sweep</i>
							<span>Clear all</span>
						</button>
					</div>
				</div>
			`;
		}
	});
});
