Snippely.Groups = {

	initialize: function(){
		this.list = $('groups-list');
		$('groups').addEvent('click', this.deselect.bind(this));
		this.id = ART.retrieve('groups:active') || 0;
		this.load();
	},
	
	load: function(){
		var callback = function(result){
			var groups = result.data || [];
			this.build(groups);
		}.bind(this);
		
		Snippely.database.execute(this.Queries.select, callback);
	},
	
	build: function(groups){
		this.list.empty();
		var elements = groups.map(this.create, this);
		this.elements = $$(elements);
		this.select($('group_' + this.id));
		Snippely.redraw();
	},

	create: function(group){
		var element = new Element('li', {
			id: 'group_' + group.id,
			text: group.name
		});
		
		new Editable(element, { onBlur: this.update.bind(this) });
		
		this.list.adopt(element.addEvents({
			click: function(event){
				event.stop();
				this.select(element);
			}.bind(this),
			mousedown: function(event){ event.stopPropagation(); }
		}).store('group:id', group.id));
		
		return element;
	},
	
	add: function(){
		var callback = function(result){
			var element = this.create({name: 'New Group', id: result.lastInsertRowID});
			this.elements.push(element);
			this.select(element);
			Snippely.redraw();
			element.fireEvent('dblclick');
		}.bind(this);
		Snippely.database.execute(this.Queries.insert, callback);
	},
	
	update: function(element){
		Snippely.database.execute(this.Queries.update, this.load.bind(this), {
			id: element.retrieve('group:id'),
			name: element.get('text')
		});
	},
	
	select: function(element){
		if (!element || element == this.selected) return;
		this.elements.removeClass('selected');
		this.selected = element.addClass('selected');
		this.id = element.retrieve('group:id');
		Snippely.Snippets.deselect(true);
		Snippely.Snippets.load(this.id);
		Snippely.toggleMenus('Group', true);
	},
	
	deselect: function(){
		this.elements.removeClass('selected');
		this.selected = this.id = null;
		Snippely.Snippets.deselect(true);
		Snippely.toggleMenus('Group', false);
	},
	
	rename: function(){
		if (!this.selected) return;
		this.selected.fireEvent('dblclick');
	},
	
	remove: function(){
		if (!this.selected || !confirm("Are you sure you want to remove this Group and all of it's Snippets?")) return;
		this.removeById(this.selected.retrieve('group:id'));
		this.selected.destroy();
		this.deselect();
	},
	
	removeById: function(id){
		Snippely.database.execute(this.Queries.remove, { id: id });
		Snippely.Snippets.removeByGroup(id);
	}
	
};

//Group related queries

Snippely.Groups.Queries = {
	
	select: "SELECT * FROM groups ORDER BY UPPER(name) ASC",
	
	insert: "INSERT INTO groups (name) VALUES ('New Group')",
	
	remove: "DELETE FROM groups WHERE id = :id",
	
	update: "UPDATE groups SET name = :name WHERE id = :id"
	
};