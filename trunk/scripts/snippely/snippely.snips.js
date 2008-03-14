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
			opacity: 0,
			handle: 'div.info',
			onStart: function(){
				this.drag.options.modifiers = {x: false, y: 'top'};
				this.clone.setStyle('z-index', 1000);
			},
			onComplete: function(){
				var order = this.sortables.serialize(function(element){
					return element.retrieve('snip:id');
				});
				this.updatePositions(order);
			}.bind(this)
		});
		
		Snippely.redraw();
	},
	
	highlight: function(type, content, wrapper){

		var highlighted = content.retrieve('highlighted');
		
		if (highlighted){
			highlighted = highlighted.destroy();
			content.eliminate('highlighted');
		}
		
		if (type == 'Note'){
			content.setStyle('display', 'block');
			return;
		}
		
		content.setStyle('display', 'none');
		
		content.store('highlighted', new Highlighter(type).highlight(content.get('text')).addClass('content').inject(wrapper).addEvent('click', function(){
			this.destroy();
			content.eliminate('highlighted');
			content.setStyle('display', 'block').fireEvent('mousedown');
		}));
	},
	
	create: function(snip){
		var wrapper = new Element('div', {'class': ((snip.type == 'Note') ? 'note' : 'code') + ' snip'});
		var info = new Element('div', {'class': 'info'}).inject(wrapper);
		var content = new Element('div', {'class': 'content', 'html': snip.content.unescape()}).inject(wrapper);
		var select = new Element('span', {'class': 'select-type', 'text': snip.type}).inject(info);
		
		this.highlight(snip.type, content, wrapper);
		
		info.addEvent('dblclick', this.remove.bind(this, wrapper));
		
		select.addEvent('mousedown', function(event){
			this.active = wrapper;
			var items = Snippely.Menus.brushMenu.items;
			for (var item in items) items[item].checked = !!(item == wrapper.retrieve('snip:type'));
			Snippely.Menus.brushMenu.display(event.client);
			event.stop();
		}.bind(this));
		
		new Editable(content, {
			code: snip.type != 'Note',
			enter: true,
			wrapper: wrapper,
			activation: 'mousedown',
			onBlur: function(){
				this.updateContent(content, wrapper);
				var type = wrapper.retrieve('snip:type'); 
				this.highlight(type, content, wrapper);
			}.bind(this)
		});
		
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
	
	//remove helpers
	
	removeById: function(id){
		Snippely.database.execute(this.Queries.remove, { id: id });
	},
	
	removeBySnippet: function(snippet_id){
		Snippely.database.execute(this.Queries.removeBySnippet, { snippet_id: snippet_id });
	},
	
	//update helpers
	
	updateType: function(type){
		if (!this.active) return;
		var id = this.active.retrieve('snip:id');
		var callback = function(){
			this.active.store('snip:type', type);
			this.active.retrieve('select').set('text', type);
			this.active.set('class', ((type == 'Note') ? 'note' : 'code') + ' snip');
			this.highlight(type, this.active.retrieve('content'), this.active);
		}.bind(this);
		
		Snippely.database.execute(this.Queries.updateType, callback, { id: id, type: type });
	},
	
	updateContent: function(content, wrapper){
		Snippely.database.execute(this.Queries.updateContent, {
			id: wrapper.retrieve('snip:id'),
			content: content.get('html').escape()
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