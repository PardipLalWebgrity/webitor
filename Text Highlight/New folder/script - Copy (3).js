const Text = {

    editotAction: '',
    els: {},

    selection: null,
    range: null,
    startContainer: null,
    endContainer: null,


    colectElements: function() {
        const els = document.querySelectorAll('[data-id]');
        els.forEach((el) => {
            this.els[el.dataset.id] = el;
        })
    },

    documentClick: (e) => {

        const t = e.target;        

        // Editor button
        if(t.closest('[data-event-id="editor-action"]')) {
          Text.selection = window.getSelection();         
          if(Text.selection.rangeCount === 0) return;
          Text.range = Text.selection.getRangeAt(0);
          console.log(Text.range);
          Text.editotAction = t.closest('[data-action]').dataset.action;
          Text.createActionTagWrapperForTextNode();
          Text.createActionTagWrapperForTagNode();
        }
    },


    // Helpers

    // Only Text Node
    createActionTagWrapperForTextNode(){      
      this.startContainer = Text.range.startContainer;
      this.startOffset = Text.range.startOffset;
      this.endContainer = Text.range.endContainer;
      this.endOffset = Text.range.endOffset;

      // Wrapper Element
      let wrapperTagname = '';
      if(Text.editotAction === 'btag') wrapperTagname = 'b';
      if(Text.editotAction === 'itag') wrapperTagname = 'i';
      if(Text.editotAction === 'utag') wrapperTagname = 'u';
      if(Text.editotAction === 'suptag') wrapperTagname = 'sup';
      if(Text.editotAction === 'subtag') wrapperTagname = 'sub';
      if(Text.editotAction === 'textcolor') wrapperTagname = 'span';
      if(Text.editotAction === 'textbg') wrapperTagname = 'span';

      // Single Text Node
      if(this.startContainer === this.endContainer && this.startContainer.nodeName === '#text') {
         const wrapperEl = document.createElement(wrapperTagname);            
         wrapperEl.appendChild(Text.range.extractContents());
         Text.range.insertNode(wrapperEl);
         Text.styleSpanWrapper(wrapperEl);
         return;
      }

      // Multiple Single Node
      if(this.startContainer.nodeName === '#text' || this.endContainer.nodeName === '#text' && this.startContainer !== this.endContainer) {

        // Collect Middle Text Nodes
        const textNodes = [];
        let iNode = this.startContainer;
        while(iNode !== this.endContainer) {
          iNode = iNode.nextSibling;
          if(!iNode) break;
          if(iNode.nodeName === '#text') textNodes.push(iNode);                    
        }    
        
        // start Text Node
        if(this.startContainer.nodeName === '#text') {
          if(this.startOffset === this.startContainer.length) return;
          const wrapperEl = document.createElement(wrapperTagname);   
          Text.range.setStart(this.startContainer, this.startOffset);
          Text.range.setEnd(this.startContainer, this.startContainer.length);
          wrapperEl.appendChild(Text.range.extractContents());
          Text.range.insertNode(wrapperEl);
          Text.styleSpanWrapper(wrapperEl);
        }

        // End Text Node
        if(this.endContainer.nodeName === '#text') {
         if(this.endOffset === this.endContainer.length) return;
          const wrapperEl = document.createElement(wrapperTagname);   
          Text.range.setStart(this.endContainer,this.endContainer, 0);
          console.log(this.endOffset);
          Text.range.setEnd(this.endContainer, this.endOffset);
          wrapperEl.appendChild(Text.range.extractContents());          
          Text.range.insertNode(wrapperEl);
          Text.styleSpanWrapper(wrapperEl);
        }

        // Middle Text Nodes        
        textNodes.forEach((tNode)=>{
          const wrapperEl = document.createElement(wrapperTagname);   
          Text.range.setStart(tNode, 0);
          Text.range.setEnd(tNode, tNode.length);
          wrapperEl.appendChild(Text.range.extractContents());
          Text.range.insertNode(wrapperEl);
          Text.styleSpanWrapper(wrapperEl);
        })

      }

      // Span Style
      if(Text.editotAction === 'textcolor') {

      }
      if(Text.editotAction === 'textbg') wrapperTagname = 'span';


    },

    // Only Element
    createActionTagWrapperForTagNode(){

    },

    styleSpanWrapper(wrapperEl){
      if(wrapperEl.nodeName !== 'SPAN') return;
      if(this.editotAction === 'textcolor') wrapperEl.style.color = 'red';
      if(this.editotAction === 'textbg') wrapperEl.style.backgroundColor = 'red';
    },

    init: () => {
        Text.colectElements();
    },
}

window.addEventListener('load', Text.init);
window.addEventListener('click', Text.documentClick);


/*

* If user select element node as startContainer & endContainer

*/