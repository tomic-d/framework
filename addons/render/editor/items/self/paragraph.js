onetype.AddonReady('editor', (editor) =>
{
	editor.ItemAdd({
		id: 'paragraph',
		icon: 'text_fields',
		name: 'Text',
		category: 'basic',
		editable: true,
		children: false,
		config: {},
		insert: function(data)
		{
			return '<p>' + (data.content || '') + '</p>';
		},
		update: function(data)
		{
			return '<p>' + (data.content || '') + '</p>';
		},
		remove: function(node) {}
	});
});
