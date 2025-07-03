const Text = {

    actionCSS: {
        bold: { 'font-weight': 'bold' },
        italic: { 'font-style': 'italic' },
        underline: { 'text-decoration': 'underline' },
        sup: { 'vertical-align': 'super', 'font-size': '0.8em' },
        sub: { 'vertical-align': 'sub', 'font-size': '0.8em' },
        textcolor: { color: 'red' },
        textbg: { background: 'red' },
    },

    els: {},

    coloectElements: function() {
        const els = document.querySelectorAll('[data-id]');
        els.forEach((el) => {
            this.els[el.dataset.id] = el;
        })
        console.log(this.els);
    },

    documentClick: (e) => {

        const t = e.target;

        // editor button
        if (t.closest('[data-editor-action]')) {
            const action = t.closest('[data-editor-action]')?.dataset.editorAction;
            const css = Text.actionCSS[action];
            const rangeNodes = Text.getRangeNodes();
            if(!rangeNodes) return;
            
            // Single Node
            if(rangeNodes.midNodes.length === 0) {
               Text.createSelectionWrapper({
                 node: rangeNodes.start.node,
                 offsetX: rangeNodes.start.sIndex,
                 offsetY: rangeNodes.end.eIndex,
                 css: css,
               })               
            }            

            // Multiple Nodes
            if(rangeNodes.midNodes.length) {
              // Start
              Text.createSelectionWrapper({
                node: rangeNodes.start.node,
                offsetX: rangeNodes.start.sIndex,
                offsetY: rangeNodes.start.eIndex,
              });
              
              // End
              Text.createSelectionWrapper({
                node: rangeNodes.end.node,
                offsetX: rangeNodes.end.sIndex,
                offsetY: rangeNodes.end.eIndex,
              })
              
              // Multi
              rangeNodes.midNodes.forEach((el)=>{
                for(let c in css) el.style[c] = css[c];
              })
            }


            console.log('Executed');
        }
    },

    getRangeNodes() {

        const selection = window.getSelection();        
        if (selection.rangeCount !== 1) return false; // currently one selection focus
        const range = selection.getRangeAt(0);

        const rangeNodes = {
            start: {
                node: null,
                sIndex: 0,
                eIndex: 0,
            },
            midNodes: [],
            end: {
                node: null,
                sIndex: 0,
                eIndex: 0,
            }
        };

        // Start Node
        rangeNodes.start.node = range.startContainer;
        rangeNodes.start.sIndex = range.startOffset;
        rangeNodes.start.eIndex = range.startContainer.length;


        // Mid Nodes
        if(range.startContainer !== range.endContainer) {
         console.log(range.startContainer, range.endContainer);
          let itarateNode = range.startContainer.nextElementSibling;
          let endContainerEl = range.endContainer.nodeType === 1 ? range.endContainer : range.endContainer.parentElement;
          while (itarateNode !== endContainerEl) {
              if (itarateNode.nodeType === 1) rangeNodes.midNodes.push(itarateNode);
              itarateNode = itarateNode.nextSibling || endContainerEl;              
          }
        }


        // End Node
        rangeNodes.end.node = range.endContainer;
        rangeNodes.end.sIndex = 0;
        rangeNodes.end.eIndex = range.endOffset;

        return rangeNodes;
    },

    createSelectionWrapper(args){
        const selection = window.getSelection();
        const startRange = selection.getRangeAt(0);

        if (selection.rangeCount === 1) {
          startRange.setStart(args.node, args.offsetX);
          startRange.setEnd(args.node, args.offsetY);
          const spanEl = document.createElement('span');   
          for(let c in args.css) spanEl.style[c] = args.css[c];     
          spanEl.appendChild(startRange.extractContents());
          startRange.insertNode(spanEl);
        }
    },

    

    init: () => {
        Text.coloectElements();
    },
}

window.addEventListener('load', Text.init);
window.addEventListener('click', Text.documentClick);