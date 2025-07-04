const Text = {

    editotAction: '',
    wrapperTag: '',
    els: {},

    selection: null,
    range: null,
    startContainer: null,
    endContainer: null,
    startNodeDiff: null, // start node when two nodes in selection are different
    endNodeDiff: null, // end node when two nodes in selection are different
    spanStyleEls: [], // non tag span elements style by css


    colectElements: function() {
        const els = document.querySelectorAll('[data-id]');
        els.forEach((el) => {
            this.els[el.dataset.id] = el;
        })
    },

    documentClick: (e) => {

        const t = e.target;
        Text.spanStyleEls.length = 0;

        // Editor button
        if(t.closest('[data-event-id="editor-action"]')) {
          Text.selection = window.getSelection();         
          if(Text.selection.rangeCount === 0) return;

          Text.range = Text.selection.getRangeAt(0);
          Text.sNode = Text.range.startContainer;
          Text.sOffset = Text.range.startOffset;
          Text.eNode = Text.range.endContainer;
          Text.eOffset = Text.range.endOffset;
          console.log(Text.range);

          Text.editotAction = t.closest('[data-action]').dataset.action;
          Text.wrapperTag = Text.getWrapperTagName(Text.editotAction);

          Text.handleStartNode();
          // Text.handleMiddleNode();
          Text.handleEndNode();
        }
    },


    // Start Container
    handleStartNode(){
      // Only text Node Selected
      if(this.sNode === this.eNode) {
         this.range.setStart(this.sNode, this.sOffset);
         this.range.setEnd(this.sNode, this.eOffset);
         const wrapperEl = document.createElement(this.wrapperTag);               
         wrapperEl.appendChild(this.range.extractContents());
         this.range.insertNode(wrapperEl); 
         this.styleNonTagSpanElement(wrapperEl);

         // Update Range
         this.range = document.createRange();
         this.range.selectNodeContents(wrapperEl);
         this.selection.removeAllRanges();
         this.selection.addRange(this.range);
         return;
      }

      // double click on one word node
      if(this.sNode.sOffset === this.sNode.length) return;

      // start container & endContainer different & start is text node
      if(this.sNode !== this.eNode && this.sNode.nodeType === 3) {
         this.range.setStart(this.sNode, this.sOffset);
         this.range.setEnd(this.sNode, this.sNode.length);
         const wrapperEl = document.createElement(this.wrapperTag);               
         wrapperEl.appendChild(this.range.extractContents());
         this.range.insertNode(wrapperEl);     
         this.startNodeDiff = wrapperEl.childNodes[0];
         this.styleNonTagSpanElement(wrapperEl);
      }
    },

    // Middle Nodes
    handleMiddleNode(){
      const midTextNodes = [];
      const midElementNodes = [];
    },

    // End Container
    handleEndNode(){
      // start container & endContainer different & end is text node
      if(this.sNode !== this.eNode && this.eNode.nodeType === 3) {
         this.range.setStart(this.eNode, 0);
         this.range.setEnd(this.eNode, this.eOffset);
         const wrapperEl = document.createElement(this.wrapperTag);               
         wrapperEl.appendChild(this.range.extractContents());
         this.range.insertNode(wrapperEl);
         this.endNodeDiff = wrapperEl.childNodes[0];

         // Update Range
         this.range = document.createRange();
         this.range.setStart(this.startNodeDiff, 0);
         this.range.setEnd(this.endNodeDiff, this.eOffset);
         this.selection.removeAllRanges();
         this.selection.addRange(this.range);
         this.styleNonTagSpanElement(wrapperEl);
      }
    },

    getWrapperTagName(editotAction){
      let tagName = '';
      switch (editotAction) {
        case 'btag':
          tagName = 'b';
          break;

        case 'itag':
          tagName = 'i';
          break;

        case 'utag':
          tagName = 'u';
          break;

        case 'suptag':
          tagName = 'sup';
          break;

        case 'subtag':
          tagName = 'sub';
          break;

        case 'textcolor':
          tagName = 'span';
          break;

        case 'textbg':
          tagName = 'span';
          break;
      }
      return tagName;
    },

    updateRangeSelection(){

    },

    styleNonTagSpanElement(spanEl){
      if(Text.editotAction === 'textcolor') spanEl.style.color = 'red';
      if(Text.editotAction === 'textbg') spanEl.style.backgroundColor = 'red';
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