Snippely.Snips = {
	
	initialize: function(){
		this.container = $('snippet-snips');
	},
	
	load: function(id){
		var callback = function(result){
			var snips = result.data || [];
			this.container.empty();
			this.build(snips);
		}.bind(this);
		
		Snippely.database.execute(this.Queries.select, callback, { snippet_id: id });
	},
	
	build: function(snips){
		var elements = snips.map(this.create, this);
		this.elements = $$(elements);
		
		this.sortables = new Sortables('snippet-snips', {
			clone: true,
			opacity: 0,
			handle: 'div.info',
			onStart: function(){
				this.element.addClass('sorting');
				Snippely.redraw();
				this.drag.options.modifiers = {x: false, y: 'top'};
				this.clone.addClass('sorting').setStyles({'z-index': 1000, 'width': this.element.getStyle('width')});
			},
			onComplete: function(element){
				if (element) element.removeClass('sorting');
				Snippely.redraw();
				this.updatePositions(this.sortables.serialize(function(element){
					return element.retrieve('snip:id');
				}));
			}.bind(this)
		});
		
		Snippely.redraw();
	},
	
	create: function(snip){
		var wrapper = new Element('div', {'class': ((snip.type == 'Note') ? 'note' : 'code') + ' snip'});
		var info = new Element('div', {'class': 'info'}).inject(wrapper);
		var content = new Element('div', {'class': 'content', 'text': snip.content}).paint(snip.type).inject(wrapper);
		var remove = new Element('span', {'class': 'remove', 'text': 'remove'}).inject(info);
		var select = new Element('span', {'class': 'select', 'text': snip.type}).inject(info);
		
		var editable = new Editable(content, {
			code: true,
			enter: true,
			wrapper: wrapper,
			activation: 'mousedown',
			onBlur: function(element){
				element.paint(wrapper.retrieve('snip:type'));
				this.updateContent(content, wrapper);
			}.bind(this)
		});
		
		remove.addEvent('mousedown', function(event){
			this.remove(wrapper);
			event.stop();
		}.bind(this));
		
		select.addEvent('mousedown', function(event){
			this.active = wrapper;
			var items = Snippely.Menus.brushMenu.items;
			for (var item in items) items[item].checked = !!(item == wrapper.retrieve('snip:type'));
			Snippely.Menus.brushMenu.display(event.client);
			event.stop();
		}.bind(this));
		
		wrapper.store('select', select);
		wrapper.store('content', content);
		wrapper.store('snip:id', snip.id);
		wrapper.store('snip:type', snip.type);
		
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
	
	remove: function(element){
		this.removeById(element.retrieve('snip:id'));
		this.sortables.removeItems(element).destroy();
		this.sortables.fireEvent('onComplete');
	},
	
	removeById: function(id){
		Snippely.database.execute(this.Queries.remove, { id: id });
	},
	
	removeBySnippet: function(snippet_id){
		Snippely.database.execute(this.Queries.removeBySnippet, { snippet_id: snippet_id });
	},
	
	updateType: function(type){
		var wrapper = this.active;
		if (!wrapper) return;
		var id = wrapper.retrieve('snip:id');
		var content = wrapper.retrieve('content');
		var callback = function(){
			wrapper.set('class', ((type == 'Note') ? 'note' : 'code') + ' snip');
			wrapper.retrieve('select').set('text', type);
			wrapper.store('snip:type', type);
			content.paint(type);
		}.bind(this);
		
		Snippely.database.execute(this.Queries.updateType, callback, { id: id, type: type });
		this.updateContent(content, wrapper);
	},
	
	updateContent: function(content, wrapper){
		Snippely.database.execute(this.Queries.updateContent, {
			id: wrapper.retrieve('snip:id'),
			content: content.get('text')
		});
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
	
	updateType: "UPDATE snips SET type = :type WHERE id = :id",
	
	updateContent: "UPDATE snips SET content = :content WHERE id = :id",
	
	updatePosition: "UPDATE snips SET position = :position WHERE id = :id",
	
	removeBySnippet: "DELETE FROM snips WHERE snippet_id = :snippet_id"
	
};

//snip content history for later
/*
content.history = [content.get('html')];
content.addEvent('keydown', function(event){
	if (event.meta && event.key == 'z'){
		event.preventDefault();
		var start = this.selectionStart;
		var previous = (this.history.length > 1) ? this.history.pop() : this.history[0];
		this.set('html', previous);
	} else {
		if (this.get('html') != this.history.getLast()) this.history.push(this.get('html'));
	}
});
*/