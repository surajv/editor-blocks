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
		schema: 'html5-strict',
		selector: '#content',
		theme: false,
		toolbar: false
	})
})(window.tinymce)
