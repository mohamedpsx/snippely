Snippely.Tags = {

	initialize: function(tags){
		this.list = $('tags-list').empty();
		var elements = tags.map(this.create, this);
		this.elements = $$(elements);
	},

	create: function(tag){
		var element = new Element('li', { text: tag.name });
		new Editable(element, { onBlur: this.save.bind(this) });
		
		this.list.adopt(element.addEvents({
			click: this.select.bind(this, element),
			mousedown: function(event){ event.stopPropagation(); }
		}).store('tag:id', tag.id));
		
		return element;
	},
	
	add: function(){
		var sql = "INSERT INTO tags (name) VALUES ('New Tag')";
		var callback = function(result){
			var element = this.create({name: 'New Tag', id: result.lastInsertRowID});
			this.elements.push(element);
			this.select(element);
			element.fireEvent('dblclick');
		}.bind(this);
		Snippely.database.execute(sql, callback);
	},
	
	remove: function(){
		if (!this.selected || !confirm("Are you sure you want to remove this Tag and all of it's Snippets?")) return;
		
		var id = this.selected.retrieve('tag:id');
		var sql = "DELETE FROM tags WHERE id = " + id;
		Snippely.database.execute(sql);
		
		//TODO - remove all this tag's snippets and their snips from the database
		this.selected.destroy();
	},
	
	rename: function(){
		if (!this.selected) return;
		this.selected.fireEvent('dblclick');
	},
	
	save: function(element){
		var id = element.retrieve('tag:id');
		var name = element.get('text');
		var sql = "UPDATE tags SET name = '" + name + "' WHERE id = " + id;
		Snippely.database.execute(sql);
	},
	
	select: function(element){
		this.elements.removeClass('selected');
		this.selected = element.addClass('selected');
		
		var id = element.retrieve('tag:id');
		Snippely.initializeSnippets(id);
	}

};
