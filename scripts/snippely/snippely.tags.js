Snippely.Tags = {

	initialize: function(tags){
		this.list = $('tags-list').empty();
		var elements = tags.map(this.create, this);
		this.elements = $$(elements);
	},

	create: function(tag){
		var element = new Element('li', { text: tag.name });
		var editable = new Editable(element, {
			onBlur: this.save.bind(this)
		});
		
		this.list.adopt(element.addEvents({
			click: this.select.bind(this, element),
			mousedown: function(event){ event.stopPropagation(); }
		}).store('tag:id', tag.id));
		
		return element;
	},
	
	add: function(){
		//QUERY - insert the tag
		var sql = "INSERT INTO tags (name) VALUES ('" + 'New Tag' + "')";
		var callback = function(result){
			var element = this.create({name: 'New Tag', id: result.lastInsertRowID});
			this.elements.push(element);
			this.select(element);
			element.fireEvent('dblclick');
		}.bind(this);
		Snippely.database.execute(sql, callback);
	},
	
	remove: function(){
		if (!this.selected) return;
		if (!confirm("Are you sure you want to remove this Tag and all of it's Snippets?")) return;
		var id = this.selected.retrieve('tag:id');
		
		//QUERY - remove the tag
		var sql = "DELETE FROM tags WHERE id = " + id;
		Snippely.database.execute(sql);
		
		//TODO - remove this tag and all it's snippets from the database
		this.selected.erase('editable').destroy();
	},
	
	rename: function(){
		if (!this.selected) return;
		this.selected.fireEvent('dblclick');
	},
	
	save: function(element){
		var id = element.retrieve('tag:id');
		var name = element.get('text');
		
		//QUERY - update the tag
		var sql = "UPDATE tags SET name = '" + name + "' WHERE id = " + id;
		Snippely.database.execute(sql);
		
		//TODO - save this tag's new name to the database
	},
	
	select: function(element){
		this.elements.removeClass('selected');
		this.selected = element.addClass('selected');
		
		var id = element.retrieve('tag:id');
		var snippets = SNIPPETS[id] || []; //TODO - retrieve snippets list from database
		Snippely.Snippets.load(snippets);
	}

};
