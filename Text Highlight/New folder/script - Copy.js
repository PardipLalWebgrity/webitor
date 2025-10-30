const Text = {

 actionCSS: {
   bold: {'font-weight':'bold'},
   italic: {'font-style':'italic'},
   underline: {'text-decoration':'underline'},
   sup: {'vertical-align': 'super', 'font-size': '0.8em'},
   sub: {'vertical-align': 'sub', 'font-size': '0.8em'},
   textcolor: {color:'red'},
   textbg: {background:'red'},
 },

 els: {},

  coloectElements: function() {
      const els = document.querySelectorAll('[data-id]');
      els.forEach((el) => {
          this.els[el.dataset.id] = el;
      })
      console.log(this.els);      
  },

  documentClick: (e)=>{

    const t = e.target;

    // editor button
    if(t.closest('[data-editor-action]')) {
      const action = t.closest('[data-editor-action]')?.dataset.editorAction;
      
      //Text.createSelectionWrapper(Text.actionCSS[action]);
    }
  },

  createSelectionWrapper(args){
      const selection = window.getSelection();
      const startRange = selection.getRangeAt(0);

      if (selection.rangeCount === 1) {
        startRange.setStart(rangeNode, rangeNodeX);
        startRange.setEnd(rangeNode, rangeNodeY);
        const spanEl = document.createElement('span');
        for(let c in css) spanEl.style[c] = css[c];
        spanEl.appendChild(startRange.extractContents());
        startRange.insertNode(spanEl);
        selection.removeAllRanges();
      }
  },


  // createSelectionWrapper(css){
  //   const selection = window.getSelection();
  //   const selectedText = selection.toString();

  //   // Only One Selection
  //   if (selection.rangeCount === 1) {
  //     const range = selection.getRangeAt(0);
  //     const startContainer = range.startContainer;
  //     const startOffset = range.startOffset;
  //     const endContainer = range.endContainer;
  //     const endOffset = range.endOffset;


  //     // Text Node Only - Only One Node
  //     if(startContainer === endContainer && startContainer.TEXT_NODE) {
  //       const range = selection.getRangeAt(0);
  //       const spanEl = document.createElement('span');
  //       for(let c in css) spanEl.style[c] = css[c];
  //       spanEl.appendChild(range.extractContents());
  //       range.insertNode(spanEl);
  //       selection.removeAllRanges();
  //     }

  //     // Text Node & Element Node - Multiple Nodes
  //     if(startContainer !==  endContainer) {

  //        // add css to mid elements
  //        const midSelectedEls = Text.detectMiddleElements(startContainer, endContainer);
  //        midSelectedEls.forEach((el)=>{
  //          for(let c in css) el.style[c] = css[c];
  //        })

  //        // Start Container
  //        const startRange = selection.getRangeAt(0);
  //        startRange.setStart(startContainer, startOffset);
  //        startRange.setEnd(startContainer, startContainer.length);
  //        const spanEl = document.createElement('span');
  //        for(let c in css) spanEl.style[c] = css[c];
  //        spanEl.appendChild(startRange.extractContents());
  //        startRange.insertNode(spanEl);
  //        selection.removeAllRanges();

        
  //        // Text Node & Element Node's partial part selected - 2 node selected
  //        // Text Node & Element Node Whole Text selected - 2 node selected
  //        // Multiple Node Selected
  //     }
  //   }
  // },

  detectMiddleElements(startContainer, endContainer){
    const midNodes = [];
    let itarateNode = startContainer.nextSibling;
    let endContainerEl = endContainer.nodeType === 1 ? endContainer : endContainer.parentElement;

    while(itarateNode !== endContainerEl) {         
      if(itarateNode.nodeType === 1) midNodes.push(itarateNode);
      itarateNode = itarateNode.nextSibling || endContainerEl;
      console.log('while Run');
    }

    return midNodes;
  },

  init: ()=>{
    Text.coloectElements();
  },
}

window.addEventListener('load', Text.init);
window.addEventListener('click', Text.documentClick);