	static async _mergeImportWithDatabase(importData, dbData){

	const newData = {
		layers: [],
		options: {
			'font-family': {},
		},
		pages: [],
	};


	// Start options ---------------------------------------------------------

	// available-fonts-href
	const fontUrls = [];
	if (importData.options['available-fonts-href']) fontUrls.push(importData.options['available-fonts-href']);
	if (dbData.options['available-fonts-href']) fontUrls.push(dbData.options['available-fonts-href']);
	if (fontUrls.length === 2) newData.options['available-fonts-href'] = this._mergeGoogleFontUrls(fontUrls);

	// font-family
	const uniqueFontFamilies = [...new Set([...Object.keys(importData.options['font-family']), ...Object.keys(dbData.options['font-family'])])];
	uniqueFontFamilies.forEach((f) => {
		if (dbData.options['font-family'][f]) return;
		newData.options['font-family'][f] = importData.options['font-family'][f];
	})

	WBTR.db.updateKeyValueObject(newData.options).catch((error) => {
		console.error('Error adding options:', error);
	})

	// End options ---------------------------------------------------------


	// Start pages ---------------------------------------------------------

	newData.pages = importData.pages;
	const pagesId = {};
	for (const page of newData.pages) {
		try {
			const oldIndex = page.index;
			delete page.index;
			const newRecord = await WBTR.db.addObject('pages', page);
			pagesId[oldIndex] = newRecord[0].index;
		} catch (error) {
			console.error('Error adding pages:', error);
		}
	}

	// End pages ---------------------------------------------------------


	// Start Layers ---------------------------------------------------------

	newData.layers = importData.layers;
	newData.layers.forEach((l) => {
		delete l.index;
		l.pId = pagesId[l.pId];
	})

	WBTR.db.addObject('layers', newData.layers).catch((error) => {
		console.error('Error adding layers:', error);
	})

	// End Layers ---------------------------------------------------------

}