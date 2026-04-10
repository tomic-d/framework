onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-editor-markdown',
		icon: 'edit_note',
		name: 'Markdown Editor',
		description: 'WYSIWYG markdown editor with toolbar, cover image, title, and body.',
		category: 'Form',
		author: 'OneType',
		config: {
			value: {
				type: 'string',
				value: ''
			},
			title: {
				type: 'string',
				value: ''
			},
			subtitle: {
				type: 'string',
				value: ''
			},
			cover: {
				type: 'string',
				value: ''
			},
			placeholder: {
				type: 'string',
				value: 'Start writing…'
			},
			name: {
				type: 'string',
				value: ''
			},
			variant: {
				type: 'array',
				value: [],
				options: ['compact', 'no-toolbar', 'no-cover', 'no-title']
			},
			_change: {
				type: 'function'
			}
		},
		render: function()
		{
			this.tools = [
				{ cmd: 'bold', icon: 'format_bold', label: 'Bold' },
				{ cmd: 'italic', icon: 'format_italic', label: 'Italic' },
				{ cmd: 'underline', icon: 'format_underlined', label: 'Underline' },
				{ sep: true },
				{ cmd: 'heading1', icon: 'title', label: 'Heading 1' },
				{ cmd: 'heading2', icon: 'text_fields', label: 'Heading 2' },
				{ cmd: 'blockquote', icon: 'format_quote', label: 'Quote' },
				{ sep: true },
				{ cmd: 'insertUnorderedList', icon: 'format_list_bulleted', label: 'Bullet list' },
				{ cmd: 'insertOrderedList', icon: 'format_list_numbered', label: 'Numbered list' },
				{ sep: true },
				{ cmd: 'link', icon: 'link', label: 'Link' },
				{ cmd: 'image', icon: 'image', label: 'Image' },
				{ sep: true },
				{ cmd: 'undo', icon: 'undo', label: 'Undo' },
				{ cmd: 'redo', icon: 'redo', label: 'Redo' }
			];

			this.exec = (cmd) =>
			{
				if(cmd === 'heading1')
				{
					document.execCommand('formatBlock', false, 'h2');
				}
				else if(cmd === 'heading2')
				{
					document.execCommand('formatBlock', false, 'h3');
				}
				else if(cmd === 'blockquote')
				{
					document.execCommand('formatBlock', false, 'blockquote');
				}
				else if(cmd === 'link')
				{
					const url = prompt('Enter URL:');
					if(url) document.execCommand('createLink', false, url);
				}
				else if(cmd === 'image')
				{
					const url = prompt('Enter image URL:');
					if(url) document.execCommand('insertImage', false, url);
				}
				else
				{
					document.execCommand(cmd, false, null);
				}
			};

			this.changeCover = () =>
			{
				const url = prompt('Enter cover image URL:', this.cover);
				if(url !== null) this.cover = url;
			};

			this.hasCover = !this.variant.includes('no-cover');
			this.hasTitle = !this.variant.includes('no-title');
			this.hasToolbar = !this.variant.includes('no-toolbar');

			this.OnReady(() =>
			{
				const body = this.Element.querySelector('.body');

				if(body && this.value)
				{
					body.innerHTML = onetype.Markdown ? onetype.Markdown(this.value) : this.value;
				}

				const hidden = this.Element.querySelector('input.hidden');

				if(body)
				{
					body.addEventListener('input', () =>
					{
						if(hidden) hidden.value = body.innerHTML;

						if(this._change)
						{
							this._change({
								value: body.innerHTML,
								title: this.title,
								subtitle: this.subtitle,
								cover: this.cover
							});
						}
					});
				}

				this.Element.querySelectorAll('.toolbar .btn').forEach(btn =>
				{
					btn.addEventListener('mousedown', (e) =>
					{
						e.preventDefault();
						const cmd = btn.getAttribute('data-cmd');
						if(cmd) this.exec(cmd);
					});
				});
			});

			this.changeTitle = ({ value }) =>
			{
				this.title = value;
			};

			this.changeSubtitle = ({ value }) =>
			{
				this.subtitle = value;
			};

			return /* html */ `
				<div :class="'holder ' + variant.join(' ')">
					<input ot-if="name" class="hidden" type="hidden" :name="name" :value="value" />
					<div ot-if="hasToolbar" class="toolbar">
						<div ot-for="tool in tools">
							<div ot-if="tool.sep" class="sep"></div>
							<button ot-if="!tool.sep" class="btn" :data-cmd="tool.cmd">
								<i>{{ tool.icon }}</i>
							</button>
						</div>
					</div>

					<div ot-if="hasCover && cover" class="cover" :style="'background-image: url(' + cover + ')'">
						<button class="change" ot-click="changeCover">
							<i>photo_camera</i>
							<span>Change cover</span>
						</button>
					</div>

					<div ot-if="hasCover && !cover" class="cover-empty" ot-click="changeCover">
						<i>add_photo_alternate</i>
						<span>Add cover image</span>
					</div>

					<div class="content">
						<div ot-if="hasTitle" class="title-area">
							<input class="title-input" type="text" :value="title" :placeholder="'Title'" ot-input="changeTitle" />
							<input class="subtitle-input" type="text" :value="subtitle" :placeholder="'Subtitle (optional)'" ot-input="changeSubtitle" />
						</div>

						<div class="body" contenteditable="true" :data-placeholder="placeholder"></div>
					</div>
				</div>
			`;
		}
	});
});
