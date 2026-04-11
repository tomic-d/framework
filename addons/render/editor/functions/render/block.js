onetype.AddonReady('editor', (editor) =>
{
	editor.Fn('render.block', function(instance, block)
	{
		const type = editor.ItemGet(block.type);

		if(!type)
		{
			return null;
		}

		const wrapper = document.createElement('div');
		wrapper.className = 'ot-block';
		wrapper.setAttribute('data-uid', block.uid);
		wrapper.setAttribute('data-type', block.type);
		wrapper.setAttribute('tabindex', '-1');

		const gutter = document.createElement('div');
		gutter.className = 'ot-block-gutter';
		gutter.innerHTML = '<button class="ot-block-handle" draggable="true"><i>drag_indicator</i></button><button class="ot-block-add"><i>add</i></button>';

		const content = document.createElement('div');
		content.className = 'ot-block-content';
		content.innerHTML = type.Get('insert').call(null, block.data);

		const actions = document.createElement('div');
		actions.className = 'ot-block-actions';
		actions.innerHTML = '<button class="ot-block-settings"><i>more_vert</i></button>';

		wrapper.appendChild(gutter);
		wrapper.appendChild(content);
		wrapper.appendChild(actions);

		if(type.Get('editable'))
		{
			const target = content.firstElementChild;

			if(target)
			{
				target.setAttribute('contenteditable', 'true');
				target.setAttribute('data-placeholder', instance.placeholder || 'Type something...');

				target.addEventListener('input', () =>
				{
					block.data.content = target.innerHTML;

					if(instance._change)
					{
						instance._change({ value: instance.getValue() });
					}
				});

				target.addEventListener('keydown', (e) =>
				{
					if(e.key === 'Enter' && !e.shiftKey)
					{
						e.preventDefault();
						const newBlock = editor.Fn('block.add', instance, 'paragraph', block.uid, {});

						if(newBlock)
						{
							const newNode = instance.Element.querySelector('[data-uid="' + newBlock.uid + '"]');

							if(newNode)
							{
								const editable = newNode.querySelector('[contenteditable]');
								if(editable) editable.focus();
							}
						}
					}

					if(e.key === 'Backspace' && target.innerHTML === '' && instance.blocks.length > 1)
					{
						e.preventDefault();

						const index = instance.blocks.findIndex(b => b.uid === block.uid);
						const prev = index > 0 ? instance.blocks[index - 1] : null;

						editor.Fn('block.delete', instance, block.uid);

						if(prev)
						{
							const prevNode = instance.Element.querySelector('[data-uid="' + prev.uid + '"]');

							if(prevNode)
							{
								const editable = prevNode.querySelector('[contenteditable]');
								if(editable) editable.focus();
							}
						}
					}
				});
			}
		}

		gutter.querySelector('.ot-block-add').addEventListener('click', () =>
		{
			const newBlock = editor.Fn('block.add', instance, 'paragraph', block.uid, {});

			if(newBlock)
			{
				const newNode = instance.Element.querySelector('[data-uid="' + newBlock.uid + '"]');

				if(newNode)
				{
					const editable = newNode.querySelector('[contenteditable]');
					if(editable) editable.focus();
				}
			}
		});

		return wrapper;
	});
});
