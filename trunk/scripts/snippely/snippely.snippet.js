var SNIPPET = {
	title: 'This is still static',
	description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur consectetuer, elit quis gravida mollis, ligula sem cursus leo, lacinia rhoncus mi urna eget felis. Nam non felis id dolor egestas iaculis.',
	snips: [
		{ id: 1, type: 'javascript', code: true, content: 'Cras eget eros. Ut enim purus, scelerisque in, eleifend ut, tristique id, elit. Integer sapien. Proin nunc massa, auctor at, fermentum placerat, pulvinar sit amet, enim. Phasellus consequat lobortis nisl. Curabitur sed felis. Donec ultrices, libero at rhoncus blandit, lacus risus dapibus mi, quis fermentum velit erat volutpat lectus. Sed accumsan feugiat nulla. Ut in erat eu nisi sagittis blandit. Ut mauris ligula, pretium in, bibendum ac, bibendum eget, purus. In erat libero, hendrerit ac, faucibus a, pretium nec, diam. Vestibulum nisi. Curabitur tincidunt. Cras elementum justo.' },
		{ id: 2, type: 'php', code: true, content: 'Donec tincidunt ultricies risus. Donec tempor lacus id sem. Fusce aliquam, pede sed accumsan dapibus, mauris nisi faucibus purus, ut elementum dui arcu molestie tortor. Nunc sagittis iaculis eros. Quisque sodales ipsum et felis. Nulla facilisi. Nulla in mauris in purus condimentum ornare. Phasellus porta ante a purus. In quis diam. Curabitur non leo. Sed facilisis odio condimentum ante. Nam tempor feugiat sem. Praesent sit amet libero sit amet dolor consequat venenatis.' },
		{ id: 3, type: 'note', code: false, content: 'Nulla facilisi. Duis sem tellus, laoreet quis, hendrerit id, faucibus vel, augue. In hac habitasse platea dictumst. Aenean pretium cursus odio. Phasellus ac libero aliquet enim bibendum condimentum. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam posuere sodales pede. Vivamus porttitor libero nec pede feugiat consectetuer. Fusce vitae risus eu tortor pharetra dictum. Vivamus sit amet dui. Phasellus at nibh. Curabitur diam justo, convallis non, cursus eu, facilisis non, leo.' }
	]
};

Snippely.Snippet = {
	
	//set up properties and perform actions for initial load
	
	initialize: function(){
		this.container = $('snippet-container');
		this.title = $('snippet-title');
		this.description = $('snippet-description');
		this.snips = $('snippet-snips');
	},

	//load a snippet from the database based on id
	
	load: function(id){
		var sql = "SELECT * FROM snippets WHERE id = " + id;
		var callback = function(result){
			var data = result.data && result.data[0];
			if (!data) return;
			var snippet = {
				id: data.id,
				title: data.title.unescape(),
				description: data.description.unescape()
			};
			this.buildMeta(snippet);
		}.bind(this);
		
		Snippely.database.execute(sql, callback);
	},
	
	buildMeta: function(snippet){
		this.container.setStyle('display', (snippet ? '' : 'none'));
		if (!snippet) return;
		
		this.id = snippet.id;
		
		this.snips.empty();
		this.title.set('text', snippet.title);
		this.description.set('text', snippet.description);
		
		new Editable(this.title, {
			onBlur: this.saveTitle.bind(this)
		});
		
		new Editable(this.description, {
			enter: true,
			onBlur: this.saveDescription.bind(this)
		});
	},
	
	buildSnips: function(snips){
		snippet.snips.each(function(snip){
			var type = snip.type + (snip.code ? ' code' : '');
			var info = new Element('div', {'class': 'info', 'text': type});
			var content = new Element('div', {'class': 'content', 'text': snip.content.trim()}).store('snip:id', snip.id);
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
			
			var wrapper = new Element('div', {'class': snippet.type + ' snip'}).adopt(info, content);
			new Editable(content, {
				enter: true,
				wrapper: wrapper,
				activation: 'mousedown',
				onBlur: this.save.bind(this)
			});
			
			this.snips.adopt(wrapper);
		}, this);
		
		this.sortables = new Sortables('snippet-snips', {
			clone: true,
			opacity: 0.3,
			handle: 'div.info'
		});
		
		Snippely.redraw();
	},
	
	saveTitle: function(element){
		var id = this.id;
		var title = element.get('text');
		var sql = "UPDATE snippets SET title = '" + title.escape() + "' WHERE id = " + id;
		var callback = function(){
			var snippet = $('snippet_' + id);
			if (snippet) snippet.set('text', title);
		};
		
		Snippely.database.execute(sql, callback);
	},
	
	saveDescription: function(element){
		var id = this.id;
		var description = element.get('text');
		var sql = "UPDATE snippets SET description = '" + description.escape() + "' WHERE id = " + id;
		
		Snippely.database.execute(sql);
	},
	
	saveSnip: function(element){
		var id = element.retrieve('snip:id');
		var text = element.get('text');
		//TODO - save this snip to the database
	}

};
