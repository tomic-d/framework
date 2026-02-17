divhunt.AddonReady('transforms', (transforms) =>
{
	transforms.ItemAdd({
		id: 'codeflask',
		icon: 'code',
		name: 'CodeFlask',
		description: 'Micro code editor with syntax highlighting. Supports live editing with onUpdate handler.',
		js: [
			'https://cdn.jsdelivr.net/npm/codeflask/build/codeflask.min.js'
		],
		config: {
			'value': ['string', ''],
			'language': ['string', 'markup'],
			'line-numbers': ['boolean', true],
			'readonly': ['boolean', false],
			'onUpdate': ['function']
		},
		code: function(data, item, compile, node, identifier)
		{
			this.setup = () =>
			{
				node.classList.add('codeflask-editor');
				node.classList.add('codeflask-editor-' + identifier);

				const initialValue = data['value'].value || node.textContent || '';
				node.innerHTML = '';

				this.container = document.createElement('div');
				this.container.className = 'codeflask-container';
				node.appendChild(this.container);

				this.initialValue = initialValue;
			};

			this.styles = () =>
			{
				const style = document.createElement('style');
				style.textContent = `
					.codeflask-editor-${identifier}
					{
						height: 100%;
						width: 100%;
					}
					.codeflask-editor-${identifier} .codeflask-container
					{
						height: 100%;
						width: 100%;
					}
					.codeflask-editor-${identifier} .codeflask
					{
						height: 100%;
					}
				`;
				document.head.appendChild(style);
			};

			this.initialize = () =>
			{
				setTimeout(() =>
				{
					if(typeof CodeFlask === 'undefined')
					{
						console.error('CodeFlask library not loaded');
						node.innerHTML = '<div style="padding: 20px;">CodeFlask not loaded</div>';
						return;
					}

					const flask = new CodeFlask(this.container, {
						language: data['language'].value || 'markup',
						lineNumbers: data['line-numbers'].value !== false,
						readonly: data['readonly'].value === true
					});

					flask.updateCode(this.initialValue);

					this.flask = flask;

					flask.onUpdate((code) =>
					{
						// const onUpdate = data['onUpdate'].value;
						// if(typeof onUpdate === 'function')
						// {
						// 	onUpdate({value: code, node});
						// }
					});

					node.getValue = () => flask.getCode();
					node.setValue = (value) => flask.updateCode(value);
					node.setLanguage = (language) => flask.updateLanguage(language);

				}, 200);
			};

			this.setup();
			this.styles();
			this.initialize();
		}
	});
});
