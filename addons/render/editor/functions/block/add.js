onetype.AddonReady('editor', (editor) =>
{
	editor.Fn('block.add', function(instance, type, afterUid, data)
	{
		const block = {
			uid: onetype.GenerateUID(),
			type: type,
			data: data || {},
			children: []
		};

		const container = instance.Element.querySelector('.ot-editor-blocks');

		if(!container)
		{
			return null;
		}

		const node = editor.Fn('render.block', instance, block);

		if(!node)
		{
			return null;
		}

		if(afterUid)
		{
			const index = instance.blocks.findIndex(b => b.uid === afterUid);
			const afterNode = container.querySelector('[data-uid="' + afterUid + '"]');

			if(index !== -1 && afterNode)
			{
				instance.blocks.splice(index + 1, 0, block);
				afterNode.after(node);
			}
			else
			{
				instance.blocks.push(block);
				container.appendChild(node);
			}
		}
		else
		{
			instance.blocks.push(block);
			container.appendChild(node);
		}

		const placeholder = instance.Element.querySelector('.ot-editor-placeholder');

		if(placeholder)
		{
			placeholder.style.display = 'none';
		}

		return block;
	});
});
