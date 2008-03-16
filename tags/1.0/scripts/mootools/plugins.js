// Content Editable Class

var Editable = new Class({
	
	Implements: [Events, Options],
	
	options: {/*
		onEdit: $empty,
		onBlur: $empty,*/
		code: false,
		enter: false,
		wrapper: false,
		className: 'editing',
		activation: 'dblclick'
	},
	
	initialize: function(element, options){
		this.setOptions(options);
		this.element = $(element);
		this.wrapper = this.options.wrapper || this.element;
		this.element.addEvent(this.options.activation, this.edit.bind(this));
		this.element.addEvent('keydown', this.process.bind(this));
		this.element.addEvent('blur', this.blur.bind(this));
		this.element.store('editable', this);
	},
	
	edit: function(){
		this.element.contentEditable = true;
		this.wrapper.addClass(this.options.className).focus();
		this.fireEvent('onEdit', this.element);
	},
	
	blur: function(){
		this.element.contentEditable = false;
		this.wrapper.removeClass(this.options.className);
		this.fireEvent('onBlur', this.element);
	},
	
	process: function(event, node){
		var key = event.key, meta = event.meta;
		if (meta && (key == 's' || key == 'enter')) this.element.blur();
		else if (!this.options.enter && key == 'enter') this.element.blur();
		else if (!meta && this.options.code){
			var selection = window.getSelection();
			try {
				var range = selection.getRangeAt(0);
				if (!range) return;
				switch (key){
					case 'tab': node = document.createTextNode('\t'); break;
					case 'enter': node = document.createTextNode('\n'); break;
				}
				if (node){
					range.insertNode(node);
					selection.setPosition(node, 1);
					event.preventDefault();
				}
			}
			catch(e){};
		}
	}
	
});

// Content History Class

var History = new Class({
	
	Implements: [Events, Options],
	
	options: {
		steps: 15,
		property: 'text'
	},
	
	initialize: function(element, options){
		this.setOptions(options);
		this.element = $(element);
		this.element.addEvent('keydown', this.process.bind(this));
		this.reset();
	},
	
	current: function(){
		return this.element.get(this.options.property);
	},
	
	process: function(event){
		var content = this.current();
		if (event.meta && event.key == 'z'){
			event.preventDefault();
			this[event.shift ? 'redo' : 'undo'](content);
		} else if (!event.meta) {
			this.stack = this.stack.slice(0, this.index + 1);
			if (content != this.stack[this.index]){
				if (this.index >= this.options.steps - 1) this.stack.shift();
				this.stack.push(content);
				this.index = this.stack.length;
			}
		}
	},
	
	undo: function(content){
		this.index = (0).max(this.index - 1);
		this.element.set(this.options.property, this.stack[this.index]);
	},
	
	redo: function(content){
		this.index = (this.stack.length - 1).min(this.index + 1);
		this.element.set(this.options.property, this.stack[this.index]);
	},
	
	reset: function(){
		this.stack = [this.current()];
		this.index = 0;
	}
	
});