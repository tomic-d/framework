import assets from '../../addon.js';

assets.Fn('utils.transform', function(contents, type = 'js')
{
	if (!Array.isArray(contents))
	{
		return '';
	}

	if (type === 'js')
	{
		contents = contents.map(content =>
		{
			content = content.replace(/^import\s+.*?;?\s*$/gm, '');
			content = content.replace(/^export\s+.*?;?\s*$/gm, '');
			content = content.replace(/^\s*[\r\n]/gm, '');

			return content;
		});

		return '(function(){\n' + contents.filter(content => content?.trim()).join('\n\n') + '\n})();';
	}

	if (type === 'css')
	{
		contents = contents.map(content => content ? content.trim() : '');
	}

	return contents.filter(content => content?.trim()).join('\n');
});
