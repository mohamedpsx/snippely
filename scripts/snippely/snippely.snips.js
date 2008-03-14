Snippely.Snips = {
	
	initialize: function(){
		this.container = $('snippet-snips');
	},
	
	load: function(id){
		var callback = function(result){
			var snips = [];
			if (result.data) $each(result.data, function(snip){
				snips.push({
					id: snip.id,
					type: snip.type.unescape(),
					content: snip.content.unescape()
				});
			});
			this.container.empty();
			this.build(snips);
		}.bind(this);
		
		Snippely.database.execute(this.Queries.select, callback, {
			snippet_id: id
		});
	},
	
	build: function(snips){
		var elements = snips.map(this.create, this);
		this.elements = $$(elements);
		
		this.sortables = new Sortables('snippet-snips', {
			clone: true,
			opacity: 0.3,
			handle: 'div.info'
		});
		
		Snippely.redraw();
	},
	
	create: function(snip){
		var type = (snip.type == 'note' ? 'div' : 'pre');
		
		var info = new Element('div', {
			'class': 'info',
			'text': snip.type
		});
		
		var content = new Element(type, {
			'class': 'content',
			'html': snip.content.unescape()
		});
		
		var wrapper = new Element('div', {
			'class': snip.type + ' snip'
		}).adopt(info, content);
		
		new Editable(content, {
			enter: true,
			wrapper: wrapper,
			activation: 'mousedown',
			onBlur: this.save.bind(this)
		});
		
		content.store('snip:id', snip.id);
		content.store('snip:type', snip.type);
		
		this.container.adopt(wrapper);
		return wrapper;
	},
	
	add: function(type){
		var snippet = Snippely.Snippets.selected;
		if (!snippet) return;
		
		var position = this.elements.length + 1;
		var content = 'Some Content';
		
		var callback = function(result){
			var element = this.create({
				id: result.lastInsertRowID,
				type: type,
				content: content
			});
			this.elements.push(element);
			Snippely.redraw();
		}.bind(this);
		
		Snippely.database.execute(this.Queries.insert, callback, {
			type: type,
			content: content,
			position: position,
			snippet_id: snippet.retrieve('snippet:id')
		});
	},
	
	save: function(element){
		Snippely.database.execute(this.Queries.update, {
			id: element.retrieve('snip:id'),
			content: element.get('html').escape()
		});
	},
	
	remove: function(element){
		this.removeById(element.retrieve('snip:id'));
		element.destroy();
	},
	
	//remove helpers
	
	removeById: function(id){
		Snippely.database.execute(this.Queries.remove, { id: id });
	},
	
	removeBySnippet: function(snippet_id, callback){
		Snippely.database.execute(this.Queries.removeBySnippet, { snippet_id: snippet_id });
	}
	
};

//Snip related queries

Snippely.Snips.Queries = {
	
	select: "SELECT * FROM snips WHERE snippet_id = :snippet_id ORDER BY position ASC",
	
	insert: "INSERT INTO snips (snippet_id, position, type, content) VALUES (:snippet_id, :position, :type, :content)",
	
	remove: "DELETE FROM snips WHERE id = :id",
	
	update: "UPDATE snips SET content = :content WHERE id = :id",
	
	removeBySnippet: "DELETE FROM snips WHERE snippet_id = :snippet_id"
	
};