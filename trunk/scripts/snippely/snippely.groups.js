Snippely.Groups = {

	initialize: function(){
		this.list = $('groups-list');
		this.id = ART.retrieve('groups:active') || 0;
		this.buildMenu();
		this.load();
		
		$('groups').addEvent('mousedown', function(event){
			this[event.rightClick ? 'showMenu' : 'deselect'](event);
		}.bind(this));
	},
	
	load: function(insert){
		var focus = insert && insert.lastInsertRowID;
		var callback = function(result){
			var groups = result.data || [];
			this.build(groups, focus);
		}.bind(this);
		
		Snippely.database.execute(this.Queries.select, callback);
	},
	
	build: function(groups, focus){
		this.list.empty();
		this.elements = $$(groups.map(this.create, this));
		this.select($('group_' + (focus || this.id)), focus);
		Snippely.redraw();
	},

	create: function(group){
		var element = new Element('li', {
			id: 'group_' + group.id,
			text: group.name
		}).store('group:id', group.id);
		
		element.addEvent('mousedown', function(event){
			this.select(element);
			if (!event.rightClick) event.stopPropagation();
		}.bind(this));
		
		new Editable(element, { onBlur: this.update.bind(this) });
		
		return element.inject(this.list);
	},
	
	add: function(){
		Snippely.database.execute(this.Queries.insert, this.load.bind(this));
	},
	
	update: function(element){
		Snippely.database.execute(this.Queries.update, this.load.bind(this), {
			id: element.retrieve('group:id'),
			name: element.get('text')
		});
	},
	
	select: function(element, focus){
		if (!element || element == this.selected) return;
		this.elements.removeClass('selected');
		this.selected = element.addClass('selected');
		this.id = element.retrieve('group:id');
		Snippely.Snippets.deselect(true);
		Snippely.Snippets.load();
		Snippely.toggleMenus('Group', true);
		if (focus) element.fireEvent('dblclick');
	},
	
	deselect: function(){
		if (!this.selected) return;
		if (this.selected.retrieve('editable').editing()) this.selected.blur();
		else {
			this.selected = this.id = null;
			this.elements.removeClass('selected');
			Snippely.Snippets.deselect();
			Snippely.Snippets.hide();
			Snippely.toggleMenus('Group', false);
		}
	},
	
	rename: function(){
		if (!this.selected) return;
		this.selected.fireEvent.delay(100, this.selected, 'dblclick');
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
	},
	
	// right click menu
	
	buildMenu: function(){
		this.menu = new ART.Menu('GroupsMenu').addItems(
			new ART.Menu.Item('Add Group...', { onSelect: this.add.bind(this) }),
			new ART.Menu.Item('Remove Group...', { onSelect: this.remove.bind(this) }),
			new ART.Menu.Item('Rename Group...', { onSelect: this.rename.bind(this) })
		);
	},
	
	showMenu: function(event){
		var enabled = !!(this.selected);
		this.menu.items['Remove Group...'].enabled = enabled;
		this.menu.items['Rename Group...'].enabled = enabled;
		this.menu.display(event.client);
		event.stop();
	}
	
};

//Group related queries

Snippely.Groups.Queries = {
	
	select: "SELECT * FROM groups ORDER BY UPPER(name) ASC",
	
	insert: "INSERT INTO groups (name) VALUES ('New Group')",
	
	remove: "DELETE FROM groups WHERE id = :id",
	
	update: "UPDATE groups SET name = :name WHERE id = :id"
	
};