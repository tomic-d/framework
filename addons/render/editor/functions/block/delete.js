onetype.AddonReady('editor', (editor) =>
{
	editor.Fn('block.delete', function(instance, uid)
	{
		const found = editor.Fn('block.find', instance, uid);

		if(!found)
		{
			return;
		}

		const type = editor.ItemGet(found.block.type);
		const node = instance.Element.querySelector('[data-uid="' + uid + '"]');

		if(type && type.Get('remove'))
		{
			type.Get('remove').call(null, node);
		}

		found.list.splice(found.index, 1);

		if(node)
		{
			node.remove();
		}

		if(!instance.blocks.length)
		{
			editor.Fn('block.add', instance, 'paragraph', null, {});
		}
	});
});
