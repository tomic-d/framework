onetype.AddonReady('editor', (editor) =>
{
	editor.Fn('render.blocks', function(instance)
	{
		const container = instance.Element.querySelector('.ot-editor-blocks');

		if(!container)
		{
			return;
		}

		container.innerHTML = '';

		instance.blocks.forEach(block =>
		{
			const node = editor.Fn('render.block', instance, block);

			if(node)
			{
				container.appendChild(node);
			}
		});

		const placeholder = instance.Element.querySelector('.ot-editor-placeholder');

		if(placeholder)
		{
			placeholder.style.display = instance.blocks.length ? 'none' : '';
		}
	});
});
