( function( tinymce ) {
	tinymce.PluginManager.add( 'block', function( editor ) {
		editor.on( 'preinit', function() {
			var DOM = tinymce.DOM;
			var element;
			var paragraphBar;
			var blockToolbar;
			var blockToolbars = {};
			var blockSelection = false;

			tinymce.each( '123456'.split(''), function( level ) {
				editor.addCommand( 'heading' + level, function() {
					editor.formatter.apply( 'h' + level );
					editor.nodeChanged();
				} );

				editor.addButton( 'heading' + level, {
					text: level,
					cmd: 'heading' + level,
					onpostrender: function() {
						var button = this;

						editor.on( 'nodechange', function( event ) {
							button.active( element.nodeName === 'H' + level );
						} );
					}
				} );
			} );

			editor.addButton( 'heading', {
				text: 'H',
				cmd: 'heading1'
			} );

			editor.addCommand( 'removeheading', function() {
				editor.formatter.apply( 'p' );
				editor.nodeChanged();
			});

			editor.addButton( 'removeheading', {
				icon: 'dashicons dashicons-no-alt',
				cmd: 'removeheading'
			} );

			editor.addCommand( 'preformatted', function() {
				editor.formatter.apply( 'pre' );
				editor.nodeChanged();
			} );

			editor.addButton( 'preformatted', {
				icon: 'dashicons dashicons-editor-code',
				cmd: 'preformatted'
			} );

			editor.addCommand( 'removepreformatted', function() {
				editor.formatter.remove( 'pre' );
				editor.nodeChanged();
			});

			editor.addButton( 'removepreformatted', {
				icon: 'dashicons dashicons-no-alt',
				cmd: 'removepreformatted'
			} );

			editor.addCommand( 'removeblockquote', function() {
				editor.formatter.remove( 'blockquote' );
				editor.nodeChanged();
			});

			editor.addButton( 'removeblockquote', {
				icon: 'dashicons dashicons-no-alt',
				cmd: 'removeblockquote'
			} );

			editor.addCommand( 'removelist', function() {
				if ( element.nodeName === 'UL' ) {
					editor.execCommand( 'InsertUnorderedList' );
				} else if ( element.nodeName === 'OL' ) {
					editor.execCommand( 'InsertOrderedList' );
				}

				editor.nodeChanged();
			});

			editor.addButton( 'removelist', {
				icon: 'dashicons dashicons-no-alt',
				cmd: 'removelist'
			} );

			editor.addButton( 'block', {
				icon: 'dashicons dashicons-editor-paragraph',
				tooltip: 'Add Block',
				onClick: function() {
					editor.$( element ).attr( 'data-mce-selected', 'block' );
          editor.nodeChanged();

          editor.once('click keydown', function ( event ) {
						if ( tinymce.util.VK.modifierPressed( event ) ) {
							return;
						}

						editor.$('*[data-mce-selected="block"]').removeAttr('data-mce-selected');
						editor.nodeChanged();
					} );
				},
				onPostRender: function() {
					var button = this;

					editor.on( 'nodechange', function( event ) {
						element = event.parents[ event.parents.length - 1 ];

						tinymce.each( editor.settings.blocks, function( block, key ) {
							if ( block.match( element ) ) {
								button.icon( block.icon ? 'dashicons dashicons-' + block.icon : '' );
								button.text( block.text || '' );
							}
						} );
					} );
				}
			});

			editor.addButton( 'up', {
				icon: 'dashicons dashicons-arrow-up-alt2',
				tooltip: 'Up',
				onClick: function() {
					rect = element.getBoundingClientRect();
					$prev = editor.$( element ).prev();

					if ( $prev.length ) {
						editor.$( element ).after( $prev );
						editor.nodeChanged();
						window.scrollBy( 0, - rect.top + element.getBoundingClientRect().top );
					}
				}
			});

			editor.addButton( 'down', {
				icon: 'dashicons dashicons-arrow-down-alt2',
				tooltip: 'Down',
				onClick: function() {
					rect = element.getBoundingClientRect();
					$next = editor.$( element ).next();

					if ( $next.length ) {
						editor.$( element ).before( $next );
						editor.nodeChanged();
						window.scrollBy( 0, - rect.top + element.getBoundingClientRect().top );
					}
				}
			});

			blockToolbar = editor.wp._createToolbar( [ 'up', 'block', 'down' ] )

			blockToolbar.$el.addClass('block-toolbar')

			blockToolbar.reposition = function () {
				if (!element) return

				var toolbar = this.getEl()
				var toolbarRect = toolbar.getBoundingClientRect()
				var elementRect = element.getBoundingClientRect()

				var contentRect = document.getElementById( 'content' ).getBoundingClientRect();

				DOM.setStyles(toolbar, {
					position: 'absolute',
					left: contentRect.left + 40 + 'px',
					top: elementRect.top + window.pageYOffset + 'px'
				} );

			  this.show()
			}

			editor.on('blur', function () {
			  blockToolbar.hide()
			} );

			editor.on( 'nodechange', function( event ) {
				var empty = (
					editor.dom.isEmpty( event.element ) &&
					( event.element.nodeName === 'P' || (
						event.element.nodeName === 'BR' &&
						event.element.parentNode.nodeName === 'P'
					) )
				);

				element = event.parents[ event.parents.length - 1 ];

				if ( editor.dom.isBlock( element ) ) {
					blockToolbar.reposition();
				} else {
					blockToolbar.hide();
				}

				var range = editor.selection.getRng()

				if ( editor.$( element ).attr( 'data-mce-selected' ) === 'block' ) {
					blockSelection = true;

					tinymce.each( editor.settings.blocks, function( block, key ) {
						if ( block.match( element ) ) {
							blockToolbars[ key ].reposition();
						} else {
							blockToolbars[ key ].hide();
						}
					} );
				} else {
					blockSelection = false;

					tinymce.each( editor.settings.blocks, function( block, key ) {
						blockToolbars[ key ].hide();
					} );
				}
			} )

			tinymce.each( editor.settings.blocks, function( block, key ) {
				blockToolbars[ key ] = editor.wp._createToolbar( block.buttons );
				blockToolbars[ key ].reposition = function () {
					if (!element) return

					var toolbar = this.getEl()
					var toolbarRect = toolbar.getBoundingClientRect()
					var elementRect = element.getBoundingClientRect()

					var contentRect = document.getElementById( 'content' ).getBoundingClientRect();

					DOM.setStyles(toolbar, {
						position: 'absolute',
						left: contentRect.left + 100 + 'px',
						top: elementRect.top + window.pageYOffset - toolbarRect.height - 8 + 'px'
					})

					this.show()
				}
			} );

			editor.on( 'beforeexeccommand', function( event ) {
				var block = blockSelection;

				editor.once( 'nodechange', function( event ) {
					setTimeout( function() {
						if ( block ) {
							editor.$('*[data-mce-selected="block"]').removeAttr('data-mce-selected');
							editor.$( element ).attr( 'data-mce-selected', 'block' );
							editor.nodeChanged();
						}
					} );
				}, true );
			} );
		} );
	} );
} )( window.tinymce );
