async _duplicatePageDesign(index = '1'){
			// create duplicate page
			const duplicatePage = await WBTR.db.getObjectByIndex('pages',+index);
			delete duplicatePage.index;
			const duplicatePageIndex = await WBTR.db.addObject('pages', duplicatePage);
			duplicatePage.index = duplicatePageIndex.index;

			// Create layers data
			const layers = await WBTR.db.getAllObjects('layers');
			const duplicatePageLayers = [];
			layers.forEach((l)=>{
				if(l.pId == index) {
						delete l.index;
						l.pId = duplicatePageIndex[0].index;
						duplicatePageLayers.push(l);		
				}
			})
			// add layers to db
			WBTR.db.addObject('layers', duplicatePageLayers);
	}