Snippely.Snippets = {

	initialize: function(){
		this.list = $('snippets-list');
		$('snippets').addEvent('mousedown', this.deselect.bind(this));
		this.id = ART.retrieve('snippet:active') || 0;
	},
	
	load: function(insert){
		var focus = insert && insert.lastInsertRowID;
		var callback = function(result){
			var snippets = result.data || [];
			this.build(snippets, focus);
		}.bind(this);
		
		Snippely.database.execute(this.Queries.select, callback, { group_id: Snippely.Groups.id });
	},
	
	build: function(snippets, focus){
		this.list.empty();
		this.elements = $$(snippets.map(this.create, this));
		this.select($('snippet_' + (focus || this.id)), focus);
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
			mousedown: function(event){ event.stopPropagation(); }
		}).store('snippet:id', snippet.id));
		
		return element;
	},
	
	add: function(){
		this.deselect();
		Snippely.database.execute(this.Queries.insert, this.load.bind(this), { group_id: Snippely.Groups.id });
	},
	
	update: function(element){
		Snippely.database.execute(this.Queries.update, this.load.bind(this), {
			id: element.retrieve('snippet:id'),
			title: element.get('text')
		});
	},
	
	select: function(element, focus){
		if (!element || element == this.selected) return;
		this.elements.removeClass('selected');
		this.selected = element.addClass('selected');
		this.id = element.retrieve('snippet:id');
		Snippely.Snippet.load(this.id);
		Snippely.Snips.load(this.id);
		Snippely.toggleMenus('Snippet', true);
		if (focus) element.fireEvent('dblclick');
	},
	
	deselect: function(destroy){
		if (!this.elements || !this.selected) return;
		if (this.selected.retrieve('editable').editing()){
			this.selected.blur();
		} else {
			if (destroy == true) this.elements.destroy();
			else this.elements.removeClass('selected');
			this.selected = this.id = null;
			Snippely.Snippet.hide();
			Snippely.toggleMenus('Snippet', false);
		}
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
	
	removeById: function(id){
		Snippely.database.execute(this.Queries.remove, { id: id });
		Snippely.Snips.removeBySnippet(id);
	},
	
	removeByGroup: function(group_id){
		var callback = function(result){
			if (result.data) $each(result.data, function(snippet){
				Snippely.Snips.removeBySnippet(snippet.id);
			}, this);
			
			Snippely.database.execute(this.Queries.removeByGroup, { group_id: group_id });
		}.bind(this);
		
		Snippely.database.execute(this.Queries.select, callback, { group_id: group_id });
	},
	
	redraw: function(){
		this.elements.removeClass('odd');
		this.list.getElements(':odd').addClass('odd');
		Snippely.Snippet.hide();
	}
	
};

//Snippets list related queries

Snippely.Snippets.Queries = {
	
	select: "SELECT id, title FROM snippets WHERE group_id = :group_id ORDER BY UPPER(title) ASC",
	
	insert: "INSERT INTO snippets (group_id, title, description) VALUES (:group_id, 'New Snippet', 'Description')",
	
	remove: "DELETE FROM snippets WHERE id = :id",
	
	update: "UPDATE snippets SET title = :title WHERE id = :id",
	
	removeByGroup: "DELETE FROM snippets WHERE group_id = :group_id"
	
};