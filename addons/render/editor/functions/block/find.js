onetype.AddonReady('editor', (editor) =>
{
	editor.Fn('block.find', function(instance, uid, source)
	{
		source = source || instance.blocks;

		for(let i = 0; i < source.length; i++)
		{
			if(source[i].uid === uid)
			{
				return { block: source[i], list: source, index: i };
			}

			if(source[i].children)
			{
				for(let z = 0; z < source[i].children.length; z++)
				{
					const found = editor.Fn('block.find', instance, uid, source[i].children[z]);

					if(found)
					{
						return found;
					}
				}
			}
		}

		return null;
	});
});
