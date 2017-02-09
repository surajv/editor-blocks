( function( tinymce ) {
	tinymce.PluginManager.add( 'new', function( editor ) {
		var DOM = tinymce.DOM;

		editor.addButton( 'add', {
			icon: 'dashicons dashicons-plus-alt',
			tooltip: 'Add Block',
			cmd: 'unlink'
		});

		editor.on('focus', function () {
			if (editor.wp && editor.wp._createToolbar) {
				var element
				var toolbarCaret = editor.wp._createToolbar( [ 'add' ] )

				toolbarCaret.$el.addClass('mce-arrow-left-side')

				toolbarCaret.reposition = function () {
				  if (!element) return

				  var toolbar = this.getEl()
				  var toolbarRect = toolbar.getBoundingClientRect()
				  var elementRect = element.getBoundingClientRect()

				  DOM.setStyles(toolbar, {
				    position: 'absolute',
				    left: elementRect.left + 8 + 'px',
				    top: elementRect.top + window.pageYOffset + elementRect.height / 2 - toolbarRect.height / 2 + 'px'
				  })

				  this.show()
				}

				// Throttle!
				editor.on('keyup', function (event) {
				  if (editor.dom.isEmpty(editor.selection.getNode())) {
				    editor.nodeChanged()
				  } else {
				    toolbarCaret.hide()
				  }
				})

				editor.on('blur', function () {
				  toolbarCaret.hide()
				})

				editor.on('wptoolbar', function (event) {
					element = event.element
					range = event.range

					// No collapsed selection.
					if (range.collapsed) {
					  if ( event.empty ) {
					    event.toolbar = toolbarCaret
					  }

					  return
					}
				} );
			}
		} );
	} );
} )( window.tinymce );
