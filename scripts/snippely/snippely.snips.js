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
					code: snip.code,
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
		var type = snip.type + (snip.code ? ' code' : '');
		var info = new Element('div', {'class': 'info', 'text': type});
		var content = new Element('div', {'class': 'content', 'html': snip.content.unescape()}).store('snip:id', snip.id);
		var wrapper = new Element('div', {'class': snip.type + ' snip'}).adopt(info, content);
		
		new Editable(content, {
			enter: true,
			wrapper: wrapper,
			activation: 'mousedown',
			onBlur: this.save.bind(this)
		});
		
		this.container.adopt(wrapper);
		return wrapper;
	},
	
	add: function(note){
		var snippet = Snippely.Snippets.selected;
		if (!snippet) return;
		
		var code = 1;
		var rank = this.elements.length + 1;
		var type = 'javascript';
		var content = 'Some Content';
		
		var callback = function(result){
			var element = this.create({
				id: result.lastInsertRowID,
				code: code,
				type: type,
				content: content
			});
			this.elements.push(element);
			Snippely.redraw();
		}.bind(this);
		
		Snippely.database.execute(this.Queries.insert, callback, {
			code: code,
			rank: rank,
			type: type,
			content: content,
			snippet_id: snippet.retrieve('snippet:id')
		});
	},
	
	save: function(element){
		var id = element.retrieve('snip:id');
		var text = element.get('html');
		
		Snippely.database.execute(this.Queries.update, {
			id: id,
			content: text.escape()
		});
	}
	
};

Snippely.Snips.Queries = {
	
	select: "SELECT * FROM snips WHERE snippet_id = :snippet_id ORDER BY rank ASC",
	
	update: "UPDATE snips SET content = :content WHERE id = :id",
	
	insert: "INSERT INTO snips (snippet_id, rank, type, code, content) VALUES (:snippet_id, :rank, :type, :code, :content)"
	
};