onetype.AddonReady('elements', (elements) =>
{
	const LANG_JS = {
		keywords: /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|super|this|typeof|instanceof|in|of|try|catch|finally|throw|async|await|import|from|export|default|null|undefined|true|false|void|delete|yield|static)\b/g,
		comment: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g,
		string: /(`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g,
		number: /\b(\d+(\.\d+)?)\b/g,
		fn: /\b([a-zA-Z_$][\w$]*)\s*(?=\()/g
	};

	const LANG_CSS = {
		comment: /(\/\*[\s\S]*?\*\/)/g,
		string: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
		selector: /([.#]?[a-zA-Z_-][\w-]*(?:\s*[>+~]\s*[.#]?[a-zA-Z_-][\w-]*)*)(?=\s*\{)/g,
		prop: /([a-zA-Z-]+)(?=\s*:)/g,
		number: /\b(\d+(\.\d+)?(px|em|rem|vh|vw|%|s|ms)?)\b/g
	};

	const LANG_HTML = {
		comment: /(&lt;!--[\s\S]*?--&gt;)/g,
		tag: /(&lt;\/?)([a-zA-Z][\w-]*)/g,
		attr: /\s([a-zA-Z-:]+)(?==)/g,
		string: /(=)(&quot;[^&]*&quot;|'[^']*')/g
	};

	const LANG_JSON = {
		string: /("(?:[^"\\]|\\.)*")/g,
		number: /(-?\d+(\.\d+)?([eE][+-]?\d+)?)/g,
		keyword: /\b(true|false|null)\b/g
	};

	const LANG_PYTHON = {
		keywords: /\b(def|class|return|if|elif|else|for|while|import|from|as|pass|break|continue|try|except|finally|raise|with|lambda|yield|global|nonlocal|in|is|not|and|or|None|True|False|self)\b/g,
		comment: /(#[^\n]*)/g,
		string: /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
		number: /\b(\d+(\.\d+)?)\b/g,
		fn: /\b([a-zA-Z_][\w]*)\s*(?=\()/g
	};

	const LANG_BASH = {
		comment: /(#[^\n]*)/g,
		string: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
		variable: /(\$\w+|\$\{[^}]+\})/g,
		flag: /(\s)(-{1,2}[\w-]+)/g,
		command: /^(\s*)([a-zA-Z_][\w-]*)/gm
	};

	const escapeHtml = (text) =>
	{
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	};

	const tokenize = (code, language) =>
	{
		const escaped = escapeHtml(code);

		if(language === 'js' || language === 'javascript')
		{
			return tokenizeJs(escaped);
		}

		if(language === 'css')
		{
			return tokenizeCss(escaped);
		}

		if(language === 'html')
		{
			return tokenizeHtml(escaped);
		}

		if(language === 'json')
		{
			return tokenizeJson(escaped);
		}

		if(language === 'python' || language === 'py')
		{
			return tokenizePython(escaped);
		}

		if(language === 'bash' || language === 'sh' || language === 'shell')
		{
			return tokenizeBash(escaped);
		}

		return escaped;
	};

	const tokenizeJs = (code) =>
	{
		const placeholders = [];

		const stash = (match) =>
		{
			const index = placeholders.length;
			placeholders.push(match);
			return '\u0000ph' + index + 'hp\u0000';
		};

		code = code.replace(LANG_JS.comment, (match) => stash('<span class="t-comment">' + match + '</span>'));
		code = code.replace(LANG_JS.string, (match) => stash('<span class="t-string">' + match + '</span>'));
		code = code.replace(LANG_JS.keywords, '<span class="t-keyword">$1</span>');
		code = code.replace(LANG_JS.number, '<span class="t-number">$1</span>');
		code = code.replace(LANG_JS.fn, '<span class="t-fn">$1</span>');

		code = code.replace(/\u0000ph(\d+)hp\u0000/g, (m, i) => placeholders[parseInt(i)]);

		return code;
	};

	const tokenizeCss = (code) =>
	{
		const placeholders = [];

		const stash = (match) =>
		{
			const index = placeholders.length;
			placeholders.push(match);
			return '\u0000ph' + index + 'hp\u0000';
		};

		code = code.replace(LANG_CSS.comment, (match) => stash('<span class="t-comment">' + match + '</span>'));
		code = code.replace(LANG_CSS.string, (match) => stash('<span class="t-string">' + match + '</span>'));
		code = code.replace(LANG_CSS.selector, '<span class="t-selector">$1</span>');
		code = code.replace(LANG_CSS.prop, '<span class="t-prop">$1</span>');
		code = code.replace(LANG_CSS.number, '<span class="t-number">$1</span>');

		code = code.replace(/\u0000ph(\d+)hp\u0000/g, (m, i) => placeholders[parseInt(i)]);

		return code;
	};

	const tokenizeHtml = (code) =>
	{
		const placeholders = [];

		const stash = (match) =>
		{
			const index = placeholders.length;
			placeholders.push(match);
			return '\u0000ph' + index + 'hp\u0000';
		};

		code = code.replace(LANG_HTML.comment, (match) => stash('<span class="t-comment">' + match + '</span>'));
		code = code.replace(LANG_HTML.string, '$1<span class="t-string">$2</span>');
		code = code.replace(LANG_HTML.attr, ' <span class="t-attr">$1</span>');
		code = code.replace(LANG_HTML.tag, '$1<span class="t-tag">$2</span>');

		code = code.replace(/\u0000ph(\d+)hp\u0000/g, (m, i) => placeholders[parseInt(i)]);

		return code;
	};

	const tokenizeJson = (code) =>
	{
		const placeholders = [];

		const stash = (match) =>
		{
			const index = placeholders.length;
			placeholders.push(match);
			return '\u0000ph' + index + 'hp\u0000';
		};

		code = code.replace(LANG_JSON.string, (match) => stash('<span class="t-string">' + match + '</span>'));
		code = code.replace(LANG_JSON.keyword, '<span class="t-keyword">$1</span>');
		code = code.replace(LANG_JSON.number, '<span class="t-number">$1</span>');

		code = code.replace(/\u0000ph(\d+)hp\u0000/g, (m, i) => placeholders[parseInt(i)]);

		return code;
	};

	const tokenizePython = (code) =>
	{
		const placeholders = [];

		const stash = (match) =>
		{
			const index = placeholders.length;
			placeholders.push(match);
			return '\u0000ph' + index + 'hp\u0000';
		};

		code = code.replace(LANG_PYTHON.comment, (match) => stash('<span class="t-comment">' + match + '</span>'));
		code = code.replace(LANG_PYTHON.string, (match) => stash('<span class="t-string">' + match + '</span>'));
		code = code.replace(LANG_PYTHON.keywords, '<span class="t-keyword">$1</span>');
		code = code.replace(LANG_PYTHON.number, '<span class="t-number">$1</span>');
		code = code.replace(LANG_PYTHON.fn, '<span class="t-fn">$1</span>');

		code = code.replace(/\u0000ph(\d+)hp\u0000/g, (m, i) => placeholders[parseInt(i)]);

		return code;
	};

	const tokenizeBash = (code) =>
	{
		const placeholders = [];

		const stash = (match) =>
		{
			const index = placeholders.length;
			placeholders.push(match);
			return '\u0000ph' + index + 'hp\u0000';
		};

		code = code.replace(LANG_BASH.comment, (match) => stash('<span class="t-comment">' + match + '</span>'));
		code = code.replace(LANG_BASH.string, (match) => stash('<span class="t-string">' + match + '</span>'));
		code = code.replace(LANG_BASH.variable, '<span class="t-number">$1</span>');
		code = code.replace(LANG_BASH.flag, '$1<span class="t-attr">$2</span>');
		code = code.replace(LANG_BASH.command, '$1<span class="t-keyword">$2</span>');

		code = code.replace(/\u0000ph(\d+)hp\u0000/g, (m, i) => placeholders[parseInt(i)]);

		return code;
	};

	const parseHighlight = (value) =>
	{
		if(!value)
		{
			return [];
		}

		const result = [];

		value.split(',').forEach(part =>
		{
			const range = part.trim().split('-');

			if(range.length === 2)
			{
				const start = parseInt(range[0]);
				const end = parseInt(range[1]);

				for(let i = start; i <= end; i++)
				{
					result.push(i);
				}
			}
			else
			{
				result.push(parseInt(range[0]));
			}
		});

		return result;
	};

	elements.ItemAdd({
		id: 'global-code',
		icon: 'code',
		name: 'Code',
		description: 'Code block with syntax highlighting for html, css, js. Copy button, line numbers and line highlight.',
		category: 'Global',
		author: 'OneType',
		config: {
			source: {
				type: 'string'
			},
			color: {
				type: 'string'
			},
			language: {
				type: 'string',
				value: 'js',
				options: ['js', 'javascript', 'css', 'html', 'json', 'python', 'py', 'bash', 'sh', 'shell']
			},
			filename: {
				type: 'string'
			},
			lines: {
				type: 'boolean',
				value: false
			},
			highlight: {
				type: 'string'
			},
			copy: {
				type: 'boolean',
				value: true
			},
			variant: {
				type: 'array',
				value: ['bg-2', 'border'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'size-s', 'size-m', 'size-l']
			}
		},
		render: function()
		{
			this.copied = false;

			const raw = (this.source || '').replace(/^\n+|\n+$/g, '');
			const highlighted = tokenize(raw, this.language);
			const highlightLines = parseHighlight(this.highlight);

			if(this.lines)
			{
				const linesArray = highlighted.split('\n');

				this.linesHtml = linesArray.map((line, index) =>
				{
					const number = index + 1;
					const isHighlighted = highlightLines.includes(number);
					const classes = 'line' + (isHighlighted ? ' highlighted' : '');

					return '<div class="' + classes + '"><span class="number">' + number + '</span><span class="content">' + (line || ' ') + '</span></div>';
				}).join('');

				this.output = '<div class="numbered">' + this.linesHtml + '</div>';
			}
			else
			{
				this.output = '<span class="plain">' + highlighted + '</span>';
			}

			this.copyCode = () =>
			{
				if(navigator.clipboard && raw)
				{
					navigator.clipboard.writeText(raw);
				}

				this.copied = true;

				setTimeout(() =>
				{
					this.copied = false;
				}, 1800);
			};

			this.hasHead = !!this.filename || !!this.language || this.copy;

			this.frameStyle = this.color ? 'background: ' + this.color : '';

			return /* html */ `
				<div :class="'holder ' + variant.join(' ')" :style="frameStyle">
					<div ot-if="hasHead" class="head">
						<div class="dots"><span></span><span></span><span></span></div>
						<div ot-if="filename" class="filename">{{ filename }}</div>
						<div ot-if="!filename && language" class="language">{{ language }}</div>
						<button ot-if="copy" :class="'copy' + (copied ? ' copied' : '')" type="button" ot-click="copyCode">
							<i ot-if="!copied">content_copy</i>
							<i ot-if="copied">check</i>
							<span>{{ copied ? 'Copied' : 'Copy' }}</span>
						</button>
					</div>
					<pre class="content"><code ot-html="output"></code></pre>
				</div>
			`;
		}
	});
});
