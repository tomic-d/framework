onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-editor',
		icon: 'edit_note',
		name: 'Editor',
		description: 'Premium WYSIWYG editor with toolbar, floating selection bar, slash menu, paste cleanup and clean HTML output.',
		category: 'Form',
		author: 'OneType',
		config: {
			value: {
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
				value: ['bg-1', 'border', 'size-m', 'floating', 'slash'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'compact', 'no-toolbar', 'floating', 'slash', 'size-s', 'size-m', 'size-l']
			},
			_change: {
				type: 'function'
			}
		},
		render: function()
		{
			this.hasToolbar = !this.variant.includes('no-toolbar');
			this.hasFloating = this.variant.includes('floating');
			this.hasSlash = this.variant.includes('slash');

			this.tools = [
				{ cmd: 'bold', icon: 'format_bold', label: 'Bold', shortcut: '⌘B' },
				{ cmd: 'italic', icon: 'format_italic', label: 'Italic', shortcut: '⌘I' },
				{ cmd: 'underline', icon: 'format_underlined', label: 'Underline', shortcut: '⌘U' },
				{ cmd: 'strikeThrough', icon: 'strikethrough_s', label: 'Strikethrough' },
				{ sep: true },
				{ cmd: 'heading1', icon: 'title', label: 'Heading 1' },
				{ cmd: 'heading2', icon: 'text_fields', label: 'Heading 2' },
				{ cmd: 'heading3', icon: 'format_size', label: 'Heading 3' },
				{ cmd: 'blockquote', icon: 'format_quote', label: 'Quote' },
				{ sep: true },
				{ cmd: 'insertUnorderedList', icon: 'format_list_bulleted', label: 'Bullet list' },
				{ cmd: 'insertOrderedList', icon: 'format_list_numbered', label: 'Numbered list' },
				{ sep: true },
				{ cmd: 'link', icon: 'link', label: 'Link', shortcut: '⌘K' },
				{ cmd: 'image', icon: 'image', label: 'Image' },
				{ cmd: 'code', icon: 'code', label: 'Inline code' },
				{ cmd: 'divider', icon: 'horizontal_rule', label: 'Divider' },
				{ sep: true },
				{ cmd: 'clear', icon: 'format_clear', label: 'Clear formatting' },
				{ cmd: 'undo', icon: 'undo', label: 'Undo' },
				{ cmd: 'redo', icon: 'redo', label: 'Redo' }
			];

			this.floatingTools = [
				{ cmd: 'bold', icon: 'format_bold' },
				{ cmd: 'italic', icon: 'format_italic' },
				{ cmd: 'underline', icon: 'format_underlined' },
				{ cmd: 'link', icon: 'link' },
				{ cmd: 'heading2', icon: 'title' },
				{ cmd: 'blockquote', icon: 'format_quote' }
			];

			this.slashItems = [
				{ cmd: 'heading1', icon: 'title', label: 'Heading 1', description: 'Big section heading.' },
				{ cmd: 'heading2', icon: 'text_fields', label: 'Heading 2', description: 'Medium section heading.' },
				{ cmd: 'heading3', icon: 'format_size', label: 'Heading 3', description: 'Small section heading.' },
				{ cmd: 'insertUnorderedList', icon: 'format_list_bulleted', label: 'Bullet list', description: 'Simple bullet list.' },
				{ cmd: 'insertOrderedList', icon: 'format_list_numbered', label: 'Numbered list', description: 'Ordered list with numbers.' },
				{ cmd: 'blockquote', icon: 'format_quote', label: 'Quote', description: 'Highlighted quote block.' },
				{ cmd: 'divider', icon: 'horizontal_rule', label: 'Divider', description: 'Horizontal line separator.' },
				{ cmd: 'image', icon: 'image', label: 'Image', description: 'Insert image from URL.' }
			];

			// ---- HTML cleanup (used on paste and on output) ----

			this.cleanHtml = (html) =>
			{
				const allowed = {
					P: [], H2: [], H3: [], H4: [],
					STRONG: [], B: [], EM: [], I: [], U: [], S: [], STRIKE: [], DEL: [],
					A: ['href'], UL: [], OL: [], LI: [],
					BLOCKQUOTE: [], PRE: [], CODE: [],
					BR: [], HR: [], IMG: ['src', 'alt']
				};

				const build = (node, output) =>
				{
					Array.from(node.childNodes).forEach((child) =>
					{
						if(child.nodeType === 3)
						{
							output.appendChild(document.createTextNode(child.textContent));
							return;
						}

						if(child.nodeType !== 1)
						{
							return;
						}

						let tag = child.tagName;

						if(tag === 'H1')
						{
							tag = 'H2';
						}

						if(tag === 'B' || tag === 'STRONG')
						{
							const node = document.createElement('strong');
							build(child, node);
							output.appendChild(node);
							return;
						}

						if(tag === 'I' || tag === 'EM')
						{
							const node = document.createElement('em');
							build(child, node);
							output.appendChild(node);
							return;
						}

						if(tag === 'STRIKE' || tag === 'DEL')
						{
							const node = document.createElement('s');
							build(child, node);
							output.appendChild(node);
							return;
						}

						if(tag in allowed)
						{
							const node = document.createElement(tag);
							const attrs = allowed[tag];

							attrs.forEach((attr) =>
							{
								const value = child.getAttribute(attr);

								if(value)
								{
									node.setAttribute(attr, value);
								}
							});

							build(child, node);
							output.appendChild(node);
							return;
						}

						build(child, output);
					});
				};

				const source = document.createElement('div');
				source.innerHTML = html;

				const target = document.createElement('div');
				build(source, target);

				let result = target.innerHTML.trim();

				// Strip empty paragraphs
				result = result.replace(/<p>(\s|&nbsp;|<br>)*<\/p>/g, '');

				return result;
			};

			// ---- Command execution ----

			this.exec = async (cmd) =>
			{
				if(!this.body)
				{
					return;
				}

				this.body.focus();

				const block = document.queryCommandValue('formatBlock');

				if(cmd === 'heading1')
				{
					document.execCommand('formatBlock', false, block === 'h2' ? 'p' : 'h2');
				}
				else if(cmd === 'heading2')
				{
					document.execCommand('formatBlock', false, block === 'h3' ? 'p' : 'h3');
				}
				else if(cmd === 'heading3')
				{
					document.execCommand('formatBlock', false, block === 'h4' ? 'p' : 'h4');
				}
				else if(cmd === 'blockquote')
				{
					document.execCommand('formatBlock', false, block === 'blockquote' ? 'p' : 'blockquote');
				}
				else if(cmd === 'code')
				{
					const selection = window.getSelection();

					if(selection && selection.toString())
					{
						const range = selection.getRangeAt(0);
						const code = document.createElement('code');
						code.textContent = selection.toString();
						range.deleteContents();
						range.insertNode(code);
						range.setStartAfter(code);
						range.setEndAfter(code);
						selection.removeAllRanges();
						selection.addRange(range);
					}
				}
				else if(cmd === 'divider')
				{
					document.execCommand('insertHTML', false, '<hr>');
				}
				else if(cmd === 'clear')
				{
					document.execCommand('removeFormat');
					document.execCommand('formatBlock', false, 'p');
				}
				else if(cmd === 'link')
				{
					const selection = window.getSelection();
					const text = selection ? selection.toString() : '';

					const url = await $ot.confirm({
						type: 'default',
						icon: 'link',
						title: 'Insert link',
						description: 'Enter the destination URL.',
						input: { placeholder: 'https://', value: '' },
						confirm: 'Insert',
						cancel: 'Cancel'
					});

					if(url)
					{
						if(text)
						{
							document.execCommand('createLink', false, url);
						}
						else
						{
							document.execCommand('insertHTML', false, `<a href="${url}">${url}</a>`);
						}
					}
				}
				else if(cmd === 'image')
				{
					const url = await $ot.confirm({
						type: 'default',
						icon: 'image',
						title: 'Insert image',
						description: 'Enter the image URL.',
						input: { placeholder: 'https://…', value: '' },
						confirm: 'Insert',
						cancel: 'Cancel'
					});

					if(url)
					{
						document.execCommand('insertImage', false, url);
					}
				}
				else
				{
					document.execCommand(cmd, false, null);
				}

				this.syncButtons();
				this.emit();
			};

			// ---- State tracking ----

			this.getState = () =>
			{
				const state = {
					bold: document.queryCommandState('bold'),
					italic: document.queryCommandState('italic'),
					underline: document.queryCommandState('underline'),
					strikeThrough: document.queryCommandState('strikeThrough'),
					insertUnorderedList: document.queryCommandState('insertUnorderedList'),
					insertOrderedList: document.queryCommandState('insertOrderedList')
				};

				const block = document.queryCommandValue('formatBlock');
				state.heading1 = block === 'h2';
				state.heading2 = block === 'h3';
				state.heading3 = block === 'h4';
				state.blockquote = block === 'blockquote';

				return state;
			};

			this.syncButtons = () =>
			{
				if(!this.Element)
				{
					return;
				}

				const state = this.getState();
				const buttons = this.Element.querySelectorAll('[data-cmd]');

				buttons.forEach((btn) =>
				{
					const cmd = btn.getAttribute('data-cmd');
					btn.classList.toggle('active', !!(cmd && state[cmd]));
				});
			};

			// ---- Emit change ----

			this.emit = () =>
			{
				if(!this.body || !this._change)
				{
					return;
				}

				const clean = this.cleanHtml(this.body.innerHTML);

				if(this.hidden)
				{
					this.hidden.value = clean;
				}

				this._change({ value: clean });
			};

			// ---- Floating toolbar ----

			this.floatingId = null;

			this.showFloating = () =>
			{
				if(!this.hasFloating)
				{
					return;
				}

				const selection = window.getSelection();

				if(!selection || selection.isCollapsed || !selection.toString().trim())
				{
					this.hideFloating();
					return;
				}

				if(!this.body || !this.body.contains(selection.anchorNode))
				{
					return;
				}

				const range = selection.getRangeAt(0);
				const rect = range.getBoundingClientRect();

				if(rect.width === 0 && rect.height === 0)
				{
					return;
				}

				this.hideFloating();

				const anchor = document.createElement('div');
				anchor.style.position = 'fixed';
				anchor.style.left = rect.left + rect.width / 2 + 'px';
				anchor.style.top = rect.top + 'px';
				anchor.style.width = '1px';
				anchor.style.height = '1px';
				anchor.style.pointerEvents = 'none';
				document.body.appendChild(anchor);

				this.floatingAnchor = anchor;

				const tools = this.floatingTools;

				const id = $ot.popup.open(anchor, function()
				{
					this.click = (cmd) =>
					{
						this.Destroy();
					};

					return /* html */ `
						<div class="e-45c96e98-float">
							${tools.map((tool) => `
								<button type="button" class="btn" data-cmd="${tool.cmd}">
									<i>${tool.icon}</i>
								</button>
							`).join('')}
						</div>
					`;
				}, {
					position: { x: 'center', y: 'top' },
					offset: { x: 0, y: -8 },
					closeable: false
				});

				this.floatingId = id;

				// Delegate button clicks
				setTimeout(() =>
				{
					const overlay = document.querySelector('[data-overlay-id="' + id + '"]');

					if(overlay)
					{
						overlay.addEventListener('mousedown', (event) =>
						{
							const btn = event.target.closest('[data-cmd]');

							if(btn)
							{
								event.preventDefault();
								const cmd = btn.getAttribute('data-cmd');
								this.exec(cmd);
							}
						});
					}
				}, 0);
			};

			this.hideFloating = () =>
			{
				if(this.floatingId)
				{
					$ot.popup.close(this.floatingId);
					this.floatingId = null;
				}

				if(this.floatingAnchor)
				{
					this.floatingAnchor.remove();
					this.floatingAnchor = null;
				}
			};

			// ---- Slash menu ----

			this.slashId = null;

			this.showSlash = () =>
			{
				if(!this.hasSlash)
				{
					return;
				}

				const selection = window.getSelection();

				if(!selection || !selection.rangeCount)
				{
					return;
				}

				const range = selection.getRangeAt(0);
				const rect = range.getBoundingClientRect();

				this.hideSlash();

				const anchor = document.createElement('div');
				anchor.style.position = 'fixed';
				anchor.style.left = rect.left + 'px';
				anchor.style.top = rect.bottom + 'px';
				anchor.style.width = '1px';
				anchor.style.height = '1px';
				anchor.style.pointerEvents = 'none';
				document.body.appendChild(anchor);

				this.slashAnchor = anchor;

				const items = this.slashItems;
				const self = this;

				const id = $ot.popup.open(anchor, function()
				{
					return /* html */ `
						<div class="e-45c96e98-slash">
							${items.map((item) => `
								<button type="button" class="item" data-cmd="${item.cmd}">
									<div class="icon"><i>${item.icon}</i></div>
									<div class="text">
										<div class="label">${item.label}</div>
										<div class="description">${item.description}</div>
									</div>
								</button>
							`).join('')}
						</div>
					`;
				}, {
					position: { x: 'left-in', y: 'bottom' },
					offset: { x: 0, y: 8 }
				});

				this.slashId = id;

				setTimeout(() =>
				{
					const overlay = document.querySelector('[data-overlay-id="' + id + '"]');

					if(overlay)
					{
						overlay.addEventListener('mousedown', (event) =>
						{
							const btn = event.target.closest('[data-cmd]');

							if(btn)
							{
								event.preventDefault();
								const cmd = btn.getAttribute('data-cmd');
								self.removeSlashChar();
								self.hideSlash();
								self.exec(cmd);
							}
						});
					}
				}, 0);
			};

			this.hideSlash = () =>
			{
				if(this.slashId)
				{
					$ot.popup.close(this.slashId);
					this.slashId = null;
				}

				if(this.slashAnchor)
				{
					this.slashAnchor.remove();
					this.slashAnchor = null;
				}
			};

			this.removeSlashChar = () =>
			{
				const selection = window.getSelection();

				if(!selection || !selection.rangeCount)
				{
					return;
				}

				const range = selection.getRangeAt(0);
				const node = range.startContainer;

				if(node.nodeType === 3 && range.startOffset > 0)
				{
					const text = node.textContent;
					const before = text.substring(0, range.startOffset - 1);
					const after = text.substring(range.startOffset);
					node.textContent = before + after;

					const newRange = document.createRange();
					newRange.setStart(node, before.length);
					newRange.collapse(true);
					selection.removeAllRanges();
					selection.addRange(newRange);
				}
			};

			// ---- Lifecycle ----

			this.OnReady(() =>
			{
				this.body = this.Element.querySelector('.body');
				this.hidden = this.Element.querySelector('input.hidden');

				if(!this.body)
				{
					return;
				}

				if(this.value)
				{
					this.body.innerHTML = this.value;
				}

				// Toolbar clicks (fixed toolbar)
				this.Element.querySelectorAll('.toolbar [data-cmd]').forEach((btn) =>
				{
					btn.addEventListener('mousedown', (event) =>
					{
						event.preventDefault();
						const cmd = btn.getAttribute('data-cmd');
						this.exec(cmd);
					});
				});

				// Body input
				this.body.addEventListener('input', () =>
				{
					// Slash menu trigger
					if(this.hasSlash)
					{
						const selection = window.getSelection();

						if(selection && selection.rangeCount)
						{
							const range = selection.getRangeAt(0);
							const node = range.startContainer;

							if(node.nodeType === 3)
							{
								const text = node.textContent.substring(0, range.startOffset);

								if(text.endsWith('/'))
								{
									// Only trigger if slash is at start of block or after space/newline
									const char = text.length >= 2 ? text.charAt(text.length - 2) : '';

									if(!char || char === ' ' || char === '\n')
									{
										this.showSlash();
									}
								}
								else if(this.slashId)
								{
									this.hideSlash();
								}
							}
						}
					}

					this.emit();
				});

				// Paste cleanup
				this.body.addEventListener('paste', (event) =>
				{
					event.preventDefault();

					const html = event.clipboardData.getData('text/html');
					const text = event.clipboardData.getData('text/plain');

					let content;

					if(html)
					{
						content = this.cleanHtml(html);
					}
					else
					{
						const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
						content = '<p>' + escaped.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>') + '</p>';
					}

					document.execCommand('insertHTML', false, content);
				});

				// Keyboard shortcuts + special keys
				this.body.addEventListener('keydown', (event) =>
				{
					const meta = event.metaKey || event.ctrlKey;

					if(meta && event.key === 'b')
					{
						event.preventDefault();
						this.exec('bold');
						return;
					}

					if(meta && event.key === 'i')
					{
						event.preventDefault();
						this.exec('italic');
						return;
					}

					if(meta && event.key === 'u')
					{
						event.preventDefault();
						this.exec('underline');
						return;
					}

					if(meta && event.key === 'k')
					{
						event.preventDefault();
						this.exec('link');
						return;
					}

					// Escape closes slash menu
					if(event.key === 'Escape' && this.slashId)
					{
						event.preventDefault();
						this.hideSlash();
						return;
					}

					// Enter inside blockquote/heading exits to paragraph on double enter
					if(event.key === 'Enter' && !event.shiftKey)
					{
						const block = document.queryCommandValue('formatBlock');

						if(block === 'blockquote')
						{
							const selection = window.getSelection();

							if(selection && selection.anchorNode)
							{
								const text = selection.anchorNode.textContent || '';

								if(!text.trim())
								{
									event.preventDefault();
									document.execCommand('formatBlock', false, 'p');
								}
							}
						}
					}
				});

				// Selection tracking for active buttons + floating toolbar
				const onSelection = () =>
				{
					if(!this.body)
					{
						return;
					}

					const selection = window.getSelection();

					if(!selection || !selection.anchorNode || !this.body.contains(selection.anchorNode))
					{
						return;
					}

					this.syncButtons();

					if(this.hasFloating)
					{
						if(!selection.isCollapsed && selection.toString().trim())
						{
							this.showFloating();
						}
						else
						{
							this.hideFloating();
						}
					}
				};

				document.addEventListener('selectionchange', onSelection);

				this.OnDestroy(() =>
				{
					document.removeEventListener('selectionchange', onSelection);
					this.hideFloating();
					this.hideSlash();
				});

				this.body.addEventListener('blur', () =>
				{
					// Keep floating until click resolves
					setTimeout(() => this.hideFloating(), 150);
				});
			});

			return /* html */ `
				<div :class="'holder ' + variant.join(' ')">
					<input ot-if="name" class="hidden" type="hidden" :name="name" :value="value" />
					<div ot-if="hasToolbar" class="toolbar">
						<div ot-for="tool in tools">
							<div ot-if="tool.sep" class="sep"></div>
							<button ot-if="!tool.sep" type="button" class="btn" :data-cmd="tool.cmd" :title="tool.label + (tool.shortcut ? ' (' + tool.shortcut + ')' : '')">
								<i>{{ tool.icon }}</i>
							</button>
						</div>
					</div>

					<div class="content">
						<div class="body" contenteditable="true" :data-placeholder="placeholder"></div>
					</div>
				</div>
			`;
		}
	});
});
