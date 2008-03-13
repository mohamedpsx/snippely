Snippely.Tags = {

	//set up properties and perform actions for initial load
	
	initialize: function(){
		this.list = $('tags-list');
		this.load();
	},
	
	//load all existing tags from the database
	
	load: function(){
		var sql = 'SELECT * FROM tags';
		var callback = function(result){
			var tags = [];
			if (result.data) $each(result.data, function(tag){
				tags.push({id: tag.id, name: tag.name.unescape()});
			});
			this.build(tags);
		}.bind(this);
		
		Snippely.database.execute(sql, callback);
	},
	
	//initialize the tags list from the data passed in
	
	build: function(tags){
		this.list.empty();
		var elements = tags.map(this.create, this);
		this.elements = $$(elements);
		Snippely.redraw();
	},

	//create a tag element and insert it into the tags list

	create: function(tag){
		var element = new Element('li', {
			id: 'tag_' + tag.id,
			text: tag.name
		});
		
		new Editable(element, { onBlur: this.save.bind(this) });
		
		this.list.adopt(element.addEvents({
			click: this.select.bind(this, element),
			mousedown: function(event){ event.stopPropagation(); }
		}).store('tag:id', tag.id));
		
		return element;
	},
	
	//add a new tag to the database and create an editable list item for it
	
	add: function(){
		var sql = "INSERT INTO tags (name) VALUES ('New Tag')";
		var callback = function(result){
			var element = this.create({name: 'New Tag', id: result.lastInsertRowID});
			this.elements.push(element);
			this.select(element);
			Snippely.redraw();
			element.fireEvent('dblclick');
		}.bind(this);
		Snippely.database.execute(sql, callback);
	},
	
	//remove the currently selected tag from the database and the tags list
	
	remove: function(){
		if (!this.selected || !confirm("Are you sure you want to remove this Tag and all of it's Snippets?")) return;
		
		var id = this.selected.retrieve('tag:id');
		var sql = "DELETE FROM tags WHERE id = " + id;
		Snippely.database.execute(sql);
		
		//TODO - remove all this tag's snippets and their snips from the database
		this.selected.destroy();
	},
	
	//invoke the inline editor for the currently selected tag
	
	rename: function(){
		if (!this.selected) return;
		this.selected.fireEvent('dblclick');
	},
	
	//save the name of a tag to the database
	
	save: function(element){
		var id = element.retrieve('tag:id');
		var name = element.get('text');
		var sql = "UPDATE tags SET name = '" + name.escape() + "' WHERE id = " + id;
		Snippely.database.execute(sql);
	},
	
	//select a tag from the list and load all it's snippets into the snippets list
	
	select: function(element){
		this.elements.removeClass('selected');
		this.selected = element.addClass('selected');
		
		var id = element.retrieve('tag:id');
		Snippely.Snippets.load(id);
	}
	
};
