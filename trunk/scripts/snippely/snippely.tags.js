Snippely.Tags = {

	initialize: function(){
		this.list = $('tags-list');
		$('tags').addEvent('click', this.deselect.bind(this));
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
		this.loadActive();
	},

	create: function(tag){
		var element = new Element('li', {
			id: 'tag_' + tag.id,
			text: tag.name
		});
		
		new Editable(element, { onBlur: this.update.bind(this) });
		
		this.list.adopt(element.addEvents({
			click: function(event){
				event.stop();
				this.select(element);
			}.bind(this),
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
	
	update: function(element){
		Snippely.database.execute(this.Queries.update, this.refresh.bind(this), {
			id: element.retrieve('tag:id'),
			name: element.get('text')
		});
	},
	
	select: function(element){
		if (element == this.selected) return;
		this.elements.removeClass('selected');
		this.selected = element.addClass('selected');
		Snippely.Snippets.deselect(true);
		Snippely.Snippets.load(element.retrieve('tag:id'));
		Snippely.toggleMenus('Tag', true);
	},
	
	deselect: function(){
		this.elements.removeClass('selected');
		this.selected = null;
		Snippely.Snippets.deselect(true);
		Snippely.toggleMenus('Tag', false);
	},
	
	rename: function(){
		if (!this.selected) return;
		this.selected.fireEvent('dblclick');
	},
	
	remove: function(){
		if (!this.selected || !confirm("Are you sure you want to remove this Tag and all of it's Snippets?")) return;
		this.removeById(this.selected.retrieve('tag:id'));
		this.selected.destroy();
		this.deselect();
	},
	
	// remove helpers
	
	removeById: function(id){
		Snippely.database.execute(this.Queries.remove, { id: id });
		Snippely.Snippets.removeByTag(id);
	},
	
	// storage helpers
	
	refresh: function(){
		this.storeActive();
		this.load();
	},
	
	storeActive: function(){
		var tag = this.selected;
		tag = tag ? tag.retrieve('tag:id') : 0;
		ART.store('tags:active', tag);
	},
	
	loadActive: function(){
		var active = ART.retrieve('tags:active') || 0;
		if (active){
			var tag = $('tag_' + active);
			if (tag) this.select(tag);
		}
	}
	
};

//Tag related queries

Snippely.Tags.Queries = {
	
	select: "SELECT * FROM tags ORDER BY name ASC",
	
	insert: "INSERT INTO tags (name) VALUES ('New Tag')",
	
	remove: "DELETE FROM tags WHERE id = :id",
	
	update: "UPDATE tags SET name = :name WHERE id = :id"
	
};