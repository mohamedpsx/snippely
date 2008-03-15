Snippely.Snippets = {

	initialize: function(){
		this.list = $('snippets-list');
		$('snippets').addEvent('click', this.deselect.bind(this));
	},
	
	load: function(tag_id){
		if (!tag_id) return;
		this.tag_id = tag_id;
		
		var callback = function(result){
			var snippets = result.data;
			if (!snippets) return;
			this.build(snippets);
		}.bind(this);
		
		Snippely.database.execute(this.Queries.select, callback, { tag_id: tag_id });
	},
	
	build: function(snippets){
		this.list.empty();
		var elements = snippets.map(this.create, this);
		this.elements = $$(elements);
		this.redraw();
		this.loadActive();
	},
	
	redraw: function(){
		this.elements.removeClass('odd');
		this.list.getElements(':odd').addClass('odd');
		Snippely.Snippet.hide();
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
		
		Snippely.database.execute(this.Queries.update, this.refresh.bind(this), {
			id: id,
			title: title
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
	},
	
	// storage helpers
	
	refresh: function(){
		this.storeActive();
		this.load(this.tag_id);
	},
	
	storeActive: function(){
		var snippet = this.selected;
		snippet = snippet ? snippet.retrieve('snippet:id') : 0;
		ART.store('snippet:active', snippet);
	},
	
	loadActive: function(){
		var active = ART.retrieve('snippet:active') || 0;
		if (active){
			var snippet = $('snippet_' + active);
			if (snippet) this.select(snippet);
		}
	}
	
};

//Snippets list related queries

Snippely.Snippets.Queries = {
	
	select: "SELECT id, title FROM snippets WHERE tag_id = :tag_id ORDER BY title ASC",
	
	insert: "INSERT INTO snippets (tag_id, title, description) VALUES (:tag_id, 'New Snippet', 'Description')",
	
	remove: "DELETE FROM snippets WHERE id = :id",
	
	update: "UPDATE snippets SET title = :title WHERE id = :id",
	
	removeByTag: "DELETE FROM snippets WHERE tag_id = :tag_id"
	
};