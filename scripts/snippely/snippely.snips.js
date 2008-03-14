Snippely.Snips = {
	
	initialize: function(){
		this.container = $('snippet-snips');
	},
	
	load: function(id){
		var callback = function(result){
			var snips = [];
			if (result.data) $each(result.data, function(snip){
				snips.push({
					id: snip.id,
					type: snip.type.unescape(),
					content: snip.content.unescape()
				});
			});
			this.container.empty();
			this.build(snips);
		}.bind(this);
		
		Snippely.database.execute(this.Queries.select, callback, {
			snippet_id: id
		});
	},
	
	build: function(snips){
		var elements = snips.map(this.create, this);
		this.elements = $$(elements);
		
		this.sortables = new Sortables('snippet-snips', {
			clone: true,
			opacity: 0.3,
			handle: 'div.info',
			onComplete: function(){
				var order = this.sortables.serialize(function(element){
					return element.retrieve('snip').id;
				});
				this.updatePositions(order);
			}.bind(this)
		});
		
		Snippely.redraw();
	},
	
	create: function(snip){
		var type = (snip.type == 'note' ? 'div' : 'pre');
		
		var select = new Element('span', {
			'class': 'select-type',
			'text': snip.type
		});
		
		var info = new Element('div', {
			'class': 'info'
		}).adopt(select);
		
		var content = new Element(type, {
			'class': 'content',
			'html': snip.content.unescape()
		});
		
		var wrapper = new Element('div', {
			'class': snip.type + ' snip'
		}).adopt(info, content);
		
		select.addEvent('mousedown', function(event){
			this.active = wrapper;
			var items = Snippely.Menus.brushMenu.items;
			for (var item in items) items[item].checked = !!(item == snip.type);
			Snippely.Menus.brushMenu.display(event.client);
			event.stop();
		}.bind(this));
		
		new Editable(content, {
			enter: true,
			wrapper: wrapper,
			activation: 'mousedown',
			onBlur: this.save.bind(this)
		});
		
		wrapper.store('snip', snip);
		wrapper.store('select', select);
		content.store('snip:id', snip.id);
		
		this.container.adopt(wrapper);
		return wrapper;
	},
	
	add: function(type){
		var snippet = Snippely.Snippets.selected;
		if (!snippet) return;
		
		var position = this.elements.length;
		var content = 'Some Content';
		
		var callback = function(result){
			var element = this.create({
				id: result.lastInsertRowID,
				type: type,
				content: content
			});
			this.sortables.addItems(element);
			this.elements.push(element);
			Snippely.redraw();
		}.bind(this);
		
		Snippely.database.execute(this.Queries.insert, callback, {
			type: type,
			content: content,
			position: position,
			snippet_id: snippet.retrieve('snippet:id')
		});
	},
	
	save: function(element){
		Snippely.database.execute(this.Queries.update, {
			id: element.retrieve('snip:id'),
			content: element.get('html').escape()
		});
	},
	
	remove: function(element){
		this.removeById(element.retrieve('snip:id'));
		element.destroy();
	},
	
	//remove helpers
	
	removeById: function(id){
		Snippely.database.execute(this.Queries.remove, { id: id });
	},
	
	removeBySnippet: function(snippet_id, callback){
		Snippely.database.execute(this.Queries.removeBySnippet, { snippet_id: snippet_id });
	},
	
	//update helpers
	
	updateType: function(type){
		if (!this.active) return;
		var snip = this.active.retrieve('snip');
		var select = this.active.retrieve('select');
		var callback = function(){
			select.set('text', type);
			snip.type = type;
		}.bind(this);
		
		Snippely.database.execute(this.Queries.updateType, callback, { id: snip.id, type: type });
	},
	
	updatePositions: function(order){
		order.each(function(id, position){
			Snippely.database.execute(this.Queries.updatePosition, { id: id, position: position });
		}, this);
	}
	
};

//Snip related queries

Snippely.Snips.Queries = {
	
	select: "SELECT * FROM snips WHERE snippet_id = :snippet_id ORDER BY position ASC",
	
	insert: "INSERT INTO snips (snippet_id, position, type, content) VALUES (:snippet_id, :position, :type, :content)",
	
	remove: "DELETE FROM snips WHERE id = :id",
	
	update: "UPDATE snips SET content = :content WHERE id = :id",
	
	updateType: "UPDATE snips SET type = :type WHERE id = :id",
	
	updatePosition: "UPDATE snips SET position = :position WHERE id = :id",
	
	removeBySnippet: "DELETE FROM snips WHERE snippet_id = :snippet_id"
	
};