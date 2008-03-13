Snippely.Snippets = {

	initialize: function(snippets){
		this.list = $('snippets-list').empty();
		var elements = snippets.map(this.create, this);
		this.elements = $$(elements);
		this.list.getElements(':odd').addClass('odd');
	},

	create: function(snippet){
		var element = new Element('li', { text: snippet.title });
		new Editable(element, { onBlur: this.save.bind(this) });
		
		this.list.adopt(element.addEvents({
			click: this.select.bind(this, element),
			mousedown: function(event){ event.stopPropagation(); }
		}).store('snippet:id', snippet.id));
		
		return element;
	},

	add: function(){
		var tag = Snippely.Tags.selected;
		if (!tag) return;
		var tag_id = tag.retrieve('tag:id');
		var sql = "INSERT INTO snippets (tag_id, title, description) VALUES (" + tag_id + ", 'New Snippet', 'Description')";
		var callback = function(result){
			var element = this.create({title: 'New Snippet', id: result.lastInsertRowID});
			this.elements.push(element);
			this.select(element);
			element.fireEvent('dblclick');
		}.bind(this);
		Snippely.database.execute(sql, callback);
	},
	
	remove: function(){
		if (!this.selected || !confirm("Are you sure you want to remove this Snippet?")) return;
		
		var id = this.selected.retrieve('snippet:id');
		var sql = "DELETE FROM snippets WHERE id = " + id;
		Snippely.database.execute(sql);
		
		//TODO - remove all this snippet's snips from the database
		this.selected.destroy();
	},
	
	rename: function(){
		if (!this.selected) return;
		this.selected.fireEvent('dblclick');
	},
	
	save: function(element){
		var id = element.retrieve('snippet:id');
		var title = element.get('text');
		var sql = "UPDATE snippets SET title = '" + title + "' WHERE id = " + id;
		//Snippely.Snippet.title.set('text', title);
		Snippely.database.execute(sql);
	},
	
	select: function(element){
		this.elements.removeClass('selected');
		this.selected = element.addClass('selected');
		
		var id = element.retrieve('snippet:id');
		/*
		var snippet = SNIPPET[id]; //TODO - retrieve snippet from database
		Snippely.Snippet.load(snippet);
		*/
	}
	
};
