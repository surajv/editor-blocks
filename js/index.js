(function (tinymce) {
	tinymce.init({
		browser_spellcheck: true,
		// Enter twice in a nested block creates a fresh paragraph.
		end_container_on_empty_block: true,
		inline: true,
		// Enter creates a fresh paragraph.
		keep_styles: false,
		menubar: false,
		object_resizing: false,
		plugins: [
			'block',
			'new',
			'formatting',
			'clean',
			'lists',
			'paste',
			'toolbar',
			'wplink',
			'wptextpattern'
		],
		blocks: {
			paragraph: {
				match: function( element ) {
					return element.nodeName === 'P' && ! (
						element.childNodes.length === 1 && element.firstChild.nodeName === 'IMG'
					);
				},
				buttons: [ 'alignleft', 'aligncenter', 'alignright', 'heading', 'blockquote', 'bullist', 'preformatted' ],
				icon: 'editor-paragraph'
			},
			heading: {
				match: function( element ) {
					var nodeName = element.nodeName;

					return (
						nodeName === 'H1' ||
						nodeName === 'H2' ||
						nodeName === 'H3' ||
						nodeName === 'H4' ||
						nodeName === 'H5' ||
						nodeName === 'H6'
					);
				},
				buttons: [ 'alignleft', 'aligncenter', 'alignright', 'heading1', 'heading2', 'heading3', 'heading4', 'heading5', 'heading6', 'removeheading' ],
				text: 'H'
			},
			list: {
				match: function( element ) {
					return element.nodeName === 'UL' || element.nodeName === 'OL';
				},
				buttons: [ 'bullist', 'numlist', 'removelist' ],
				icon: 'editor-ul'
			},
			image: {
				match: function( element ) {
					return element.childNodes.length === 1 && element.firstChild.nodeName === 'IMG';
				},
				buttons: [ 'alignleft', 'aligncenter', 'alignright' ],
				icon: 'format-image'
			},
			blockquote: {
				match: function( element ) {
					return element.nodeName === 'BLOCKQUOTE';
				},
				buttons: [ 'removeblockquote' ],
				icon: 'editor-quote'
			},
			preformatted: {
				match: function( element ) {
					return element.nodeName === 'PRE';
				},
				buttons: [ 'syntax', 'removepreformatted' ],
				icon: 'editor-code'
			}
		},
		schema: 'html5-strict',
		selector: '#content',
		theme: false,
		toolbar: false
	})
})(window.tinymce)
