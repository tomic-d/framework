import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'preview-html',
	icon: 'preview',
	name: 'Preview HTML',
	description: 'Premium preview container with grid background, code display, and interactive controls.',
	category: 'Preview',
	author: 'Divhunt',
	example: '<e-preview-html code="<e-button text=\'Button\'></e-button>"></e-preview-html>',
	config: {
		title: {
			type: 'string',
			value: ''
		},
		html: {
			type: 'string',
			value: ''
		},
		code: {
			type: 'string',
			value: ''
		},
		copy: {
			type: 'boolean',
			value: true
		},
		copyable: {
			type: 'boolean',
			value: true
		},
		align: {
			type: 'string',
			value: 'center',
			options: ['start', 'center', 'end']
		},
		variant: {
			type: 'array',
			value: ['bg-1', 'border'],
			options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'compact', 'dots']
		}
	},
	render: function()
	{
		this.copied = false;

		this.copy = async () =>
		{
			if(!this.code || this.copied)
			{
				return;
			}

			try
			{
				await navigator.clipboard.writeText(this.code);
				this.copied = true;

				setTimeout(() =>
				{
					this.copied = false;
				}, 2000);
			}
			catch(e)
			{
				console.error('Failed to copy:', e);
			}
		};

		const header = `
			<div dh-if="title" class="header">
				<span class="title">{{ title }}</span>
				<div class="actions">
					<e-button dh-if="copyable && code" :icon="copied ? 'check' : 'content_copy'" :_click="copy" :variant="['ghost', 'size-s', 'icon-only']"></e-button>
				</div>
			</div>
		`;

		const preview = `
			<div class="preview" :align="align">
				<div class="grid"></div>
				<div class="content">
					<span dh-if="html" dh-html="html"></span>
					<slot dh-if="!html" name="html"></slot>
				</div>
			</div>
		`;

		const codeBlock = `
			<div dh-if="copy && code" class="code">
				<div class="code-header">
					<span class="label">HTML</span>
					<e-button dh-if="copyable && !title" :icon="copied ? 'check' : 'content_copy'" :text="copied ? 'Copied!' : 'Copy'" :_click="copy" :variant="['ghost', 'size-s']"></e-button>
				</div>
				<pre><code>{{ code }}</code></pre>
			</div>
		`;

		return `
			<div class="holder" :variant="variant.join(' ')">
				${header}
				${preview}
				${codeBlock}
			</div>
		`;
	}
});
