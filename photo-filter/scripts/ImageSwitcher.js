import {ImageBind} from './ImageBind.js';

export class ImageSwitcher extends ImageBind {

    static STORAGE_SRC = 'image-src';
    static STORAGE_NUM = 'image-num';

    constructor(imgSelector, initialSrc) {
        super(imgSelector, false);
        /* Rewrite itself */
        this.numberGenerator = this.numberGenerator(1, 20);
        this.imgElement.src = this._getStoredSrc() ? this._getStoredSrc() : initialSrc;
    }

    _getStoredSrc() {
        return sessionStorage.getItem(ImageSwitcher.STORAGE_SRC);
    }
    _getStoredNum() {
        return +sessionStorage.getItem(ImageSwitcher.STORAGE_NUM);
    }

    _setStoredSrc(src) {
        sessionStorage.setItem(ImageSwitcher.STORAGE_SRC, src);
    }
    _setStoredNum(num) {
        sessionStorage.setItem(ImageSwitcher.STORAGE_NUM, num);
    }

    * numberGenerator(min, max) {
        this.current = this._getStoredNum() ? this._getStoredNum() + 1 : min;
        while (true) {
            console.warn('Current slide number changed');
            yield this.current;
            this.current = this.current === max ? min : this.current + 1;
            this._setStoredNum(this.current);
        }
    }
    
    /**
     *  morning: '06.00 -> 11.59',
     * 
     *  day    : '12.00 -> 17.59',
     * 
     *  evening: '18.00 -> 23.59',
     * 
     *  night  : '00.00 -> 05.59',
     */

    calculateDate() {
        const hours = new Date().getHours();
        switch (true) {
            default:
            case (hours >=  6 && hours <= 11): return 'morning';
            case (hours >= 12 && hours <= 17): return 'day';
            case (hours >= 18 && hours <= 23): return 'evening';
            case (hours >=  0 && hours <=  5): return 'night';
        }
    }

    getSrc(dayTime, imgNum) {
        return `https://raw.githubusercontent.com
            /rolling-scopes-school
            /stage1-tasks/assets/images
            /${dayTime}/${imgNum < 10 ? `0` + imgNum : imgNum}.jpg
        `.replace(/ /g, '');
    }

    changeImageSrc(src) {
        this.imgElement.src = src;
        this._setStoredSrc(src);
    }

    next() {
        const dayTime = this.calculateDate();
        const nextNum = this.numberGenerator.next().value;
        this.changeImageSrc( this.getSrc(dayTime, nextNum) );
        console.warn('Changing image');
    }
}