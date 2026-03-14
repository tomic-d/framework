const OneTypeMarkdown =
{
	Markdown(content)
	{
		if (!content)
		{
			return '';
		}

		let html = '';
		let buffer = [];
		let block = false;

		const lines = content.split('\n');

		for (let i = 0; i < lines.length; i++)
		{
			const trimmed = lines[i].trim();

			if (trimmed.startsWith('```'))
			{
				buffer.push(lines[i]);
				block = !block;

				if (!block)
				{
					flush();
				}

				continue;
			}

			if (block)
			{
				buffer.push(lines[i]);
				continue;
			}

			if (trimmed.startsWith('|') || /^[\t ]*[-*] .+/.test(trimmed) || /^[\t ]*\d+\. .+/.test(trimmed) || trimmed.startsWith('> '))
			{
				buffer.push(lines[i]);
				continue;
			}

			flush();

			if (!trimmed)
			{
				continue;
			}

			html += `<div class="line">${transform(trimmed)}</div>`;
		}

		flush();

		return html;

		function flush()
		{
			if (!buffer.length)
			{
				return;
			}

			html += `<div class="line">${transform(buffer.join('\n'))}</div>`;
			buffer = [];
		}

		function transform(text)
		{
			text = code(text);
			text = media(text);
			text = heading(text);
			text = rule(text);
			text = quote(text);
			text = format(text);
			text = list(text);
			text = table(text);
			text = paragraph(text);

			return text;
		}

		function code(text)
		{
			text = text.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, content) =>
			{
				content = content.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
				return `<pre class="codeblock"><code${lang ? ` data-lang="${lang}"` : ''}>${content}</code></pre>`;
			});

			return text.replace(/`([^`]+)`/g, '<code class="inline">$1</code>');
		}

		function media(text)
		{
			text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
			return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
		}

		function heading(text)
		{
			text = text.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
			text = text.replace(/^### (.+)$/gm, '<h3>$1</h3>');
			text = text.replace(/^## (.+)$/gm, '<h2>$1</h2>');
			return text.replace(/^# (.+)$/gm, '<h1>$1</h1>');
		}

		function rule(text)
		{
			return text.replace(/^---$/gm, '<hr />');
		}

		function quote(text)
		{
			text = text.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
			return text.replace(/<\/blockquote>\n<blockquote>/g, '\n');
		}

		function format(text)
		{
			text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
			text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
			text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
			return text.replace(/~~(.+?)~~/g, '<del>$1</del>');
		}

		function list(text)
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
		}

		function table(text)
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
		}

		function paragraph(text)
		{
			text = text.replace(/(<\/(table|ul|ol|blockquote|pre|h[1-4])>)(.)/g, '$1\n$3');
			text = text.replace(/(.)(<(table|ul|ol|blockquote|pre|h[1-4]|hr|img)[\s>])/g, '$1\n$2');

			const pattern = /^<(h[1-4]|ul|ol|pre|blockquote|hr|table|img|li|\/)/;

			return text.split('\n').map(line =>
			{
				const trimmed = line.trim();

				if (!trimmed || pattern.test(trimmed))
				{
					return trimmed;
				}

				return `<p>${trimmed}</p>`;
			}).filter(line => line).join('\n');
		}
	}
};

export default OneTypeMarkdown;
