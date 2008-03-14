Snippely.Snippets = {

	initialize: function(){
		this.list = $('snippets-list');
		$('snippets').addEvent('click', this.deselect.bind(this));
	},
	
	redraw: function(){
		this.elements.removeClass('odd');
		this.list.getElements(':odd').addClass('odd');
		Snippely.Snippet.hide();
		Snippely.redraw();
	},
	
	load: function(tag_id){
		var callback = function(result){
			var snippets = [];
			if (result.data) $each(result.data, function(snippet){
				snippets.push({
					id: snippet.id,
					title: snippet.title.unescape()
				});
			});
			this.build(snippets);
		}.bind(this);
		
		Snippely.database.execute(this.Queries.select, callback, { tag_id: tag_id });
	},
	
	build: function(snippets){
		this.list.empty();
		var elements = snippets.map(this.create, this);
		this.elements = $$(elements);
		this.redraw();
	},
	
	create: function(snippet){
		var element = new Element('li', {
			id: 'snippet_' + snippet.id,
			text: snippet.title
		});
		
		new Editable(element, { onBlur: this.update.bind(this) });
		
		this.list.adopt(element.addEvents({
			click: function(event){
				event.stop();
				this.select(element);
			}.bind(this),
			mousedown: function(event){
				event.stopPropagation();
			}
		}).store('snippet:id', snippet.id));
		
		return element;
	},
	
	add: function(){
		var tag = Snippely.Tags.selected;
		if (!tag) return;
		
		var callback = function(result){
			var element = this.create({
				id: result.lastInsertRowID,
				title: 'New Snippet'
			});
			this.elements.push(element);
			this.select(element);
			this.redraw();
			element.fireEvent('dblclick');
		}.bind(this);
		
		Snippely.database.execute(this.Queries.insert, callback, {
			tag_id: tag.retrieve('tag:id')
		});
	},
	
	update: function(element){
		var id = element.retrieve('snippet:id');
		var title = element.get('text');
		var callback = function(){
			if (Snippely.Snippet.id && Snippely.Snippet.id == id) Snippely.Snippet.title.set('text', title);
		};
		
		Snippely.database.execute(this.Queries.update, callback, {
			id: id,
			title: title.escape()
		});
	},
	
	select: function(element){
		if (element == this.selected) return;
		this.elements.removeClass('selected');
		this.selected = element.addClass('selected');
		var id = element.retrieve('snippet:id');
		Snippely.Snippet.load(id);
		Snippely.Snips.load(id);
		Snippely.toggleMenus('Snippet', true);
	},
	
	deselect: function(destroy){
		if (!this.elements) return;
		if (destroy == true) this.elements.destroy();
		else this.elements.removeClass('selected');
		this.selected = null;
		Snippely.Snippet.hide();
		Snippely.toggleMenus('Snippet', false);
	},
	
	rename: function(){
		if (!this.selected) return;
		this.selected.fireEvent('dblclick');
	},
	
	remove: function(){
		if (!this.selected || !confirm("Are you sure you want to remove this Snippet?")) return;
		this.removeById(this.selected.retrieve('snippet:id'));
		this.selected.destroy();
		this.deselect();
		this.redraw();
	},
	
	//remove helpers
	
	removeById: function(id){
		Snippely.database.execute(this.Queries.remove, { id: id });
		Snippely.Snips.removeBySnippet(id);
	},
	
	removeByTag: function(tag_id){
		var callback = function(result){
			if (result.data) $each(result.data, function(snippet){
				Snippely.Snips.removeBySnippet(snippet.id);
			}, this);
			
			Snippely.database.execute(this.Queries.removeByTag, { tag_id: tag_id });
		}.bind(this);
		
		Snippely.database.execute(this.Queries.select, callback, { tag_id: tag_id });
	}
	
};

//Snippets list related queries

Snippely.Snippets.Queries = {
	
	select: "SELECT id, title FROM snippets WHERE tag_id = :tag_id",
	
	insert: "INSERT INTO snippets (tag_id, title, description) VALUES (:tag_id, 'New Snippet', 'Description')",
	
	remove: "DELETE FROM snippets WHERE id = :id",
	
	update: "UPDATE snippets SET title = :title WHERE id = :id",
	
	removeByTag: "DELETE FROM snippets WHERE tag_id = :tag_id"
	
};