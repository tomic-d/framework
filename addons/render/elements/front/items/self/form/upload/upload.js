onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-upload',
		icon: 'cloud_upload',
		name: 'Upload',
		description: 'File upload with drag-and-drop, URL preview grid, suffix detection and remove.',
		category: 'Form',
		config:
		{
			mode:
			{
				type: 'string',
				value: 'grid',
				options: ['grid', 'input'],
				description: 'Display mode. Grid shows cards, input shows URL field with preview.'
			},
			value:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				description: 'Array of file URLs.'
			},
			placeholder:
			{
				type: 'string',
				value: 'Paste URL or drop file…',
				description: 'Placeholder for input mode.'
			},
			multiple:
			{
				type: 'boolean',
				value: true,
				description: 'Allow multiple files.'
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
				value: 'Drop files here or click to browse',
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
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.dragging = false;
			this.uploading = false;
			this.inputId = 'upload-' + onetype.GenerateUID();

			/* ===== HELPERS ===== */

			this.suffix = (url) =>
			{
				if(!url)
				{
					return '';
				}

				const clean = url.split('?')[0].split('#')[0];
				const dot = clean.lastIndexOf('.');

				if(dot === -1)
				{
					return '';
				}

				return clean.substring(dot + 1).toLowerCase();
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

			this.Compute(() =>
			{
				this.isInput = this.mode === 'input';
				this.url = this.value.length > 0 ? this.value[0] : '';
				this.hasPreview = this.url && this.isImage(this.url);
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

				if(this.isInput)
				{
					list.push('mode-input');
				}

				if(this.disabled)
				{
					list.push('disabled');
				}

				return list.join(' ');
			};

			this.zoneClasses = () =>
			{
				const list = ['zone'];

				if(this.dragging)
				{
					list.push('dragging');
				}

				if(this.value.length > 0)
				{
					list.push('compact');
				}

				return list.join(' ');
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

						if(ext && !patterns.includes(ext))
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

				if(!this.multiple && accepted.length)
				{
					this.value = [accepted[0]];
				}
				else
				{
					this.value = [...this.value, ...accepted];
				}

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
				const urls = [];

				this.uploading = true;
				this.Update();

				for(const file of files)
				{
					const url = await this.uploadFile(file);

					if(url)
					{
						urls.push(url);
					}
				}

				this.uploading = false;
				this.addUrls(urls);
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

			/* ===== DRAG EVENTS ===== */

			this.dragenter = ({ event }) =>
			{
				event.preventDefault();
				event.stopPropagation();

				if(!this.disabled)
				{
					this.dragging = true;
				}
			};

			this.dragover = ({ event }) =>
			{
				event.preventDefault();
				event.stopPropagation();
			};

			this.dragleave = ({ event }) =>
			{
				event.preventDefault();
				event.stopPropagation();

				if(event.currentTarget.contains(event.relatedTarget))
				{
					return;
				}

				this.dragging = false;
			};

			this.drop = ({ event }) =>
			{
				event.preventDefault();
				event.stopPropagation();
				this.dragging = false;

				if(this.disabled)
				{
					return;
				}

				const files = event.dataTransfer.files;

				if(files && files.length)
				{
					this.addFiles(files);
				}
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

			/* ===== INPUT MODE ===== */

			this.onUrl = ({ event, value }) =>
			{
				this.url = value;
				this.hasPreview = value && this.isImage(value);

				if(value)
				{
					this.value = [value];
				}
				else
				{
					this.value = [];
				}

				if(this._change)
				{
					this._change({ value: this.value });
				}
			};

			this.clearUrl = () =>
			{
				this.url = '';
				this.hasPreview = false;
				this.value = [];

				if(this._change)
				{
					this._change({ value: this.value });
				}
			};

			/* ===== RENDER ===== */

			if(this.isInput)
			{
				return /* html */ `
					<div :class="classes()">
						<div class="row">
							<div ot-if="hasPreview" class="preview">
								<img :src="url" />
							</div>
							<div ot-if="url && !hasPreview" class="preview placeholder">
								<i>{{ fileIcon(url) }}</i>
							</div>
							<div class="field">
								<i class="icon">link</i>
								<input
									class="text"
									type="text"
									:value="url"
									:placeholder="placeholder"
									:disabled="disabled || null"
									autocomplete="off"
									ot-change="onUrl"
								/>
								<button
									ot-if="url && !disabled"
									type="button"
									class="action"
									ot-click.stop="clearUrl"
								>
									<i>close</i>
								</button>
								<button
									ot-if="!disabled"
									type="button"
									class="action"
									ot-click.stop="browse"
								>
									<i>upload</i>
								</button>
							</div>
							<input
								class="input"
								type="file"
								:accept="accept || null"
								:disabled="disabled || null"
								ot-change="pick"
							/>
						</div>
					</div>
				`;
			}

			return /* html */ `
				<div :class="classes()">
					<div
						:class="zoneClasses()"
						ot-dragenter="dragenter"
						ot-dragover="dragover"
						ot-dragleave="dragleave"
						ot-drop="drop"
					>
						<input
							class="input"
							type="file"
							:id="inputId"
							:accept="accept || null"
							:multiple="multiple || null"
							:disabled="disabled || null"
							ot-change="pick"
						/>

						<div ot-if="value.length === 0" class="prompt" ot-click="browse">
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
								<span class="name">{{ fileName(url) }}</span>
								<button
									type="button"
									class="remove"
									ot-click.stop="() => remove(index)"
								>
									<i>close</i>
								</button>
							</div>

							<div ot-if="multiple && (!max || value.length < max)" class="card add" ot-click="browse">
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
