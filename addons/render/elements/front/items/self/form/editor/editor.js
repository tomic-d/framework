onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-editor',
		icon: 'edit_note',
		name: 'Editor',
		description: 'WYSIWYG editor with toolbar and clean HTML output.',
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
			compact:
			{
				type: 'boolean',
				value: false,
				description: 'Tighter padding and shorter height.'
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
			}
		},
		render: function()
		{
			this.body = null;
			this.range = null;
			this.syncFrame = null;
			this.listeners = [];

			this.tools = [
				{ cmd: 'bold', icon: 'format_bold', label: 'Bold' },
				{ cmd: 'underline', icon: 'format_underlined', label: 'Underline' },
				{ cmd: 'strikeThrough', icon: 'strikethrough_s', label: 'Strikethrough' },
				{ sep: true },
				{ cmd: 'heading2', icon: 'title', label: 'Heading 2' },
				{ cmd: 'heading3', icon: 'text_fields', label: 'Heading 3' },
				{ cmd: 'blockquote', icon: 'format_quote', label: 'Quote' },
				{ sep: true },
				{ cmd: 'insertUnorderedList', icon: 'format_list_bulleted', label: 'Bullet list' },
				{ cmd: 'insertOrderedList', icon: 'format_list_numbered', label: 'Numbered list' },
				{ sep: true },
				{ cmd: 'link', icon: 'link', label: 'Link' },
				{ cmd: 'code', icon: 'code', label: 'Code' },
				{ cmd: 'divider', icon: 'horizontal_rule', label: 'Divider' },
				{ sep: true },
				{ cmd: 'clear', icon: 'format_clear', label: 'Clear' },
				{ cmd: 'undo', icon: 'undo', label: 'Undo' },
				{ cmd: 'redo', icon: 'redo', label: 'Redo' }
			];

			this.classes = () =>
			{
				const list = ['box', this.background, 'size-' + this.size];

				this.variant.forEach(v => list.push(v));

				if(this.compact) list.push('compact');
				if(this.disabled) list.push('disabled');

				return list.join(' ');
			};

			/* ===== HELPERS ===== */

			this.ancestor = (tag) =>
			{
				const selection = window.getSelection();
				let node = selection?.anchorNode;

				while(node && node !== this.body)
				{
					if(node.nodeName === tag || (Array.isArray(tag) && tag.includes(node.nodeName)))
					{
						return node;
					}

					node = node.parentNode;
				}

				return null;
			};

			this.listen = (target, event, handler, options) =>
			{
				target.addEventListener(event, handler, options);
				this.listeners.push({ target, event, handler, options });
			};

			/* ===== CLEAN ===== */

			const allowed = {
				P: [], H2: [], H3: [], H4: [],
				STRONG: [], U: [], S: [],
				A: ['href'], UL: [], OL: [], LI: [],
				BLOCKQUOTE: [], CODE: [],
				TABLE: [], THEAD: [], TBODY: [], TR: [], TH: ['colspan', 'rowspan'], TD: ['colspan', 'rowspan'],
				BR: [], HR: [], IMG: ['src', 'alt']
			};

			const blocks = new Set(['P', 'H2', 'H3', 'H4', 'UL', 'OL', 'BLOCKQUOTE', 'HR', 'TABLE']);
			const normalize = { H1: 'H2', B: 'STRONG', STRIKE: 'S', DEL: 'S' };

			const walk = (source, target, inside) =>
			{
				Array.from(source.childNodes).forEach((child) =>
				{
					if(child.nodeType === 3)
					{
						if(child.textContent.trim() || inside)
						{
							target.appendChild(document.createTextNode(child.textContent));
						}

						return;
					}

					if(child.nodeType !== 1) return;

					const tag = normalize[child.tagName] || child.tagName;

					if(!(tag in allowed))
					{
						walk(child, target, inside);
						return;
					}

					if(inside && blocks.has(tag))
					{
						const root = target.closest('.walk-root') || target;
						const node = document.createElement(tag);

						allowed[tag].forEach(attr => { const v = child.getAttribute(attr); if(v) node.setAttribute(attr, v); });

						walk(child, node, false);
						root.appendChild(node);
						return;
					}

					const node = document.createElement(tag);

					allowed[tag].forEach(attr => { const v = child.getAttribute(attr); if(v) node.setAttribute(attr, v); });

					walk(child, node, tag !== 'TABLE' && tag !== 'UL' && tag !== 'OL');

					if(node.hasChildNodes() || ['BR', 'HR', 'IMG'].includes(tag))
					{
						target.appendChild(node);
					}
				});
			};

			this.clean = (html) =>
			{
				html = html.replace(/<html[^>]*>|<\/html>|<head[^>]*>[\s\S]*?<\/head>|<body[^>]*>|<\/body>|<meta[^>]*>|<style[^>]*>[\s\S]*?<\/style>/gi, '');

				const source = document.createElement('div');
				source.innerHTML = html;

				const target = document.createElement('div');
				walk(source, target, false);

				return target.innerHTML
					.replace(/\u00A0/g, ' ')
					.replace(/<(p|blockquote|li|h[2-4])>(\s|<br\s*\/?>)*<\/(p|blockquote|li|h[2-4])>/gi, '')
					.replace(/<(strong|u|s)>\s*<\/(strong|u|s)>/gi, '')
					.replace(/(<br\s*\/?>)+$/gi, '')
					.trim();
			};

			/* ===== COMMANDS ===== */

			this.exec = async (cmd) =>
			{
				if(!this.body || this.disabled) return;

				this.body.focus();

				const block = document.queryCommandValue('formatBlock');
				const toggle = { heading2: 'h2', heading3: 'h3', blockquote: 'blockquote' };

				if(toggle[cmd])
				{
					document.execCommand('formatBlock', false, block === toggle[cmd] ? 'p' : toggle[cmd]);
				}
				else if(cmd === 'code')
				{
					const code = this.ancestor('CODE');

					if(code)
					{
						const text = code.textContent;
						const range = document.createRange();
						range.selectNode(code);
						window.getSelection().removeAllRanges();
						window.getSelection().addRange(range);
						document.execCommand('insertHTML', false, text);
					}
					else
					{
						const text = window.getSelection()?.toString();

						if(text)
						{
							document.execCommand('insertHTML', false, '<code>' + text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code>');
						}
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
					if(selection?.rangeCount) this.range = selection.getRangeAt(0).cloneRange();

					const url = await $ot.confirm('Insert link', { icon: 'link', input: true, placeholder: 'https://', confirm: 'Insert' });

					if(url)
					{
						this.body.focus();

						if(this.range) { selection.removeAllRanges(); selection.addRange(this.range); }

						const text = selection?.toString();

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
				else
				{
					document.execCommand(cmd, false, null);
				}

				this.sync();
				this.emit();
			};

			/* ===== SYNC ===== */

			this.sync = () =>
			{
				if(this.syncFrame) return;

				this.syncFrame = requestAnimationFrame(() =>
				{
					this.syncFrame = null;

					if(!this.Element || !this.body) return;

					const block = document.queryCommandValue('formatBlock');

					const state = {
						bold: document.queryCommandState('bold'),
						underline: document.queryCommandState('underline'),
						strikeThrough: document.queryCommandState('strikeThrough'),
						insertUnorderedList: document.queryCommandState('insertUnorderedList'),
						insertOrderedList: document.queryCommandState('insertOrderedList'),
						heading2: block === 'h2',
						heading3: block === 'h3',
						blockquote: block === 'blockquote'
					};

					this.Element.querySelectorAll('[data-cmd]').forEach((btn) =>
					{
						const cmd = btn.getAttribute('data-cmd');
						btn.classList.toggle('active', !!(cmd && state[cmd]));
					});
				});
			};

			/* ===== EMIT ===== */

			this.emit = () =>
			{
				if(!this.body) return;

				const value = this.clean(this.body.innerHTML);
				const hidden = this.Element?.querySelector('input.hidden');

				if(hidden) hidden.value = value;
				if(this._change) this._change({ value });
			};

			/* ===== ENSURE ===== */

			this.ensure = () =>
			{
				if(!this.body) return;

				if(!this.body.innerHTML || this.body.innerHTML === '<br>')
				{
					this.body.innerHTML = '<p><br></p>';
					const range = document.createRange();
					range.setStart(this.body.firstChild, 0);
					range.collapse(true);
					window.getSelection().removeAllRanges();
					window.getSelection().addRange(range);
				}

				for(let i = this.body.childNodes.length - 1; i >= 0; i--)
				{
					const child = this.body.childNodes[i];

					if(child.nodeType === 3 && child.textContent.trim())
					{
						const p = document.createElement('p');
						child.replaceWith(p);
						p.appendChild(child);
					}
				}
			};

			/* ===== LIFECYCLE ===== */

			this.OnReady(() =>
			{
				this.body = this.Element.querySelector('.body');

				if(!this.body) return;

				document.execCommand('defaultParagraphSeparator', false, 'p');
				this.body.innerHTML = this.value || '<p><br></p>';

				this.listen(this.body, 'input', () => { this.ensure(); this.sync(); this.emit(); });

				this.listen(this.body, 'paste', (event) =>
				{
					event.preventDefault();
					const html = event.clipboardData.getData('text/html');
					const text = event.clipboardData.getData('text/plain');

					if(html)
					{
						document.execCommand('insertHTML', false, this.clean(html));
					}
					else if(text)
					{
						const safe = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
						document.execCommand('insertHTML', false, safe.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>'));
					}
				});

				this.listen(this.body, 'keydown', (event) =>
				{
					if(event.isComposing) return;

					const meta = event.metaKey || event.ctrlKey;

					if(meta && event.key === 'b') { event.preventDefault(); this.exec('bold'); return; }
					if(meta && event.key === 'u') { event.preventDefault(); this.exec('underline'); return; }
					if(meta && event.key === 'k') { event.preventDefault(); this.exec('link'); return; }

					if(event.key === 'Enter' && !event.shiftKey && document.queryCommandValue('formatBlock') === 'blockquote')
					{
						const text = window.getSelection()?.anchorNode?.textContent || '';

						if(!text.trim())
						{
							event.preventDefault();
							document.execCommand('formatBlock', false, 'p');
						}
					}
				});

				this.listen(document, 'selectionchange', () =>
				{
					if(!this.body) return;

					const selection = window.getSelection();

					if(selection?.anchorNode && this.body.contains(selection.anchorNode))
					{
						this.sync();
					}
				});
			});

			this.OnDestroy(() =>
			{
				this.listeners.forEach(entry => entry.target.removeEventListener(entry.event, entry.handler, entry.options));
				this.listeners = [];

				if(this.syncFrame) { cancelAnimationFrame(this.syncFrame); this.syncFrame = null; }
			});

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<input ot-if="name" class="hidden" type="hidden" :name="name" :value="value" />
					<div class="bar">
						<div ot-for="tool in tools">
							<div ot-if="tool.sep" class="sep"></div>
							<button ot-if="!tool.sep" type="button" class="btn" :data-cmd="tool.cmd" :ot-tooltip="{ text: tool.label, position: { x: 'center', y: 'top' } }" ot-mousedown.prevent="" ot-click.stop="() => exec(tool.cmd)">
								<i>{{ tool.icon }}</i>
							</button>
						</div>
					</div>
					<div class="area">
						<div class="body" contenteditable="true" ot-skip :data-placeholder="placeholder"></div>
					</div>
				</div>
			`;
		}
	});
});
