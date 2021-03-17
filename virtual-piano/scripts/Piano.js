class Piano {
    constructor(rootQuery, keys) {
        this._root = document.querySelector(rootQuery);
        this._keys = keys;
        this._insertKeys();

        this._isMouseDown = false;
        this._target = null;
        
        this._prevKey = null;                                   // e.repeat
        
        let showState = sessionStorage.getItem('showState');
        this._showState = showState ? showState : 'keys';
        
        if (this._showState === 'keys') this.showKeys();
        if (this._showState === 'notes') this.showNotes();
    }
    
    /**
     * @readonly
     * @return 'keys' | 'notes'
    */

    getState() {
        return this._showState;
    }

    showKeys() {
        sessionStorage.setItem('showState', 'keys');
        this._showState = 'keys';
        this._root.classList.add('keys');
        this._root.classList.remove('notes');
    }

    showNotes() {
        sessionStorage.setItem('showState', 'notes');
        this._showState = 'notes';
        this._root.classList.add('notes');
        this._root.classList.remove('keys');
    }

    mouseDownEvent = (event) => {
        this._isMouseDown = true;

        const currentKey = this._findKey(event.target);
        currentKey?.addActiveClass();
        currentKey?.play();
        this._target = currentKey ? event.target : this._target;
    }

    mouseUpEvent = (event) => {
        this._isMouseDown = false;

        const previousKey = this._findKey(this._target);
        previousKey?.removeActiveClass();
    }

    mouseOverEvent = (event) => {
        if (!this._isMouseDown) return;
        if (event.target === this._target) return;
        const previousKey = this._findKey(this._target);
        const currentKey = this._findKey(event.target);
        previousKey?.removeActiveClass();
        currentKey?.addActiveClass();
        currentKey?.play();
        this._target = event.target;
    }

    mouseLeaveEvent = (event) => {
        if (this._isMouseDown) {
            const previousKey = this._findKey(this._target);
            previousKey?.removeActiveClass();
        }
    }

    keyDownEvent = (event) => {
        if (event.repeat  || this._prevKey === event.key) return; // e.repeat
        if (event.ctrlKey || event.shiftKey) return;
        const eventCode = this._getKeyCode(event);
        const currentKey = this._findKey( eventCode );
        if (currentKey) event.preventDefault();
        if (currentKey) event.stopPropagation();
        this._prevKey = event.key;                                // e.repeat
        currentKey?.addActiveClass();
        currentKey?.play();
    }

    keyUpEvent = (event) => {
        if (this._prevKey === event.key) this._prevKey = null;    // e.repeat
        const eventCode = this._getKeyCode(event);
        const currentKey = this._findKey(eventCode);
        currentKey?.removeActiveClass();
    }

    _getKeyCode = (event) => {
        return event.key.length === 1 ? 
            event.code.slice(-1).toLowerCase() : null;
    }

    startEvents() {
        this._root.addEventListener('mouseleave', this.mouseLeaveEvent);
        this._root.addEventListener('mousedown', this.mouseDownEvent);
        this._root.addEventListener('mouseover', this.mouseOverEvent);
        document.addEventListener('mouseup', this.mouseUpEvent);
        document.addEventListener('keydown', this.keyDownEvent);
        document.addEventListener('keyup', this.keyUpEvent);
    }

    /**
     * @param target HTMLElement | event.key
     */

    _findKey(target) {
        if (!target) return null;
        const key = target instanceof HTMLElement ?
            target.dataset.key : target;
        return this._keys.find(k => k.keyInfo.key === key);
    }

    _insertKeys() {
        this._keys.map(k => k.insertIn('beforeend', this._root));
    }
}

export default Piano;