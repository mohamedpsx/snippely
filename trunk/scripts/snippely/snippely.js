// Aliases

var console = AIR.Introspector.Console;

// Configuration

Application.autoExit = true;

// Snippely Object

var Snippely = {
	
	initialize: function(){
		
		this.meta = $('meta');
		this.groups = $('groups');
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
				this.Groups.initialize();
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
			new ART.Menu.Item('Add Group...', {
				onSelect: this.Groups.add.bind(this.Groups)
			}),
			new ART.Menu.Item('Add Snippet...', {
				enabled: false,
				onSelect: this.Snippets.add.bind(this.Snippets)
			})
		);
		
		//action menu
		var actionMenu = new ART.Menu('ActionMenu').addItems(
			new ART.Menu.Item('Remove Group...', {
				enabled: false,
				onSelect: this.Groups.remove.bind(this.Groups)
			}),
			new ART.Menu.Item('Rename Group...', {
				enabled: false,
				onSelect: this.Groups.rename.bind(this.Groups)
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
		if (type == 'Group') this.Menus.addMenu.items['Add Snippet...'].enabled = state;
	},
	
	initializeLayout: function(){
		
		var redraw = this.redraw.bind(this);
		
		new Drag(this.groups, {
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

		this.groupsScrollbar = new ART.ScrollBar('groups', 'groups-wrap');
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
		
		var groupsWidth = ART.retrieve('groups:width') || 200;
		this.groups.setStyle('width', groupsWidth);
		
		var snippetsHeight = ART.retrieve('snippets:height');
		snippetsHeight = (snippetsHeight != undefined) ? snippetsHeight : 0;
		
		this.snippets.setStyle('height', snippetsHeight);
	},
	
	storeProperties: function(){
		ART.store('window:y', nativeWindow.y);
		ART.store('window:x', nativeWindow.x);
		ART.store('window:height', nativeWindow.height);
		ART.store('window:width', nativeWindow.width);
		
		ART.store('groups:width', this.groups.clientWidth);
		ART.store('groups:active', this.Groups.id);
		
		ART.store('snippets:height', this.snippets.offsetHeight || 0);
		ART.store('snippet:active', this.Snippets.id);
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
		var left = this.groups.offsetWidth;
		$$(this.snippets, this.topResizer, this.meta, this.snippet).setStyle('left', left);		
		this.footer.setStyle('width', this.groups.clientWidth);
		
		//height
		var sniptoph = this.snippets.offsetHeight + this.topResizer.offsetHeight;
		var winh = window.getHeight();
		if (sniptoph >= winh) this.snippets.setStyle('height', winh - this.topResizer.offsetHeight);
		
		//top
		this.topResizer.setStyle('top', this.snippets.offsetHeight);		
		this.meta.setStyle('top', this.snippets.offsetHeight + this.topResizer.offsetHeight);
		this.snippet.setStyle('top', this.snippets.offsetHeight + this.topResizer.offsetHeight + this.meta.offsetHeight);
		
		//scrollbars
		this.groupsScrollbar.update();
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