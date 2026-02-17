import elements from '#elements/load.js';

const parseMarkdown = function(md)
{
	if (!md) return '';

	let html = md;

	// Escape HTML
	html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

	// Code blocks (``` ```)
	html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) =>
	{
		return `<pre class="code-block" data-lang="${lang}"><code>${code.trim()}</code></pre>`;
	});

	// Inline code (`)
	html = html.replace(/`([^`]+)`/g, '<code class="code-inline">$1</code>');

	// Headings
	html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
	html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
	html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
	html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
	html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
	html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

	// Blockquotes
	html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');

	// Horizontal rule
	html = html.replace(/^---$/gm, '<hr>');
	html = html.replace(/^\*\*\*$/gm, '<hr>');

	// Bold
	html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

	// Italic
	html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
	html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

	// Links
	html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

	// Images
	html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

	// Unordered lists
	html = html.replace(/^[\*\-]\s+(.+)$/gm, '<li>$1</li>');
	html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

	// Ordered lists
	html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');

	// Tables
	html = html.replace(/^\|(.+)\|$/gm, (match, content) =>
	{
		const cells = content.split('|').map(cell => cell.trim());
		if (cells.every(cell => /^[\-:]+$/.test(cell)))
		{
			return '<!-- table separator -->';
		}
		const cellTags = cells.map(cell => `<td>${cell}</td>`).join('');
		return `<tr>${cellTags}</tr>`;
	});
	html = html.replace(/(<tr>.*<\/tr>\n?)+/g, '<table>$&</table>');
	html = html.replace(/<!-- table separator -->\n?/g, '');

	// Paragraphs - wrap remaining text blocks
	html = html.split('\n\n').map(block =>
	{
		block = block.trim();
		if (!block) return '';
		if (block.startsWith('<h') ||
			block.startsWith('<ul') ||
			block.startsWith('<ol') ||
			block.startsWith('<blockquote') ||
			block.startsWith('<pre') ||
			block.startsWith('<table') ||
			block.startsWith('<hr'))
		{
			return block;
		}
		return `<p>${block.replace(/\n/g, '<br>')}</p>`;
	}).join('\n');

	return html;
};

elements.ItemAdd({
	id: 'markdown',
	icon: 'article',
	name: 'Markdown',
	description: 'Renders markdown content as styled HTML. Supports headings, paragraphs, lists, code blocks, blockquotes, tables, and links.',
	category: 'Content',
	author: 'Divhunt',
	config: {
		content: {
			type: 'string',
			value: ''
		},
		variant: {
			type: 'array',
			value: ['size-m'],
			options: ['size-s', 'size-m', 'size-l', 'prose']
		}
	},
	render: function()
	{
		this.parsedContent = parseMarkdown(this.content);

		return `
			<div class="holder" :variant="variant.join(' ')">
				<div dh-html="parsedContent"></div>
			</div>
		`;
	},
});
