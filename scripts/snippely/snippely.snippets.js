Snippely.Snippets = {

	//load all snippets in a particular tag from the database

	load: function(tag_id){
		var sql = 'SELECT * FROM snippets WHERE tag_id = ' + tag_id;
		var callback = function(result){
			var snippets = [];
			if (result.data) $each(result.data, function(snippet){
				snippets.push({id: snippet.id, title: snippet.title});
			});
			this.initialize(snippets);
		}.bind(this);
		
		Snippely.database.execute(sql, callback);
	},
	
	//initialize the snippets list from the snippets passed in
	
	initialize: function(snippets){
		this.list = $('snippets-list').empty();
		var elements = snippets.map(this.create, this);
		this.elements = $$(elements);
		this.redraw();
	},
	
	//create a snippet element and insert it into the snippets list
	
	create: function(snippet){
		var element = new Element('li', { text: snippet.title });
		new Editable(element, { onBlur: this.save.bind(this) });
		
		this.list.adopt(element.addEvents({
			click: this.select.bind(this, element),
			mousedown: function(event){ event.stopPropagation(); }
		}).store('snippet:id', snippet.id));
		
		return element;
	},
	
	//add a new snippet to the database and create an editable list item for it
	
	add: function(){
		var tag = Snippely.Tags.selected;
		if (!tag) return;
		var tag_id = tag.retrieve('tag:id');
		var sql = "INSERT INTO snippets (tag_id, title, description) VALUES (" + tag_id + ", 'New Snippet', 'Description')";
		var callback = function(result){
			var element = this.create({title: 'New Snippet', id: result.lastInsertRowID});
			this.elements.push(element);
			this.select(element);
			this.redraw();
			element.fireEvent('dblclick');
		}.bind(this);
		Snippely.database.execute(sql, callback);
	},
	
	//remove the currently selected snippet from the database and the snippets list
	
	remove: function(){
		if (!this.selected || !confirm("Are you sure you want to remove this Snippet?")) return;
		
		var id = this.selected.retrieve('snippet:id');
		var sql = "DELETE FROM snippets WHERE id = " + id;
		Snippely.database.execute(sql);
		
		//TODO - remove all this snippet's snips from the database
		this.selected.destroy();
	},
	
	//invoke the inline editor for the currently selected snippet
	
	rename: function(){
		if (!this.selected) return;
		this.selected.fireEvent('dblclick');
	},
	
	//save the title of a snippet to the database
	
	save: function(element){
		var id = element.retrieve('snippet:id');
		var title = element.get('text');
		var sql = "UPDATE snippets SET title = '" + title + "' WHERE id = " + id;
		//Snippely.Snippet.title.set('text', title);
		Snippely.database.execute(sql);
	},
	
	//select a snippet from the list and load it into the snippet viewer / editor
	
	select: function(element){
		this.elements.removeClass('selected');
		this.selected = element.addClass('selected');
		
		var id = element.retrieve('snippet:id');
		var snippet = SNIPPET[id]; //TODO - retrieve snippet from database
		Snippely.Snippet.load(snippet);
	},
	
	//zebra stripe the list and re-render the scrollbars
	
	redraw: function(){
		this.elements.removeClass('odd');
		this.list.getElements(':odd').addClass('odd');
		Snippely.redraw();
	}
	
};
