Snippely.Snippet = {

	initialize: function(){
		this.container = $('snippet-container');
		this.title = $('snippet-title');
		this.description = $('snippet-description');
		this.snips = $('snippet-snips');
	},

	load: function(snippet){
		this.container.setStyle('display', (snippet ? '' : 'none'));
		if (!snippet) return;
		
		this.snips.empty();
		this.title.set('text', snippet.title);
		this.description.set('text', snippet.description);
		
		new Editable(this.title);
		new Editable(this.description, {enter: true});
		
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
		
		//initialize sortables
		new Sortables('snippet-snips', {
			clone: true,
			opacity: 0.3,
			handle: 'div.info'
		});
		
		Snippely.redraw();
	},
	
	save: function(element){
		var id = element.retrieve('snip:id');
		var text = element.get('text');
		//TODO - save this snip to the database
	}

};
