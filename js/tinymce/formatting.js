( function( tinymce ) {
	tinymce.PluginManager.add( 'formatting', function( editor ) {
		var each = tinymce.each
    var DOM = tinymce.DOM

		editor.on('focus', function () {
			if (editor.wp && editor.wp._createToolbar) {
				var element
				var toolbarInline = editor.wp._createToolbar( [ 'bold', 'italic', 'strikethrough', 'link' ] )

				editor.on('wptoolbar', function (event) {
					element = event.element
					range = event.range

					var content = editor.selection.getContent()
					var parent = editor.dom.getParent(range.startContainer, '*[data-mce-selected="block"]')

					if (parent) {
						return
					}

					// No collapsed selection.
					if (range.collapsed) {
						return
					}

					// No non editable elements.
					if (
						element.getAttribute('contenteditable') === 'false' ||
						element.getAttribute('data-mce-bogus') === 'all'
					) {
						return
					}

					// No images.
					if (element.nodeName === 'IMG') {
						return
					}

					// No horizontal rules.
					if (element.nodeName === 'HR') {
						return
					}

					// No links.
					if (element.nodeName === 'A') {
						return
					}

					// No empty selection.
					if (!content.replace(/<[^>]+>/g, '').replace(/(?:\s|&nbsp;)/g, '')) {
						return
					}

					if ( editor.dom.isBlock( range.startContainer ) && editor.dom.isBlock( range.endContainer ) ) {
						return;
					}

					event.toolbar = toolbarInline
					event.selection = range

					// Click inside selection does not trigger nodechange.
					editor.once( 'click', function ( event ) {
						window.setTimeout( function() {
							editor.nodeChanged();
						} );
					} );
				})
			}
		})
	} );
} )( window.tinymce );
