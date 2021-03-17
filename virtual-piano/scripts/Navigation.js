class Navigation {
    constructor({ navigation, fullscreen, piano }) {
        this._navigation = navigation;
        this._piano = piano.object;
        this._fullscreen = fullscreen.object;

        this._keyToggle = piano.keyToggle; 
        this._noteToggle = piano.noteToggle;
        this._fullToggle = fullscreen.fullToggle;
        
        switch ( this._piano.getState() ) {
            case 'keys' : return this._addActiveClass(this._keyToggle);
            case 'notes': return this._addActiveClass(this._noteToggle);
        }
    }

    /* Toggle methods */

    _toggleShowKeys = (event) => {
        this._removeActiveClass(this._noteToggle);
        this._addActiveClass(this._keyToggle);
        this._piano.showKeys();
    }

    _toggleShowNotes = (event) => {
        this._removeActiveClass(this._keyToggle);
        this._addActiveClass(this._noteToggle);
        this._piano.showNotes();
    }

    _toggleFullscreen = (event) => {
        const isFullscreen = this._fullscreen.showState();
        if (isFullscreen) {
            this._fullscreen.outFull();
            this._removeActiveClass(this._fullToggle);
        } 
        if (!isFullscreen) {
            this._fullscreen.inFull();
            this._addActiveClass(this._fullToggle);
        }
    }

    startEvents() {
        this._keyToggle.addEventListener('click', this._toggleShowKeys);
        this._noteToggle.addEventListener('click', this._toggleShowNotes);
        this._fullToggle.addEventListener('click', this._toggleFullscreen);
    }

    /* Service */

    _addActiveClass(element) {
        element.classList.add('active');
    }

    _removeActiveClass(element) {
        element.classList.remove('active');
    }

}

export default Navigation;