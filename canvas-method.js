_highlightElementsInSelection(selectionAreaEl) {
	props._selectionAreaElements.forEach(el => el.classList.remove('selected'));
	props._selectionAreaElements = [];

	props._root.shadowRoot.querySelectorAll('[data-layer]').forEach(el => {

		const rectEl = el.getBoundingClientRect();
		const selectionAreaElRect = selectionAreaEl.getBoundingClientRect();

		if (
			rectEl.right >= selectionAreaElRect.left &&
			rectEl.left <= selectionAreaElRect.left + selectionAreaElRect.width &&
			rectEl.bottom >= selectionAreaElRect.top &&
			rectEl.top <= selectionAreaElRect.top + selectionAreaElRect.height
		) {
			el.classList.add('selected');
			props._selectionAreaElements.push(el);
		}
	});
}