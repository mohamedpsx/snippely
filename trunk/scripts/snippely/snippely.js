// Aliases

var console = AIR.Introspector.Console;

// Configuration

Application.autoExit = true;

// Snippely Object

var Snippely = {
	
	initialize: function(){
		
		this.meta = $('meta');
		this.tags = $('tags');
		this.footer = $('footer');
		this.snippet = $('snippet');
		this.snippets = $('snippets');
		this.topResizer = $('top-resizer');
		this.leftResizer = $('left-resizer');
		
		this.initializeMenus();
		this.initializeMetas();
		this.initializeLayout();
		
		this.database = new Snippely.Database({
			onOpen: function(database){
				this.Tags.initialize();
				this.Snips.initialize();
				this.Snippet.initialize();
				this.Snippets.initialize();
			}.bind(this)
		});
		
		this.activate();
	},
	
	initializeMenus: function(){
		//main menus
		var mainMenu = new ART.Menu('MainMenu');
		var fileMenu = new ART.Menu('File').addItems(
			new ART.Menu.Item('Save', {shortcut: 'command+s'}),
			new ART.Menu.Item('Load', {shortcut: 'command+l'})
		);
		mainMenu.addMenu(fileMenu);
		
		//add menu
		var addMenu = new ART.Menu('AddMenu').addItems(
			new ART.Menu.Item('Add Tag...', {
				onSelect: this.Tags.add.bind(this.Tags)
			}),
			new ART.Menu.Item('Add Snippet...', {
				enabled: false,
				onSelect: this.Snippets.add.bind(this.Snippets)
			})
		);
		
		//action menu
		var actionMenu = new ART.Menu('ActionMenu').addItems(
			new ART.Menu.Item('Remove Tag...', {
				enabled: false,
				onSelect: this.Tags.remove.bind(this.Tags)
			}),
			new ART.Menu.Item('Rename Tag...', {
				enabled: false,
				onSelect: this.Tags.rename.bind(this.Tags)
			}),
			new ART.Menu.Item('Separator', {
				separator: true
			}),
			new ART.Menu.Item('Remove Snippet...', {
				enabled: false,
				onSelect: this.Snippets.remove.bind(this.Snippets)
			}),
			new ART.Menu.Item('Rename Snippet...', {
				enabled: false,
				onSelect: this.Snippets.rename.bind(this.Snippets)
			})
		);
		
		//brush menu
		var brushMenu = new ART.Menu('BrushMenu');
		for (var name in Brushes) (function(name){
			brushMenu.addItem(new ART.Menu.Item(name, {
				onSelect: Snippely.Snips.updateType.bind(Snippely.Snips, name)
			}));
			if (name == "Note") brushMenu.addItem(new ART.Menu.Item('Separator', {
				separator: true
			}));
		})(name);
		
		$('button-add').addEvent('mousedown', function(event){
			this.addClass('active');
			addMenu.display(event.client);
			this.removeClass('active');
			event.stop();
		});
		
		$('button-action').addEvent('mousedown', function(event){
			this.addClass('active');
			actionMenu.display(event.client);
			this.removeClass('active');
			event.stop();
		});
		
		this.Menus = {
			addMenu: addMenu,
			actionMenu: actionMenu,
			brushMenu: brushMenu
		};
	},
	
	toggleMenus: function(type, state){
		this.Menus.actionMenu.items['Remove ' + type + '...'].enabled = state;
		this.Menus.actionMenu.items['Rename ' + type + '...'].enabled = state;
		if (type == 'Tag') this.Menus.addMenu.items['Add Snippet...'].enabled = state;
	},
	
	initializeLayout: function(){
		
		var redraw = this.redraw.bind(this);
		
		new Drag(this.tags, {
			modifiers: {y: null, x: 'width'},
			handle: this.leftResizer,
			limit: {x: [150, 300]},
			onDrag: redraw
		});

		new Drag(this.snippets, {
			modifiers: {y: 'height', x: null},
			handle: this.topResizer,
			limit: {y: [0, function(){
				return window.getHeight() - this.topResizer.getHeight();
				}.bind(this)
			]},
			onDrag: redraw
		});
		
		nativeWindow.addEventListener('resize', redraw);
		nativeWindow.addEventListener('activate', redraw);
		nativeWindow.addEventListener('deactivate', redraw);
		nativeWindow.addEventListener('activate', this.focus);
		nativeWindow.addEventListener('deactivate', this.blur);

		this.tagsScrollbar = new ART.ScrollBar('tags', 'tags-wrap');
		this.snippetScrollbar = new ART.ScrollBar('snippet', 'snippet-wrap');
		this.snippetsScrollbar = new ART.ScrollBar('snippets', 'snippets-wrap');
		
		this.retrieveProperties();
		
		nativeWindow.addEventListener('closing', this.storeProperties.bind(this));

		this.redraw();
	},
	
	retrieveProperties: function(){
		var top = ART.retrieve('window:y') || 100;
		var left = ART.retrieve('window:x') || 100;
		var height = ART.retrieve('window:height') || 480;
		var width = ART.retrieve('window:width') || 640;
		
		nativeWindow.height = height;
		nativeWindow.width = width;
		nativeWindow.x = left;
		nativeWindow.y = top;
		
		var tagsWidth = ART.retrieve('tags:width') || 200;
		this.tags.setStyle('width', tagsWidth);
		
		var snippetsHeight = ART.retrieve('snippets:height');
		snippetsHeight = snippetsHeight || 0;
		
		this.snippets.setStyle('height', snippetsHeight);
	},
	
	storeProperties: function(){
		var tag = this.Tags.selected;
		var snippet = this.Snippets.selected;
		tag = tag ? tag.retrieve('tag:id') : 0;
		snippet = snippet ? snippet.retrieve('snippet:id') : 0;
		
		ART.store('window:y', nativeWindow.y);
		ART.store('window:x', nativeWindow.x);
		ART.store('window:height', nativeWindow.height);
		ART.store('window:width', nativeWindow.width);
		
		ART.store('tags:width', this.tags.clientWidth);
		ART.store('tags:active', tag);
		
		ART.store('snippets:height', this.snippets.offsetHeight || 0);
		ART.store('snippets:active', snippet);
	},
	
	initializeMetas: function(){
		var metaButtons = $$('#meta .button');
		metaButtons.addEvent('mousedown', function(){
			this.addClass('active');
		});
		document.addEvent('mouseup', function(){
			metaButtons.removeClass('active');
		});
		
		$('add-code').addEvent('click', this.Snips.add.bind(this.Snips, 'Plain Text'));
		$('add-note').addEvent('click', this.Snips.add.bind(this.Snips, 'Note'));
	},
	
	redraw: function(){
		
		//width
		
		var left = this.tags.offsetWidth;
		$$(this.snippets, this.topResizer, this.meta, this.snippet).setStyle('left', left);		
		this.footer.setStyle('width', this.tags.clientWidth);
		
		//height
		
		var sniptoph = this.snippets.offsetHeight + this.topResizer.offsetHeight;
		var winh = window.getHeight();
		if (sniptoph >= winh) this.snippets.setStyle('height', winh - this.topResizer.offsetHeight);
		
		//top

		this.topResizer.setStyle('top', this.snippets.offsetHeight);		
		this.meta.setStyle('top', this.snippets.offsetHeight + this.topResizer.offsetHeight);
		this.snippet.setStyle('top', this.snippets.offsetHeight + this.topResizer.offsetHeight + this.meta.offsetHeight);
		
		//scrollbars
		
		this.tagsScrollbar.update();
		this.snippetScrollbar.update();
		this.snippetsScrollbar.update();
	},
	
	activate: function(){
		(function(){
			nativeWindow.visible = true;
			nativeWindow.activate();
		}).delay(100);
	},

	focus: function(){
		document.body.id = 'focus';
	},
	
	blur: function(){
		document.body.id = 'blur';
	}
	
};

window.addEvent('load', Snippely.initialize.bind(Snippely));