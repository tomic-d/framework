onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-upload',
		icon: 'cloud_upload',
		name: 'Upload',
		description: 'Premium file upload with drag-and-drop, preview thumbnails, progress bars, remove, multi-file and accept filter.',
		category: 'Form',
		author: 'OneType',
		config: {
			value: {
				type: 'array',
				value: [],
				each: { type: 'object' }
			},
			name: {
				type: 'string'
			},
			accept: {
				type: 'string',
				value: ''
			},
			multiple: {
				type: 'boolean',
				value: true
			},
			max: {
				type: 'number'
			},
			maxSize: {
				type: 'number'
			},
			label: {
				type: 'string',
				value: 'Drop files here or click to browse'
			},
			hint: {
				type: 'string'
			},
			icon: {
				type: 'string',
				value: 'cloud_upload'
			},
			disabled: {
				type: 'boolean'
			},
			variant: {
				type: 'array',
				value: ['bg-2', 'border', 'size-m'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'size-s', 'size-m', 'size-l']
			},
			_change: {
				type: 'function'
			},
			_error: {
				type: 'function'
			}
		},
		render: function()
		{
			this.dragging = false;
			this.inputId = 'upload-' + onetype.GenerateUID();

			// Helpers

			this.formatSize = (bytes) =>
			{
				if(bytes === undefined || bytes === null)
				{
					return '';
				}

				if(bytes < 1024)
				{
					return bytes + ' B';
				}

				if(bytes < 1024 * 1024)
				{
					return (bytes / 1024).toFixed(1) + ' KB';
				}

				if(bytes < 1024 * 1024 * 1024)
				{
					return (bytes / 1024 / 1024).toFixed(1) + ' MB';
				}

				return (bytes / 1024 / 1024 / 1024).toFixed(1) + ' GB';
			};

			this.fileIcon = (file) =>
			{
				const type = file.type || '';
				const name = (file.name || '').toLowerCase();

				if(type.startsWith('image/')) return 'image';
				if(type.startsWith('video/')) return 'movie';
				if(type.startsWith('audio/')) return 'audio_file';
				if(type.includes('pdf') || name.endsWith('.pdf')) return 'picture_as_pdf';
				if(type.includes('zip') || name.endsWith('.zip') || name.endsWith('.rar')) return 'folder_zip';
				if(name.match(/\.(doc|docx)$/)) return 'description';
				if(name.match(/\.(xls|xlsx|csv)$/)) return 'table_chart';
				if(name.match(/\.(ppt|pptx)$/)) return 'slideshow';
				if(name.match(/\.(js|ts|jsx|tsx|py|go|rs|java|c|cpp|html|css|json)$/)) return 'code';

				return 'insert_drive_file';
			};

			this.isImage = (file) =>
			{
				return (file.type || '').startsWith('image/');
			};

			// Validation

			this.validate = (file) =>
			{
				if(this.maxSize && file.size > this.maxSize)
				{
					return 'File "' + file.name + '" is larger than ' + this.formatSize(this.maxSize) + '.';
				}

				if(this.accept)
				{
					const patterns = this.accept.split(',').map(p => p.trim().toLowerCase());
					const name = (file.name || '').toLowerCase();
					const type = (file.type || '').toLowerCase();

					const matches = patterns.some(pattern =>
					{
						if(pattern.startsWith('.'))
						{
							return name.endsWith(pattern);
						}

						if(pattern.endsWith('/*'))
						{
							return type.startsWith(pattern.slice(0, -1));
						}

						return type === pattern;
					});

					if(!matches)
					{
						return 'File "' + file.name + '" type not allowed.';
					}
				}

				return null;
			};

			// Wrap raw File object with metadata

			this.wrap = (file) =>
			{
				const wrapped = {
					id: onetype.GenerateUID(),
					file,
					name: file.name,
					size: file.size,
					type: file.type,
					progress: 0,
					error: null,
					preview: null
				};

				if(this.isImage(file))
				{
					try
					{
						wrapped.preview = URL.createObjectURL(file);
					}
					catch(error) { }
				}

				return wrapped;
			};

			// Add files — validates and appends respecting max

			this.addFiles = (fileList) =>
			{
				if(this.disabled)
				{
					return;
				}

				const files = Array.from(fileList);
				const errors = [];
				const accepted = [];

				for(const file of files)
				{
					const error = this.validate(file);

					if(error)
					{
						errors.push(error);
						continue;
					}

					if(this.max && this.value.length + accepted.length >= this.max)
					{
						errors.push('Maximum of ' + this.max + ' files reached.');
						break;
					}

					accepted.push(this.wrap(file));
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

			// Remove one file

			this.remove = (index) =>
			{
				if(this.disabled)
				{
					return;
				}

				const removed = this.value[index];

				if(removed && removed.preview)
				{
					try
					{
						URL.revokeObjectURL(removed.preview);
					}
					catch(error) { }
				}

				this.value.splice(index, 1);

				if(this._change)
				{
					this._change({ value: this.value });
				}

				this.Update();
			};

			// Clear all

			this.clear = () =>
			{
				if(this.disabled)
				{
					return;
				}

				this.value.forEach(entry =>
				{
					if(entry.preview)
					{
						try
						{
							URL.revokeObjectURL(entry.preview);
						}
						catch(error) { }
					}
				});

				this.value = [];

				if(this._change)
				{
					this._change({ value: this.value });
				}

				this.Update();
			};

			// Events

			this.onDragEnter = (event) =>
			{
				event.preventDefault();
				event.stopPropagation();

				if(this.disabled)
				{
					return;
				}

				this.dragging = true;
			};

			this.onDragOver = (event) =>
			{
				event.preventDefault();
				event.stopPropagation();
			};

			this.onDragLeave = (event) =>
			{
				event.preventDefault();
				event.stopPropagation();

				if(event.currentTarget.contains(event.relatedTarget))
				{
					return;
				}

				this.dragging = false;
			};

			this.onDrop = (event) =>
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

			this.onPick = (event) =>
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

				const input = this.Element.querySelector('.file-input');

				if(input)
				{
					input.click();
				}
			};

			// Cleanup previews on destroy

			this.OnDestroy(() =>
			{
				this.value.forEach(entry =>
				{
					if(entry.preview)
					{
						try
						{
							URL.revokeObjectURL(entry.preview);
						}
						catch(error) { }
					}
				});
			});

			this.hasFiles = this.value.length > 0;

			return /* html */ `
				<div :class="'holder ' + variant.join(' ') + (disabled ? ' disabled' : '')">
					<div
						:class="'dropzone' + (dragging ? ' dragging' : '') + (hasFiles ? ' has-files' : '')"
						ot-click="browse"
						ot-dragenter="onDragEnter"
						ot-dragover="onDragOver"
						ot-dragleave="onDragLeave"
						ot-drop="onDrop"
					>
						<input
							class="file-input"
							type="file"
							:id="inputId"
							:name="name || null"
							:accept="accept || null"
							:multiple="multiple || null"
							:disabled="disabled || null"
							ot-change="onPick"
						/>

						<div class="dropzone-content">
							<div class="dropzone-icon">
								<i>{{ icon }}</i>
							</div>
							<div class="dropzone-text">
								<span class="dropzone-label">{{ label }}</span>
								<span ot-if="hint" class="dropzone-hint">{{ hint }}</span>
								<span ot-if="!hint && accept" class="dropzone-hint">Accepted: {{ accept }}</span>
								<span ot-if="!hint && !accept && maxSize" class="dropzone-hint">Max size: {{ formatSize(maxSize) }}</span>
							</div>
						</div>
					</div>

					<div ot-if="hasFiles" class="files">
						<div ot-for="entry, index in value" class="file">
							<div ot-if="entry.preview" class="file-preview">
								<img :src="entry.preview" :alt="entry.name" />
							</div>
							<div ot-if="!entry.preview" class="file-icon">
								<i>{{ fileIcon(entry) }}</i>
							</div>
							<div class="file-info">
								<span class="file-name">{{ entry.name }}</span>
								<span class="file-meta">
									<span>{{ formatSize(entry.size) }}</span>
									<span ot-if="entry.error" class="file-error">{{ entry.error }}</span>
								</span>
								<div ot-if="entry.progress > 0 && entry.progress < 100" class="file-progress">
									<div class="file-progress-bar" :style="'width: ' + entry.progress + '%'"></div>
								</div>
							</div>
							<button
								type="button"
								class="file-remove"
								ot-click="() => remove(index)"
								:ot-tooltip="{ text: 'Remove', position: { x: 'center', y: 'top' } }"
							>
								<i>close</i>
							</button>
						</div>

						<div ot-if="value.length > 1" class="files-footer">
							<span class="files-count">{{ value.length }} file{{ value.length === 1 ? '' : 's' }}</span>
							<button type="button" class="files-clear" ot-click="clear">
								<i>delete_sweep</i>
								<span>Clear all</span>
							</button>
						</div>
					</div>
				</div>
			`;
		}
	});
});
