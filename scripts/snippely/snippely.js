// Aliases

var console = AIR.Introspector.Console;

// Configuration

Application.autoExit = true;

// Temporary Data

var SNIPPET = {
	"1": {
		title: 'My First Snippet',
		description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur consectetuer, elit quis gravida mollis, ligula sem cursus leo, lacinia rhoncus mi urna eget felis. Nam non felis id dolor egestas iaculis.',
		snips: [
			{ id: 1, type: 'javascript', code: true, content: 'Cras eget eros. Ut enim purus, scelerisque in, eleifend ut, tristique id, elit. Integer sapien. Proin nunc massa, auctor at, fermentum placerat, pulvinar sit amet, enim. Phasellus consequat lobortis nisl. Curabitur sed felis. Donec ultrices, libero at rhoncus blandit, lacus risus dapibus mi, quis fermentum velit erat volutpat lectus. Sed accumsan feugiat nulla. Ut in erat eu nisi sagittis blandit. Ut mauris ligula, pretium in, bibendum ac, bibendum eget, purus. In erat libero, hendrerit ac, faucibus a, pretium nec, diam. Vestibulum nisi. Curabitur tincidunt. Cras elementum justo.' },
			{ id: 2, type: 'php', code: true, content: 'Donec tincidunt ultricies risus. Donec tempor lacus id sem. Fusce aliquam, pede sed accumsan dapibus, mauris nisi faucibus purus, ut elementum dui arcu molestie tortor. Nunc sagittis iaculis eros. Quisque sodales ipsum et felis. Nulla facilisi. Nulla in mauris in purus condimentum ornare. Phasellus porta ante a purus. In quis diam. Curabitur non leo. Sed facilisis odio condimentum ante. Nam tempor feugiat sem. Praesent sit amet libero sit amet dolor consequat venenatis.' },
			{ id: 3, type: 'note', code: false, content: 'Nulla facilisi. Duis sem tellus, laoreet quis, hendrerit id, faucibus vel, augue. In hac habitasse platea dictumst. Aenean pretium cursus odio. Phasellus ac libero aliquet enim bibendum condimentum. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam posuere sodales pede. Vivamus porttitor libero nec pede feugiat consectetuer. Fusce vitae risus eu tortor pharetra dictum. Vivamus sit amet dui. Phasellus at nibh. Curabitur diam justo, convallis non, cursus eu, facilisis non, leo.' }
		]
	},
	"2": {
		title: 'My Second Snippet',
		description: 'Fusce gravida nulla nec erat. Fusce euismod nulla a arcu. Vivamus rutrum. Nam ultricies libero ut turpis. Vivamus viverra tempor neque. Aenean felis. Curabitur vel odio sit amet enim posuere blandit. Vivamus consequat sem luctus elit. In ante nisl, euismod sed, interdum at, eleifend id, dolor. Phasellus sit amet ipsum. Etiam augue arcu, suscipit vel, tincidunt ac, congue vel, mauris.',
		snips: [
			{ id: 4, type: 'ruby', code: true, content: 'Proin dictum lorem. Sed at lectus. Nullam cursus quam ac turpis. In hac habitasse platea dictumst. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam et tellus vel sem pellentesque bibendum. Maecenas mollis urna ac est. Sed volutpat. Nam molestie turpis ac ante. Cras ultrices ante eget nibh. Integer lobortis interdum eros. Aliquam sapien ante, interdum nec, malesuada et, varius ac, nulla. Aliquam et diam. Maecenas mollis nunc in nunc.' },
			{ id: 5, type: 'note', code: false, content: 'Duis sem tellus, laoreet quis, hendrerit id, faucibus vel, augue. In hac habitasse platea dictumst. Aenean pretium cursus odio. Phasellus ac libero aliquet enim bibendum condimentum. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam posuere sodales pede. Vivamus porttitor libero nec pede feugiat consectetuer. Fusce vitae risus eu tortor pharetra dictum. Vivamus sit amet dui. Phasellus at nibh. Curabitur diam justo, convallis non, cursus eu, facilisis non, leo.' },
			{ id: 6, type: 'javascript', code: true, content: 'Ut enim purus, scelerisque in, eleifend ut, tristique id, elit. Integer sapien. Proin nunc massa, auctor at, fermentum placerat, pulvinar sit amet, enim. Phasellus consequat lobortis nisl. Curabitur sed felis. Donec ultrices, libero at rhoncus blandit, lacus risus dapibus mi, quis fermentum velit erat volutpat lectus. Sed accumsan feugiat nulla. Ut in erat eu nisi sagittis blandit. Ut mauris ligula, pretium in, bibendum ac, bibendum eget, purus. In erat libero, hendrerit ac, faucibus a, pretium nec, diam. Vestibulum nisi. Curabitur tincidunt. Cras elementum justo.' }
		]
	},
	"3": {
		title: 'My Third Snippet',
		description: 'Fusce gravida nulla nec erat. Fusce euismod nulla a arcu. Vivamus rutrum. Nam ultricies libero ut turpis. Vivamus viverra tempor neque. Aenean felis. Curabitur vel odio sit amet enim posuere blandit. Vivamus consequat sem luctus elit. In ante nisl, euismod sed, interdum at, eleifend id, dolor. Phasellus sit amet ipsum. Etiam augue arcu, suscipit vel, tincidunt ac, congue vel, mauris.',
		snips: [
			{ id: 7, type: 'php', code: true, content: 'In hac habitasse platea dictumst. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam et tellus vel sem pellentesque bibendum. Maecenas mollis urna ac est. Sed volutpat. Nam molestie turpis ac ante. Cras ultrices ante eget nibh. Integer lobortis interdum eros. Aliquam sapien ante, interdum nec, malesuada et, varius ac, nulla. Aliquam et diam. Maecenas mollis nunc in nunc.' },
			{ id: 8, type: 'note', code: false, content: 'Duis sem tellus, laoreet quis, hendrerit id, faucibus vel, augue. In hac habitasse platea dictumst. Aenean pretium cursus odio. Phasellus ac libero aliquet enim bibendum condimentum. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam posuere sodales pede. Vivamus porttitor libero nec pede feugiat consectetuer. Fusce vitae risus eu tortor pharetra dictum. Vivamus sit amet dui. Phasellus at nibh. Curabitur diam justo, convallis non, cursus eu, facilisis non, leo.' },
		]
	},
	"4": {
		title: 'My Fourth Snippet',
		description: 'This snippet is all about ruby because i love ruby so much.',
		snips: [
			{ id: 9, type: 'ruby', code: true, content: 'Curabitur consectetuer, elit quis gravida mollis, ligula sem cursus leo, lacinia rhoncus mi urna eget felis. Nam non felis id dolor egestas iaculis. Fusce gravida nulla nec erat. Fusce euismod nulla a arcu. Vivamus rutrum. Nam ultricies libero ut turpis. Vivamus viverra tempor neque. Aenean felis. Curabitur vel odio sit amet enim posuere blandit. Vivamus consequat sem luctus elit. In ante nisl, euismod sed, interdum at, eleifend id, dolor.' },
			{ id: 10, type: 'ruby', code: true, content: 'Cras eget eros. Ut enim purus, scelerisque in, eleifend ut, tristique id, elit. Integer sapien. Proin dictum lorem. Sed at lectus. Nullam cursus quam ac turpis. In hac habitasse platea dictumst. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam et tellus vel sem pellentesque bibendum. Maecenas mollis urna ac est. Sed volutpat. Nam molestie turpis ac ante. Cras ultrices ante eget nibh. Integer lobortis interdum eros.' },
			{ id: 11, type: 'ruby', code: true, content: 'Cras eget eros. Ut enim purus, scelerisque in, eleifend ut, tristique id, elit. Integer sapien. Proin dictum lorem. Sed at lectus. Nullam cursus quam ac turpis. In hac habitasse platea dictumst. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam et tellus vel sem pellentesque bibendum. Maecenas mollis urna ac est. Sed volutpat. Nam molestie turpis ac ante. Cras ultrices ante eget nibh. Integer lobortis interdum eros.' },
			{ id: 12, type: 'ruby', code: true, content: 'Donec tincidunt ultricies risus. Donec tempor lacus id sem. Fusce aliquam, pede sed accumsan dapibus, mauris nisi faucibus purus, ut elementum dui arcu molestie tortor. Nunc sagittis iaculis eros. Quisque sodales ipsum et felis. Nulla facilisi. Nulla in mauris in purus condimentum ornare. Phasellus porta ante a purus. In quis diam. Curabitur non leo. Sed facilisis odio condimentum ante. Nam tempor feugiat sem. Praesent sit amet libero sit amet dolor consequat venenatis.' },
			{ id: 13, type: 'ruby', code: true, content: 'Nullam cursus quam ac turpis. In hac habitasse platea dictumst. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam et tellus vel sem pellentesque bibendum. Maecenas mollis urna ac est. Sed volutpat. Nam molestie turpis ac ante. Cras ultrices ante eget nibh. Integer lobortis interdum eros. Aliquam sapien ante, interdum nec, malesuada et, varius ac, nulla. Aliquam et diam. Maecenas mollis nunc in nunc.' },
		]
	}
};

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
		
		this.database = new Snippely.Database();
		
		this.initializeMenus();
		this.initializeLayout();
		this.initializeMetas();
		this.initializeTags();
		
		this.Snippet.initialize(); //TODO - Load active tag / snippet from last session
		
		this.activate();
	},
	
	initializeMenus: function(){
		//main menus
		var mainMenu = new ART.Menu('MainMenu');
		var fileMenu = new ART.Menu('File');
		var saveItem = new ART.Menu.Item('Save');
		var loadItem = new ART.Menu.Item('Load');
		saveItem.shortcut = 'command+s';
		loadItem.shortcut = 'command+l';
		fileMenu.addItems([saveItem, loadItem]);
		mainMenu.addMenu(fileMenu);
		
		//add menu
		var addMenu = new ART.Menu('AddMenu').addItems([
			new ART.Menu.Item('Add Tag...', { onSelect: this.Tags.add.bind(this.Tags) }),
			new ART.Menu.Item('Add Snippet...', { onSelect: this.Snippets.add.bind(this.Snippets) })
		]);
		
		//action menu
		var actionMenu = new ART.Menu('ActionMenu').addItems([
			new ART.Menu.Item('Remove Tag...', { onSelect: this.Tags.remove.bind(this.Tags) }),
			new ART.Menu.Item('Rename Tag...', { onSelect: this.Tags.rename.bind(this.Tags) }),
			new ART.Menu.Item('Remove Snippet...', { onSelect: this.Snippets.remove.bind(this.Snippets) }),
			new ART.Menu.Item('Rename Snippet...', { onSelect: this.Snippets.rename.bind(this.Snippets) })
		]);
		
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
			limit: {y: [38, function(){
				return $('snippets-wrap').scrollHeight;
			}]},
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
		
		this.redraw();
	},
	
	initializeMetas: function(){
		var metaButtons = $$('#meta .button');
		metaButtons.addEvent('mousedown', function(){
			this.addClass('active');
		});
		document.addEvent('mouseup', function(){
			metaButtons.removeClass('active');
		});
	},
	
	initializeTags: function(){
		var sql = 'SELECT * FROM tags';
		var callback = function(result){
			var tags = [];
			if (result.data) $each(result.data, function(tag){
				tags.push({id: tag.id, name: tag.name});
			});
			this.Tags.initialize(tags);
		}.bind(this);
		
		this.database.execute(sql, callback);
	},
	
	initializeSnippets: function(tag_id){
		var sql = 'SELECT * FROM snippets WHERE tag_id = ' + tag_id;
		var callback = function(result){
			var snippets = [];
			if (result.data) $each(result.data, function(snippet){
				snippets.push({id: snippet.id, title: snippet.title});
			});
			this.Snippets.initialize(snippets);
		}.bind(this);
		
		this.database.execute(sql, callback);
	},
	
	redraw: function(){
		var left = this.tags.offsetWidth;
		$$(this.snippets, this.topResizer, this.meta, this.snippet).setStyle('left', left);
		
		this.footer.setStyle('width', this.tags.clientWidth);
		this.topResizer.setStyle('top', this.snippets.offsetHeight);
		this.meta.setStyle('top', this.snippets.offsetHeight + this.topResizer.offsetHeight);
		this.snippet.setStyle('top', this.snippets.offsetHeight + this.topResizer.offsetHeight + this.meta.offsetHeight);
		
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
