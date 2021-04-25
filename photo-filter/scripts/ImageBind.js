export class ImageBind {
    errors = {
        notString: 'Accepted argument is not a string',
        noSuchImageElement: 'The DOM doesn\'t contain such <img /> element',
    };

    /**
     * @param {string} imgSelector
     */

    constructor(imgSelector, noMessage = false) {
        this.imgElement = this.bindImage(imgSelector, noMessage);
    }

    bindImage(imgSelector, noMessage) {
        if (typeof imgSelector !== 'string') {
            throw new Error(this.errors.notString);
        }
        if (!document.querySelector(imgSelector)) {
            throw new Error(this.errors.noSuchImageElement);
        }
        this.imgElement = document.querySelector(imgSelector);
        if (!noMessage) console.warn('Image was bind');
        return this.imgElement;
    }
}