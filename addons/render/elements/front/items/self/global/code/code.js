onetype.AddonReady('elements', (elements) =>
{
	/* ===== SYNTAX GRAMMARS ===== */

	const LANG_JS = {
		keywords: /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|super|this|typeof|instanceof|in|of|try|catch|finally|throw|async|await|import|from|export|default|null|undefined|true|false|void|delete|yield|static)\b/g,
		comment: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g,
		string: /(`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*'|&quot;(?:(?!&quot;)[^\\]|\\.)*&quot;)/g,
		number: /\b(\d+(\.\d+)?)\b/g,
		fn: /\b([a-zA-Z_$][\w$]*)\s*(?=\()/g
	};

	const LANG_CSS = {
		comment: /(\/\*[\s\S]*?\*\/)/g,
		string: /(&quot;(?:(?!&quot;)[^\\]|\\.)*&quot;|'(?:[^'\\]|\\.)*')/g,
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
		string: /(&quot;(?:(?!&quot;)[^\\]|\\.)*&quot;)/g,
		number: /(-?\d+(\.\d+)?([eE][+-]?\d+)?)/g,
		keyword: /\b(true|false|null)\b/g
	};

	const LANG_PYTHON = {
		keywords: /\b(def|class|return|if|elif|else|for|while|import|from|as|pass|break|continue|try|except|finally|raise|with|lambda|yield|global|nonlocal|in|is|not|and|or|None|True|False|self)\b/g,
		comment: /(#[^\n]*)/g,
		string: /(&quot;&quot;&quot;[\s\S]*?&quot;&quot;&quot;|'''[\s\S]*?'''|&quot;(?:(?!&quot;)[^\\]|\\.)*&quot;|'(?:[^'\\]|\\.)*')/g,
		number: /\b(\d+(\.\d+)?)\b/g,
		fn: /\b([a-zA-Z_][\w]*)\s*(?=\()/g
	};

	const LANG_BASH = {
		comment: /(#[^\n]*)/g,
		string: /(&quot;(?:(?!&quot;)[^\\]|\\.)*&quot;|'(?:[^'\\]|\\.)*')/g,
		variable: /(\$\w+|\$\{[^}]+\})/g,
		flag: /(\s)(-{1,2}[\w-]+)/g,
		command: /^(\s*)([a-zA-Z_][\w-]*)/gm
	};

	/* ===== HELPERS ===== */

	const escape = (text) =>
	{
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	};

	const toKey = (n) =>
	{
		const map = 'abcdefghij';
		return String(n).split('').map((d) => map[parseInt(d)]).join('');
	};

	const fromKey = (key) =>
	{
		const map = 'abcdefghij';
		return parseInt(key.split('').map((c) => map.indexOf(c)).join(''));
	};

	const stash = (placeholders, html) =>
	{
		const index = placeholders.length;
		placeholders.push(html);
		return '\u0001' + toKey(index) + '\u0002';
	};

	const unstash = (code, placeholders) =>
	{
		return code.replace(/\u0001([a-j]+)\u0002/g, (m, key) => placeholders[fromKey(key)]);
	};

	/* ===== TOKENIZERS ===== */

	const tokenizeJs = (code) =>
	{
		const ph = [];

		code = code.replace(LANG_JS.comment, (m) => stash(ph, '<span class="t-comment">' + m + '</span>'));
		code = code.replace(LANG_JS.string, (m) => stash(ph, '<span class="t-string">' + m + '</span>'));
		code = code.replace(LANG_JS.keywords, '<span class="t-keyword">$1</span>');
		code = code.replace(LANG_JS.number, '<span class="t-number">$1</span>');
		code = code.replace(LANG_JS.fn, '<span class="t-fn">$1</span>');

		return unstash(code, ph);
	};

	const tokenizeCss = (code) =>
	{
		const ph = [];

		code = code.replace(LANG_CSS.comment, (m) => stash(ph, '<span class="t-comment">' + m + '</span>'));
		code = code.replace(LANG_CSS.string, (m) => stash(ph, '<span class="t-string">' + m + '</span>'));
		code = code.replace(LANG_CSS.selector, '<span class="t-selector">$1</span>');
		code = code.replace(LANG_CSS.prop, '<span class="t-prop">$1</span>');
		code = code.replace(LANG_CSS.number, '<span class="t-number">$1</span>');

		return unstash(code, ph);
	};

	const tokenizeHtml = (code) =>
	{
		const ph = [];

		code = code.replace(LANG_HTML.comment, (m) => stash(ph, '<span class="t-comment">' + m + '</span>'));
		code = code.replace(LANG_HTML.string, '$1<span class="t-string">$2</span>');
		code = code.replace(LANG_HTML.attr, ' <span class="t-attr">$1</span>');
		code = code.replace(LANG_HTML.tag, '$1<span class="t-tag">$2</span>');

		return unstash(code, ph);
	};

	const tokenizeJson = (code) =>
	{
		const ph = [];

		code = code.replace(LANG_JSON.string, (m) => stash(ph, '<span class="t-string">' + m + '</span>'));
		code = code.replace(LANG_JSON.keyword, '<span class="t-keyword">$1</span>');
		code = code.replace(LANG_JSON.number, '<span class="t-number">$1</span>');

		return unstash(code, ph);
	};

	const tokenizePython = (code) =>
	{
		const ph = [];

		code = code.replace(LANG_PYTHON.comment, (m) => stash(ph, '<span class="t-comment">' + m + '</span>'));
		code = code.replace(LANG_PYTHON.string, (m) => stash(ph, '<span class="t-string">' + m + '</span>'));
		code = code.replace(LANG_PYTHON.keywords, '<span class="t-keyword">$1</span>');
		code = code.replace(LANG_PYTHON.number, '<span class="t-number">$1</span>');
		code = code.replace(LANG_PYTHON.fn, '<span class="t-fn">$1</span>');

		return unstash(code, ph);
	};

	const tokenizeBash = (code) =>
	{
		const ph = [];

		code = code.replace(LANG_BASH.comment, (m) => stash(ph, '<span class="t-comment">' + m + '</span>'));
		code = code.replace(LANG_BASH.string, (m) => stash(ph, '<span class="t-string">' + m + '</span>'));
		code = code.replace(LANG_BASH.variable, '<span class="t-number">$1</span>');
		code = code.replace(LANG_BASH.flag, '$1<span class="t-attr">$2</span>');
		code = code.replace(LANG_BASH.command, '$1<span class="t-keyword">$2</span>');

		return unstash(code, ph);
	};

	const tokenize = (code, language) =>
	{
		const escaped = escape(code);

		const map = {
			js: tokenizeJs, javascript: tokenizeJs,
			css: tokenizeCss,
			html: tokenizeHtml,
			json: tokenizeJson,
			python: tokenizePython, py: tokenizePython,
			bash: tokenizeBash, sh: tokenizeBash, shell: tokenizeBash
		};

		const fn = map[language];

		return fn ? fn(escaped) : escaped;
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

	/* ===== ELEMENT ===== */

	elements.ItemAdd({
		id: 'global-code',
		icon: 'code',
		name: 'Code',
		description: 'Code block with syntax highlighting, copy button, line numbers and line highlight.',
		category: 'Global',
		config:
		{
			source:
			{
				type: 'string',
				value: '',
				description: 'Raw code string.'
			},
			language:
			{
				type: 'string',
				value: 'js',
				options: ['js', 'javascript', 'css', 'html', 'json', 'python', 'py', 'bash', 'sh', 'shell', 'text'],
				description: 'Syntax language.'
			},
			filename:
			{
				type: 'string',
				value: '',
				description: 'Filename in header. Replaces language label.'
			},
			lines:
			{
				type: 'boolean',
				value: false,
				description: 'Show line numbers.'
			},
			highlight:
			{
				type: 'string',
				value: '',
				description: 'Lines to highlight. Range string: 2,4-6.'
			},
			copy:
			{
				type: 'boolean',
				value: true,
				description: 'Show copy button.'
			},
			color:
			{
				type: 'string',
				value: '',
				description: 'Custom background color override.'
			},
			background:
			{
				type: 'string',
				value: '',
				options: ['', 'bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Frame outline depth.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Padding and font size.'
			},
			variant:
			{
				type: 'array',
				value: ['border'],
				each: { type: 'string' },
				options: ['border'],
				description: 'Visual modifiers.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.copied = false;

			this.Compute(() =>
			{
				const raw = (this.source || '').replace(/^\n+|\n+$/g, '');
				const highlighted = tokenize(raw, this.language);
				const lines = parseHighlight(this.highlight);

				this.hasHead = !!this.filename || !!this.language || this.copy;

				if(this.lines)
				{
					this.output = '<div class="numbered">' + highlighted.split('\n').map((line, index) =>
					{
						const number = index + 1;
						const cls = 'line' + (lines.includes(number) ? ' highlighted' : '');

						return '<div class="' + cls + '"><span class="number">' + number + '</span><span class="code">' + (line || ' ') + '</span></div>';
					}).join('') + '</div>';
				}
				else
				{
					this.output = '<span class="plain">' + highlighted + '</span>';
				}
			});

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', 'size-' + this.size];

				if(this.background)
				{
					list.push(this.background);
				}

				this.variant.forEach(v => list.push(v));

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

			this.copyCode = () =>
			{
				const text = (this.source || '').replace(/^\n+|\n+$/g, '');

				if(navigator.clipboard && text)
				{
					navigator.clipboard.writeText(text);
				}

				this.copied = true;

				setTimeout(() =>
				{
					this.copied = false;
				}, 1800);
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()" :style="color ? 'background:' + color : ''">
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
					<pre class="body"><code ot-html="output"></code></pre>
				</div>
			`;
		}
	});
});
