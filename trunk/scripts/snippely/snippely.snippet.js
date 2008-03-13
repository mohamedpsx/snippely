Snippely.Snippet = {
	
	//set up properties and perform actions for initial load
	
	initialize: function(){
		this.container = $('snippet-container');
		this.title = $('snippet-title');
		this.description = $('snippet-description');
		this.snips = $('snippet-snips');
	},

	//load a snippet from the database based on id
	
	load: function(id){
		var callback = function(result){
			var data = result.data && result.data[0];
			if (!data) return;
			var snippet = {
				id: data.id,
				title: data.title.unescape(),
				description: data.description.unescape()
			};
			this.build(snippet);
		}.bind(this);
		
		Snippely.database.execute(this.Queries.selectMeta, callback, {
			id: id
		});
	},
	
	build: function(snippet){
		this.container.setStyle('display', (snippet ? '' : 'none'));
		if (!snippet) return;
		
		this.snips.empty();
		this.id = snippet.id;
		
		this.title.set('text', snippet.title);
		this.description.set('text', snippet.description);
		
		new Editable(this.title, { onBlur: this.saveTitle.bind(this) });
		new Editable(this.description, { enter: true, onBlur: this.saveDescription.bind(this) });
		
		this.loadSnips(this.id);
	},
	
	loadSnips: function(id){
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
			this.buildSnips(snips);
		}.bind(this);
		
		Snippely.database.execute(this.Queries.selectSnips, callback, {
			snippet_id: id
		});
	},
	
	buildSnips: function(snips){
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
			onBlur: this.saveSnip.bind(this)
		});
		
		this.snips.adopt(wrapper);
		return wrapper;
	},
	
	add: function(){
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
	
	saveTitle: function(element){
		var id = this.id;
		var title = element.get('text');
		
		var callback = function(){
			var snippet = $('snippet_' + id);
			if (snippet) snippet.set('text', title);
		};
		
		Snippely.database.execute(this.Queries.updateTitle, callback, {
			id: id,
			title: title.escape()
		});
	},
	
	saveDescription: function(element){
		Snippely.database.execute(this.Queries.updateDescription, {
			id: this.id,
			description: element.get('text').escape()
		});
	},
	
	saveSnip: function(element){
		var id = element.retrieve('snip:id');
		var text = element.get('html');
		
		Snippely.database.execute(this.Queries.updateSnip, {
			id: id,
			content: text.escape()
		});
	}

};

//Snippet related queries

Snippely.Snippet.Queries = {
	
	selectMeta: "SELECT * FROM snippets WHERE id = :id",
	
	selectSnips: "SELECT * FROM snips WHERE snippet_id = :snippet_id ORDER BY rank ASC",
	
	updateSnip: "UPDATE snips SET content = :content WHERE id = :id",
	
	updateTitle: "UPDATE snippets SET title = :title WHERE id = :id",
	
	updateDescription: "UPDATE snippets SET description = :description WHERE id = :id",
	
	insert: "INSERT INTO snips (snippet_id, rank, type, code, content) VALUES (:snippet_id, :rank, :type, :code, :content)"
	
};

//history for later
/*
content.history = [content.get('html')];
content.addEvent('keydown', function(event){
	if (event.meta && event.key == 'z'){
		event.preventDefault();
		var start = this.selectionStart;
		var previous = (this.history.length > 1) ? this.history.pop() : this.history[0];
		this.set('html', previous);
	} else {
		if (this.get('html') != this.history.getLast()) this.history.push(this.get('html'));
	}
});
*/