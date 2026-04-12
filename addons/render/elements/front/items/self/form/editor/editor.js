onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-editor',
		icon: 'edit_note',
		name: 'Editor',
		description: 'WYSIWYG editor with toolbar, floating bar, slash menu and clean HTML output.',
		category: 'Form',
		config:
		{
			value:
			{
				type: 'string',
				value: '',
				description: 'HTML content.'
			},
			placeholder:
			{
				type: 'string',
				value: 'Start writing…',
				description: 'Placeholder text.'
			},
			name:
			{
				type: 'string',
				value: '',
				description: 'Hidden input name for forms.'
			},
			background:
			{
				type: 'string',
				value: 'bg-1',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Background depth.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Editor size.'
			},
			variant:
			{
				type: 'array',
				value: ['border'],
				each: { type: 'string' },
				options: ['border', 'border-bottom'],
				description: 'Visual modifiers.'
			},
			toolbar:
			{
				type: 'boolean',
				value: true,
				description: 'Show fixed toolbar.'
			},
			floating:
			{
				type: 'boolean',
				value: true,
				description: 'Show floating bar on selection.'
			},
			slash:
			{
				type: 'boolean',
				value: true,
				description: 'Enable slash command menu.'
			},
			compact:
			{
				type: 'boolean',
				value: false,
				description: 'Tighter padding and shorter height.'
			},
			_change:
			{
				type: 'function',
				description: 'Change handler. Receives { value }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.body = null;
			this.hidden = null;
			this.floatingEl = null;
			this.slashEl = null;

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

				if(this.compact)
				{
					list.push('compact');
				}

				return list.join(' ');
			};

			/* ===== CLEAN ===== */

			this.allowed = {
				P: [], H2: [], H3: [], H4: [],
				STRONG: [], B: [], EM: [], I: [], U: [], S: [], STRIKE: [], DEL: [],
				A: ['href'], UL: [], OL: [], LI: [],
				BLOCKQUOTE: [], PRE: [], CODE: [],
				BR: [], HR: [], IMG: ['src', 'alt']
			};

			this.normalize = {
				H1: 'H2',
				B: 'STRONG',
				I: 'EM',
				STRIKE: 'S',
				DEL: 'S'
			};

			this.clean = (html) =>
			{
				const source = document.createElement('div');
				source.innerHTML = html;

				const target = document.createElement('div');
				this.walkNodes(source, target);

				return target.innerHTML.trim().replace(/<p>(\s|&nbsp;|<br>)*<\/p>/g, '');
			};

			this.walkNodes = (source, target) =>
			{
				Array.from(source.childNodes).forEach((child) =>
				{
					if(child.nodeType === 3)
					{
						target.appendChild(document.createTextNode(child.textContent));
						return;
					}

					if(child.nodeType !== 1)
					{
						return;
					}

					const tag = this.normalize[child.tagName] || child.tagName;

					if(!(tag in this.allowed))
					{
						this.walkNodes(child, target);
						return;
					}

					const node = document.createElement(tag);
					const attrs = this.allowed[tag];

					attrs.forEach((attr) =>
					{
						const value = child.getAttribute(attr);

						if(value)
						{
							node.setAttribute(attr, value);
						}
					});

					this.walkNodes(child, node);
					target.appendChild(node);
				});
			};

			/* ===== COMMANDS ===== */

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

					const url = await $ot.confirm('Insert link', 'Enter the destination URL.', {
						icon: 'link',
						input: true,
						placeholder: 'https://',
						confirm: 'Insert'
					});

					if(url)
					{
						this.body.focus();

						if(text)
						{
							document.execCommand('createLink', false, url);
						}
						else
						{
							const safe = url.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
							document.execCommand('insertHTML', false, '<a href="' + safe + '">' + safe + '</a>');
						}
					}
				}
				else if(cmd === 'image')
				{
					const url = await $ot.confirm('Insert image', 'Enter the image URL.', {
						icon: 'image',
						input: true,
						placeholder: 'https://…',
						confirm: 'Insert'
					});

					if(url)
					{
						this.body.focus();
						document.execCommand('insertImage', false, url);
					}
				}
				else
				{
					document.execCommand(cmd, false, null);
				}

				this.sync();
				this.emit();
			};

			/* ===== STATE TRACKING ===== */

			this.state = () =>
			{
				const result = {
					bold: document.queryCommandState('bold'),
					italic: document.queryCommandState('italic'),
					underline: document.queryCommandState('underline'),
					strikeThrough: document.queryCommandState('strikeThrough'),
					insertUnorderedList: document.queryCommandState('insertUnorderedList'),
					insertOrderedList: document.queryCommandState('insertOrderedList')
				};

				const block = document.queryCommandValue('formatBlock');
				result.heading1 = block === 'h2';
				result.heading2 = block === 'h3';
				result.heading3 = block === 'h4';
				result.blockquote = block === 'blockquote';

				return result;
			};

			this.sync = () =>
			{
				if(!this.Element)
				{
					return;
				}

				const current = this.state();
				const buttons = this.Element.querySelectorAll('[data-cmd]');

				buttons.forEach((btn) =>
				{
					const cmd = btn.getAttribute('data-cmd');
					btn.classList.toggle('active', !!(cmd && current[cmd]));
				});
			};

			/* ===== EMIT ===== */

			this.emit = () =>
			{
				if(!this.body)
				{
					return;
				}

				const value = this.clean(this.body.innerHTML);

				if(this.hidden)
				{
					this.hidden.value = value;
				}

				if(this._change)
				{
					this._change({ value });
				}
			};

			/* ===== FLOATING BAR ===== */

			this.buildFloating = () =>
			{
				const el = document.createElement('div');
				el.className = 'float';

				this.floatingTools.forEach((tool) =>
				{
					const btn = document.createElement('button');
					btn.type = 'button';
					btn.className = 'btn';
					btn.setAttribute('data-cmd', tool.cmd);
					btn.innerHTML = '<i>' + tool.icon + '</i>';

					btn.addEventListener('mousedown', (event) =>
					{
						event.preventDefault();
						this.exec(tool.cmd);
					});

					el.appendChild(btn);
				});

				return el;
			};

			this.showFloating = () =>
			{
				if(!this.floating || !this.body)
				{
					return;
				}

				const selection = window.getSelection();

				if(!selection || selection.isCollapsed || !selection.toString().trim())
				{
					this.hideFloating();
					return;
				}

				if(!this.body.contains(selection.anchorNode))
				{
					return;
				}

				const range = selection.getRangeAt(0);
				const rect = range.getBoundingClientRect();

				if(rect.width === 0 && rect.height === 0)
				{
					return;
				}

				if(!this.floatingEl)
				{
					this.floatingEl = this.buildFloating();
					this.Element.querySelector('.box').appendChild(this.floatingEl);
				}

				const box = this.Element.querySelector('.box').getBoundingClientRect();

				this.floatingEl.style.left = (rect.left + rect.width / 2 - box.left) + 'px';
				this.floatingEl.style.top = (rect.top - box.top - 8) + 'px';
				this.floatingEl.style.display = 'flex';
			};

			this.hideFloating = () =>
			{
				if(this.floatingEl)
				{
					this.floatingEl.style.display = 'none';
				}
			};

			/* ===== SLASH MENU ===== */

			this.buildSlash = () =>
			{
				const el = document.createElement('div');
				el.className = 'slash';

				this.slashItems.forEach((item) =>
				{
					const btn = document.createElement('button');
					btn.type = 'button';
					btn.className = 'item';
					btn.innerHTML = '<div class="icon"><i>' + item.icon + '</i></div><div class="text"><div class="label">' + item.label + '</div><div class="desc">' + item.description + '</div></div>';

					btn.addEventListener('mousedown', (event) =>
					{
						event.preventDefault();
						this.removeSlash();
						this.hideSlash();
						this.exec(item.cmd);
					});

					el.appendChild(btn);
				});

				return el;
			};

			this.showSlash = () =>
			{
				if(!this.slash || !this.body)
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

				if(!this.slashEl)
				{
					this.slashEl = this.buildSlash();
					this.Element.querySelector('.box').appendChild(this.slashEl);
				}

				const box = this.Element.querySelector('.box').getBoundingClientRect();

				this.slashEl.style.left = (rect.left - box.left) + 'px';
				this.slashEl.style.top = (rect.bottom - box.top + 8) + 'px';
				this.slashEl.style.display = 'flex';
			};

			this.hideSlash = () =>
			{
				if(this.slashEl)
				{
					this.slashEl.style.display = 'none';
				}
			};

			this.removeSlash = () =>
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

					const cursor = document.createRange();
					cursor.setStart(node, before.length);
					cursor.collapse(true);
					selection.removeAllRanges();
					selection.addRange(cursor);
				}
			};

			/* ===== HANDLERS ===== */

			this.onInput = () =>
			{
				if(this.slash)
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
								const prev = text.length >= 2 ? text.charAt(text.length - 2) : '';

								if(!prev || prev === ' ' || prev === '\n')
								{
									this.showSlash();
									return;
								}
							}
						}
					}

					if(this.slashEl && this.slashEl.style.display !== 'none')
					{
						this.hideSlash();
					}
				}

				this.emit();
			};

			this.onPaste = (event) =>
			{
				event.preventDefault();

				const html = event.clipboardData.getData('text/html');
				const text = event.clipboardData.getData('text/plain');

				let content;

				if(html)
				{
					content = this.clean(html);
				}
				else
				{
					const safe = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
					content = '<p>' + safe.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>') + '</p>';
				}

				document.execCommand('insertHTML', false, content);
			};

			this.onKeydown = (event) =>
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

				if(event.key === 'Escape' && this.slashEl && this.slashEl.style.display !== 'none')
				{
					event.preventDefault();
					this.hideSlash();
					return;
				}

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
			};

			this.onSelection = () =>
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

				this.sync();

				if(this.floating)
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

			/* ===== LIFECYCLE ===== */

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

				/* Toolbar clicks */
				this.Element.querySelectorAll('.bar [data-cmd]').forEach((btn) =>
				{
					btn.addEventListener('mousedown', (event) =>
					{
						event.preventDefault();
						this.exec(btn.getAttribute('data-cmd'));
					});
				});

				/* Body events */
				this.body.addEventListener('input', this.onInput);
				this.body.addEventListener('paste', this.onPaste);
				this.body.addEventListener('keydown', this.onKeydown);

				/* Selection tracking */
				document.addEventListener('selectionchange', this.onSelection);

				/* Blur — hide floating after click resolves */
				this.body.addEventListener('blur', () =>
				{
					setTimeout(() => this.hideFloating(), 150);
				});

				/* Click outside slash */
				document.addEventListener('mousedown', (event) =>
				{
					if(this.slashEl && this.slashEl.style.display !== 'none' && !this.slashEl.contains(event.target))
					{
						this.hideSlash();
					}
				});
			});

			this.OnDestroy(() =>
			{
				document.removeEventListener('selectionchange', this.onSelection);
				this.hideFloating();
				this.hideSlash();
			});

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<input ot-if="name" class="hidden" type="hidden" :name="name" :value="value" />
					<div ot-if="toolbar" class="bar">
						<div ot-for="tool in tools">
							<div ot-if="tool.sep" class="sep"></div>
							<button ot-if="!tool.sep" type="button" class="btn" :data-cmd="tool.cmd" :title="tool.label + (tool.shortcut ? ' (' + tool.shortcut + ')' : '')">
								<i>{{ tool.icon }}</i>
							</button>
						</div>
					</div>
					<div class="area">
						<div class="body" contenteditable="true" :data-placeholder="placeholder"></div>
					</div>
				</div>
			`;
		}
	});
});
