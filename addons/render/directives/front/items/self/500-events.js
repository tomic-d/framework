onetype.AddonReady('directives', function(directives)
{
	const register = (config) =>
	{
		directives.ItemAdd({
			id: config.id,
			trigger: 'node',
			order: 500,
			attributes: { [config.id]: ['string'] },
			code: function(data, item, compile, node)
			{
				const attribute = data[config.id].value;
				const modifiers = data[config.id].modifiers;

				node[config.property] = (event) =>
				{
					if(modifiers && modifiers.length)
					{
						if(modifiers.includes('prevent')) event.preventDefault();
						if(modifiers.includes('stop')) event.stopPropagation();
					}

					const result = onetype.Function(attribute, compile.data, false);

					if(typeof result === 'function')
					{
						const payload = { event };

						if(config.value && event.target)
						{
							payload.value = event.target.value || '';
						}

						result(payload);
					}
				};
			}
		});

		document.addEventListener(config.event, function(event)
		{
			let node = event.target;

			while(node && node !== document)
			{
				if(config.property in node)
				{
					node[config.property](event);
					break;
				}

				node = node.parentNode;
			}
		}, !!config.capture);
	};

	register({ id: 'ot-mousedown', event: 'mousedown', property: 'otMousedown' });
	register({ id: 'ot-click', event: 'click', property: 'otClick' });
	register({ id: 'ot-double-click', event: 'dblclick', property: 'otDoubleClick' });
	register({ id: 'ot-input', event: 'input', property: 'otInput', value: true });
	register({ id: 'ot-change', event: 'change', property: 'otChange', value: true });
	register({ id: 'ot-focus', event: 'focus', property: 'otFocus', value: true, capture: true });
	register({ id: 'ot-blur', event: 'blur', property: 'otBlur', value: true, capture: true });
	register({ id: 'ot-keydown', event: 'keydown', property: 'otKeydown', value: true });
	register({ id: 'ot-keyup', event: 'keyup', property: 'otKeyup', value: true });
	register({ id: 'ot-paste', event: 'paste', property: 'otPaste', value: true });
	register({ id: 'ot-mouse-move', event: 'mousemove', property: 'otMouseMove' });
	register({ id: 'ot-scroll', event: 'scroll', property: 'otScroll', capture: true });
	register({ id: 'ot-submit', event: 'submit', property: 'otSubmit' });
});
