//Content Editable Class

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
		var key = event.key;
		if (event.meta && (key == 's' || key == 'enter')) this.element.blur();
		else if (!this.options.enter && key == 'enter') this.element.blur();
		else if (this.options.code){
			var selection = window.getSelection();
			var range = selection.getRangeAt(0);
			switch (key){
				case 'tab': node = document.createTextNode('\t'); break;
				case 'enter': node = document.createTextNode('\n'); break;
			}
			if (!node) return;
			range.insertNode(node);
			selection.setPosition(node, 1);
			event.preventDefault();
		}
	}
	
});
