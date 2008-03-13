Snippely.Tags = {

	initialize: function(){
		this.list = $('tags-list');
		this.load();
	},
	
	load: function(){
		var callback = function(result){
			var tags = [];
			if (result.data) $each(result.data, function(tag){
				tags.push({
					id: tag.id,
					name: tag.name.unescape()
				});
			});
			this.build(tags);
		}.bind(this);
		
		Snippely.database.execute(this.Queries.select, callback);
	},
	
	build: function(tags){
		this.list.empty();
		var elements = tags.map(this.create, this);
		this.elements = $$(elements);
		Snippely.redraw();
	},

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
	
	add: function(){
		var callback = function(result){
			var element = this.create({name: 'New Tag', id: result.lastInsertRowID});
			this.elements.push(element);
			this.select(element);
			Snippely.redraw();
			element.fireEvent('dblclick');
		}.bind(this);
		Snippely.database.execute(this.Queries.insert, callback);
	},
	
	remove: function(){
		if (!this.selected || !confirm("Are you sure you want to remove this Tag and all of it's Snippets?")) return;
		
		var id = this.selected.retrieve('tag:id');
		Snippely.database.execute(this.Queries.remove, { id: id });
		Snippely.Snippets.removeByTag(id);
		
		this.selected.destroy();
	},
	
	rename: function(){
		if (!this.selected) return;
		this.selected.fireEvent('dblclick');
	},
	
	save: function(element){
		Snippely.database.execute(this.Queries.update, {
			id: element.retrieve('tag:id'),
			name: element.get('text')
		});
	},
	
	select: function(element){
		if (element == this.selected) return;
		
		this.elements.removeClass('selected');
		this.selected = element.addClass('selected');
		
		var id = element.retrieve('tag:id');
		Snippely.Snippets.load(id);
	}
	
};

//Tag related queries

Snippely.Tags.Queries = {
	
	select: "SELECT * FROM tags",
	
	insert: "INSERT INTO tags (name) VALUES ('New Tag')",
	
	remove: "DELETE FROM tags WHERE id = :id",
	
	update: "UPDATE tags SET name = :name WHERE id = :id"
	
};