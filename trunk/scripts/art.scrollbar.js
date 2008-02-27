ART.ScrollBar = new Class({
	
	Implements: [Events, Options],

	options: {
		id: null,
		className: null,
		
		autoHide: true,
		
		minThumbSize: 30,
		wheel: 8,
		
		morph: {duration: 200, link: 'cancel'}
	},

	initialize: function(content, options){
		this.setOptions(options);
		
		this.content = $(content);
		
		this.document = this.content.getDocument();
		
		this.container = new Element('div').addClass('art-scrollbar').inject(this.content);
		
		if (this.options.id) this.container.set('id', this.options.id);
		if (this.options.className) this.container.addClass(this.options.className);
		
		this.track = new Element('div').addClass('art-scrollbar-track').inject(this.container);
		
		if (this.options.autoHide){
			this.hidden = true;
			this.container.setStyle('opacity', 0);
		}
		
		this.thumb = new Element('div', {
			'class': 'art-scrollbar-thumb'
		}).inject(this.track);
		
		this.paintTop = new Element('div', {'class': 'art-scrollbar-paint-top'}).inject(this.thumb);
		this.paintCenter = new Element('div', {'class': 'art-scrollbar-paint-center'}).inject(this.thumb);
		this.paintBottom = new Element('div', {'class': 'art-scrollbar-paint-bottom'}).inject(this.thumb);
		
		this.scroller = new Fx.Scroll(this.content, this.options.morph);
		
		this.morphContainer = new Fx.Morph(this.container, this.options.morph);
		this.morphThumb = new Fx.Morph(this.thumb, this.options.morph);
		
		this.selection = (Browser.Engine.trident) ? 'selectstart' : 'mousedown';
		
		this.bound = {
			start: this.start.bind(this),
			end: this.end.bind(this),
			drag: this.drag.bind(this),
			wheel: this.wheel.bind(this),
			page: this.page.bind(this),
			show: this.show.bind(this),
			hide: this.hide.bind(this),
			stopSelection: $lambda(false)
		};
		
		this.mousedown = false;

		this.position = {};
		this.mouse = {};
		
		this.update();
		this.attach();
	},

	attach: function(){
		if (this.options.autoHide){
			this.content.addEvent('mouseenter', this.bound.show);
			this.content.addEvent('mouseleave', this.bound.hide);
		}
		
		this.thumb.addEvent('mousedown', this.bound.start);
		if (this.options.wheel) this.content.addEvent('mousewheel', this.bound.wheel);
		this.container.addEvent('mouseup', this.bound.page);
	},
	
	show: function(force){
		if (this.hidden && !this.mousedown && (force === true || this.check())){
			this.hidden = false;
			this.morphContainer.start({opacity: 1});
		}
	},
	
	hide: function(force){
		if (!this.hidden && !this.mousedown && (force === true || this.check())){
			this.hidden = true;
			this.morphContainer.start({opacity: 0});
		}
	},
	
	check: function(){
		return !(this.thumbSize == this.trackSize);
	},

	update: function(){

		this.contentSize = this.content.offsetHeight;
		this.contentScrollSize = this.content.scrollHeight;
		
		this.trackSize = this.track.offsetHeight;
		
		this.contentRatio = this.contentSize / this.contentScrollSize;
		
		this.thumbSize = (this.trackSize * this.contentRatio).limit(this.options.minThumbSize, this.trackSize);
		
		this.availableTrackScroll = this.trackSize - this.thumbSize;
		
		this.availableContentScroll = this.contentScrollSize - this.contentSize;
		
		this.scrollRatio = (this.availableContentScroll) / (this.availableTrackScroll);

		this.thumb.setStyle('height', (this.thumbSize));
		
		if (!this.check()){
			this.hide(true);
		} else {
			
			this.paintCenter.setStyles({
				height: this.thumb.offsetHeight - this.paintTop.offsetHeight - this.paintBottom.offsetHeight
			});
			
			if (!this.options.autoHide) this.show(true);
		}
		
		this.updateThumbFromContentScroll();
		this.updateContentFromThumbPosition();
	},
	
	updateThumbFromContentScroll: function(scroll){
		var scrollValue = $pick(scroll, this.content.scrollTop);
		this.position.now = (scrollValue / this.scrollRatio).limit(0, (this.trackSize - this.thumbSize));
		if ($defined(scroll)) this.morphThumb.start({top: this.position.now});
		else this.thumb.setStyles({top: this.position.now});
	},

	updateContentFromThumbPosition: function(){
		this.content.scrollTop = this.position.now * this.scrollRatio;
	},

	wheel: function(event){
		this.content.scrollTop -= event.wheel.round() * this.options.wheel;
		this.updateThumbFromContentScroll();
	},

	page: function(option){
		if (this.mousedown) return;
		var height = this.content.offsetHeight;
		var page = (($type(option) == 'event' && option.page.y > this.thumb.getPosition().y) || option == 'down') ? height : -height;
		var scroll = this.content.scrollTop + page;
		this.scroller.start(0, scroll);
		this.updateThumbFromContentScroll(scroll);
	},

	start: function(event){
		this.mousedown = true;
		this.mouse.start = event.page.y;
		this.position.start = this.thumb.getStyle('top').toInt();
		document.addEvent('mousemove', this.bound.drag);
		document.addEvent('mouseup', this.bound.end);
		
		this.document.addEvent(this.selection, this.bound.stopSelection);
	},

	end: function(event){
		this.mousedown = false;
		if (this.options.autoHide && event.target != this.content && !this.content.hasChild(event.target)) this.hide();
		this.document.removeEvent('mousemove', this.bound.drag);
		this.document.removeEvent('mouseup', this.bound.end);
		this.document.removeEvent(this.selection, this.bound.stopSelection);
	},

	drag: function(event){
		this.mouse.now = event.page.y;
		this.position.now = (this.position.start + (this.mouse.now - this.mouse.start));
		this.updateContentFromThumbPosition();
		this.updateThumbFromContentScroll();
	}

});