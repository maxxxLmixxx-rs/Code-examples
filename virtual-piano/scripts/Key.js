class Key {
    constructor({ type, noteName, keyToPress, audioPath }) {
        this._type = type; 
        this._noteName = noteName; 
        this._audioPath = audioPath;
        this._keyToPress = keyToPress; 

        this._domElement = null;
        
        /**
         * @return doesn't end with '/' 
         */

        const getURL = (url = document.URL) => url.slice(0, url.lastIndexOf('/'));
        this._audioElement = new Audio(getURL() + this._audioPath);
    }

    addActiveClass() {
        if ( !this._cache() ) throw new Error('No such DOM Element.');
        this._domElement.classList.add('piano__key--active');
    }

    removeActiveClass() {
        if ( !this._cache() ) throw new Error('No such DOM Element.');
        this._domElement.classList.remove('piano__key--active');
    }

    play() {
        if ( !this._cache() ) throw new Error('No such DOM Element.');
        const clone = this._audioElement.cloneNode();
        clone.play();

        // const steps = {
        //     '1.0':    0, '0.8':  400,  
        //     '0.6':  800, '0.4': 1200, 
        //     '0.2': 1600, '0.0': 2000,
        // };

        // for (let vol in steps) {
        //     setTimeout(() => clone.volume = +vol, steps[vol]);
        // }
    }

    get domElement() {
        return this._domElement;
    }

    get keyInfo() {
        return { note: this._noteName, key: this._keyToPress };
    }

    insertIn(option, parentElement) {
        if ( this._cache() ) console.warn('Such element exists in page.');
        parentElement.insertAdjacentHTML( option, this._getHTML() );
        this._cache();
    }

    _cache() {
        if (this._domElement) return true;
        const element = document.querySelector(
            `div[data-key="${this._keyToPress}"]`);
            // `div[data-note="${this._noteName}"][data-key="${this._keyToPress}"]`);
        if (!element) return false;
        return this._domElement = element;
    }

    _getHTML() {
        return `
            <div class="piano__key piano__key--${this._type}" 
                 data-key="${this._keyToPress}" 
                 data-note="${this._noteName}">
            </div>
        `.trim();
    }
}

/**
 * @audioPath should start with '/'
 */

const keys = [
    new Key({ type: 'white', keyToPress: 'd', noteName: 'c' , audioPath: `/assets/sounds/c.mp3`  }),
    new Key({ type: 'black', keyToPress: 'r', noteName: 'c♯', audioPath: `/assets/sounds/c♯.mp3` }),
    new Key({ type: 'white', keyToPress: 'f', noteName: 'd' , audioPath: `/assets/sounds/d.mp3`  }),
    new Key({ type: 'black', keyToPress: 't', noteName: 'd♯', audioPath: `/assets/sounds/d♯.mp3` }),
    new Key({ type: 'white', keyToPress: 'g', noteName: 'e' , audioPath: `/assets/sounds/e.mp3`  }),
    new Key({ type: 'white', keyToPress: 'h', noteName: 'f' , audioPath: `/assets/sounds/f.mp3`  }),
    new Key({ type: 'black', keyToPress: 'u', noteName: 'f♯', audioPath: `/assets/sounds/f♯.mp3` }),
    new Key({ type: 'white', keyToPress: 'j', noteName: 'g' , audioPath: `/assets/sounds/g.mp3`  }),
    new Key({ type: 'black', keyToPress: 'i', noteName: 'g♯', audioPath: `/assets/sounds/g♯.mp3` }),
    new Key({ type: 'white', keyToPress: 'k', noteName: 'a' , audioPath: `/assets/sounds/a.mp3`  }),
    new Key({ type: 'black', keyToPress: 'o', noteName: 'a♯', audioPath: `/assets/sounds/a♯.mp3` }),
    new Key({ type: 'white', keyToPress: 'l', noteName: 'b' , audioPath: `/assets/sounds/b.mp3`  }),
];

export { Key, keys };