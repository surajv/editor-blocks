( function( tinymce ) {
	tinymce.PluginManager.add( 'block', function( editor ) {
		editor.on( 'preinit', function() {
			var DOM = tinymce.DOM;
			var element;
			var paragraphBar;
			var blockToolbar;

			editor.addButton( 'blocklevel', {
				text: 'block-level tools',
				onClick: function() {}
			});

			editor.addButton( 'block', {
				icon: 'dashicons dashicons-editor-paragraph',
				tooltip: 'Add Block',
				onClick: function() {
					editor.selection.select( element );
					editor.nodeChanged();
				},
				onPostRender: function() {
					var button = this;

					editor.on( 'nodechange', function(event) {
						element = event.parents[ event.parents.length - 1 ];

						button.text( '' )

						if ( event.element.nodeName === 'IMG' || editor.$( element ).find( 'img' ).length ) {
							button.icon( 'dashicons dashicons-format-image' );
						} else if ( element.nodeName === 'H1' ) {
							button.icon( '' );
							button.text( 'H1' )
						} else if ( element.nodeName === 'H2' ) {
							button.icon( '' );
							button.text( 'H2' )
						} else if ( element.nodeName === 'UL' ) {
							button.icon( 'dashicons dashicons-editor-ul' );
						} else {
							button.icon( 'dashicons dashicons-editor-paragraph' );
						}
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

			  DOM.setStyles(toolbar, {
			    position: 'absolute',
			    left: elementRect.left - 8 - toolbarRect.width + 'px',
			    top: elementRect.top + window.pageYOffset + 'px'
			  })

			  this.show()
			}

			editor.on('blur', function () {
			  blockToolbar.hide()
			})

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

				if ( ! empty && editor.dom.isBlock( range.startContainer ) && editor.dom.isBlock( range.endContainer ) ) {
					paragraphBar.reposition();
				} else {
					paragraphBar.hide();
				}
			} )

			paragraphBar = editor.wp._createToolbar( [ 'alignleft', 'aligncenter', 'alignright', 'blocklevel' ] );

			paragraphBar.reposition = function () {
				if (!element) return

				var toolbar = this.getEl()
				var toolbarRect = toolbar.getBoundingClientRect()
				var elementRect = element.getBoundingClientRect()

				DOM.setStyles(toolbar, {
					position: 'absolute',
					left: elementRect.left + 'px',
					top: elementRect.top + window.pageYOffset - toolbarRect.height - 8 + 'px'
				})

				this.show()
			}

			editor.on( 'execcommand', function( event ) {
				if ( event.command === 'JustifyLeft' || event.command === 'JustifyCenter' || event.command === 'JustifyRight' ) {
					editor.selection.select( element );
					editor.nodeChanged();
				}
			} )
		} );
	} );
} )( window.tinymce );
