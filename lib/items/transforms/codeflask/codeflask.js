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
		code: function(data, node, transformer)
		{
			this.setup = () =>
			{
				node.classList.add('codeflask-editor');
				node.classList.add('codeflask-editor-' + identifier);

				const initialValue = data['value'] || node.textContent || '';
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
					.codeflask-editor-${id}
					{
						height: 100%;
						width: 100%;
					}
					.codeflask-editor-${id} .codeflask-container
					{
						height: 100%;
						width: 100%;
					}
					.codeflask-editor-${id} .codeflask
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
						language: data['language'] || 'markup',
						lineNumbers: data['line-numbers'] !== false,
						readonly: data['readonly'] === true
					});

					flask.updateCode(this.initialValue);

					this.flask = flask;

					flask.onUpdate((code) =>
					{
						// const onUpdate = data['onUpdate'];
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

