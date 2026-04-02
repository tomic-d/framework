elements.ItemAdd({
	id: 'cloudflare-images',
	icon: 'image',
	name: 'Images',
	description: 'Image browser with upload and management.',
	category: 'Editor',
	author: 'OneType',
	config: {
		site: {
			type: 'object',
			value: null
		},
		_pick: {
			type: 'function'
		}
	},
	render: function()
	{
		this.items = [];
		this.loading = true;
		this.uploading = false;
		this.dragging = false;

		const load = () =>
		{
			if(!this.site)
			{
				return;
			}

			$ot.command('cloudflare:images:list', { site_id: this.site.id }, true).then(result =>
			{
				this.items = result.data.images;
				this.loading = false;
			});
		};

		load();

		this.upload = (files) =>
		{
			if(!files.length || !this.site)
			{
				return;
			}

			this.uploading = true;

			const pending = Array.from(files).map(file =>
			{
				const form = new FormData();

				form.append('file', file);
				form.append('site_id', this.site.id);
				form.append('filename', file.name);

				return fetch('/api/images', { method: 'POST', body: form });
			});

			Promise.all(pending).then(responses =>
			{
				return Promise.all(responses.map(r => r.json()));
			}).then(results =>
			{
				this.uploading = false;

				const failed = results.filter(r => r.code !== 200);

				if(failed.length)
				{
					$ot.toast({ type: 'error', message: failed[0].message || 'Upload failed.' });
				}
				else
				{
					$ot.toast({ type: 'success', message: 'Images uploaded.' });
				}

				load();
			});
		};

		this.pick = (item) =>
		{
			if(this._pick)
			{
				this._pick(item);
			}
		};

		this.remove = (event, item) =>
		{
			event.stopPropagation();

			$ot.command('cloudflare:images:delete', { id: item.id }, true).then(result =>
			{
				if(result.data.code && result.data.code !== 200)
				{
					$ot.toast({ type: 'error', message: result.data.message || 'Delete failed.' });
				}

				load();
			});
		};

		this.browse = () =>
		{
			const input = document.createElement('input');

			input.type = 'file';
			input.accept = 'image/*';
			input.multiple = true;

			input.onchange = () =>
			{
				this.upload(input.files);
			};

			input.click();
		};

		this.drop = (event) =>
		{
			event.preventDefault();
			this.dragging = false;
			this.upload(event.dataTransfer.files);
		};

		this.over = (event) =>
		{
			event.preventDefault();
			this.dragging = true;
		};

		this.leave = () =>
		{
			this.dragging = false;
		};

		this.size = (bytes) =>
		{
			if(bytes < 1024)
			{
				return bytes + ' B';
			}

			if(bytes < 1048576)
			{
				return (bytes / 1024).toFixed(1) + ' KB';
			}

			return (bytes / 1048576).toFixed(1) + ' MB';
		};

		this.close = () =>
		{
			$ot.modal.close();
		};

		return `
			<div class="holder">
				<div class="header">
					<div class="left">
						<i class="icon">image</i>
						<span class="title">Images</span>
						<span class="count">{{ items.length }}</span>
					</div>
					<div class="right">
						<e-form-button text="Upload" icon="upload" :variant="['bg-1', 'border', 'size-s']" :_click="browse" :loading="uploading"></e-form-button>
						<button class="close" ot-click="close"><i>close</i></button>
					</div>
				</div>
				<div :class="'body' + (dragging ? ' dragging' : '')" ot-drop="drop" ot-dragover="over" ot-dragleave="leave">
					<e-status-loading ot-if="loading" :variant="['brand']"></e-status-loading>
					<div ot-if="!loading && !items.length && !uploading" class="empty">
						<e-status-empty icon="image" title="No images" description="Upload images by dragging them here or clicking upload." action="Upload" :_click="browse"></e-status-empty>
					</div>
					<div ot-if="items.length" class="grid">
						<div ot-for="item in items" class="card" ot-click="() => pick(item)">
							<div class="preview">
								<img :src="item.url" :alt="item.alt || item.filename" loading="lazy" />
							</div>
							<div class="info">
								<span class="name">{{ item.filename }}</span>
								<span class="meta">{{ size(item.size) }}</span>
							</div>
							<button class="delete" ot-click="(e) => remove(e, item)"><i>delete</i></button>
						</div>
					</div>
				</div>
			</div>
		`;
	}
});
