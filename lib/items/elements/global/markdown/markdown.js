onetype.AddonReady('elements', (elements) =>
{
	const parse = function(content)
	{
		if(!content)
		{
			return '';
		}

		let html = '';
		let buffer = [];
		let block = false;

		const line = (h) =>
		{
			html += `<div class="line">${h}</div>`;
		};

		const spacer = () =>
		{
		};

		const transform = (text) =>
		{
			text = code(text);
			text = inline(text);
			text = media(text);
			text = heading(text);
			text = rule(text);
			text = quote(text);
			text = format(text);
			text = list(text);
			text = table(text);
			text = paragraph(text);

			return text;
		};

		const code = (text) =>
		{
			text = text.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, c) =>
			{
				c = c.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();

				return `<pre class="codeblock"><code${lang ? ` data-lang="${lang}"` : ''}>${c}</code></pre>`;
			});

			text = text.replace(/`([^`]+)`/g, '<code class="inline">$1</code>');

			return text;
		};

		const inline = (text) =>
		{
			return text;
		};

		const media = (text) =>
		{
			text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
			text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

			return text;
		};

		const heading = (text) =>
		{
			text = text.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
			text = text.replace(/^### (.+)$/gm, '<h3>$1</h3>');
			text = text.replace(/^## (.+)$/gm, '<h2>$1</h2>');
			text = text.replace(/^# (.+)$/gm, '<h1>$1</h1>');

			return text;
		};

		const rule = (text) =>
		{
			return text.replace(/^---$/gm, '<hr />');
		};

		const quote = (text) =>
		{
			text = text.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
			text = text.replace(/<\/blockquote>\n<blockquote>/g, '\n');

			return text;
		};

		const format = (text) =>
		{
			text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
			text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
			text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
			text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');

			return text;
		};

		const list = (text) =>
		{
			text = text.replace(/^[\t ]*[-*] (.+)$/gm, '<uli>$1</uli>');
			text = text.replace(/((?:<uli>.*<\/uli>\n?)+)/g, (match) =>
			{
				return `<ul>${match.replace(/<\/?uli>/g, (t) => t.replace('uli', 'li'))}</ul>`;
			});

			text = text.replace(/^[\t ]*\d+\. (.+)$/gm, '<oli>$1</oli>');
			text = text.replace(/((?:<oli>.*<\/oli>\n?)+)/g, (match) =>
			{
				return `<ol>${match.replace(/<\/?oli>/g, (t) => t.replace('oli', 'li'))}</ol>`;
			});

			return text;
		};

		const table = (text) =>
		{
			return text.replace(/^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)+)/gm, (_, header, _align, body) =>
			{
				const heads = header.split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
				const rows = body.trim().split('\n').map(row =>
				{
					const cells = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
					return `<tr>${cells}</tr>`;
				}).join('');

				return `<table><thead><tr>${heads}</tr></thead><tbody>${rows}</tbody></table>`;
			});
		};

		const paragraph = (text) =>
		{
			text = text.replace(/(<\/(table|ul|ol|blockquote|pre|h[1-4])>)(.)/g, '$1\n$3');
			text = text.replace(/(.)(<(table|ul|ol|blockquote|pre|h[1-4]|hr|img)[\s>])/g, '$1\n$2');

			const blk = /^<(h[1-4]|ul|ol|pre|blockquote|hr|table|img|li|\/)/;

			return text.split('\n').map(l =>
			{
				const trimmed = l.trim();

				if(!trimmed || blk.test(trimmed))
				{
					return trimmed;
				}

				return `<p>${trimmed}</p>`;
			}).filter(l => l).join('\n');
		};

		const flush = () =>
		{
			if(!buffer.length)
			{
				return;
			}

			line(transform(buffer.join('\n')));
			buffer = [];
		};

		const lines = content.split('\n');

		for(let i = 0; i < lines.length; i++)
		{
			const trimmed = lines[i].trim();

			if(trimmed.startsWith('```'))
			{
				buffer.push(lines[i]);
				block = !block;

				if(!block)
				{
					flush();
				}

				continue;
			}

			if(block)
			{
				buffer.push(lines[i]);
				continue;
			}

			if(trimmed.startsWith('|') || /^[\t ]*[-*] .+/.test(trimmed) || /^[\t ]*\d+\. .+/.test(trimmed) || trimmed.startsWith('> '))
			{
				buffer.push(lines[i]);
				continue;
			}

			flush();

			if(!trimmed)
			{
				spacer();
				continue;
			}

			line(transform(trimmed));
		}

		flush();

		return html;
	};

	elements.ItemAdd({
		id: 'global-markdown',
		icon: 'article',
		name: 'Markdown',
		description: 'Renders markdown content as styled HTML.',
		category: 'Global',
		author: 'OneType',
		config: {
			content: {
				type: 'string',
				value: ''
			}
		},
		render: function()
		{
			return `<div class="holder">${parse(this.content)}</div>`;
		}
	});
});
