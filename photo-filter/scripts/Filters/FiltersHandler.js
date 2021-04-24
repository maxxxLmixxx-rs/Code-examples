import {Filter} from './Filter.js';
import {ImageBind} from '../ImageBind.js';

export class FiltersHandler extends ImageBind {
    errors = {
        notFilterInstance: 'Second param should contain only Filter instances',
    };

    static STORAGE_FILTERS = 'filters';

    constructor(imgSelector, filters) {
        super(imgSelector, false);
        const isAllFilters = filters(imgSelector).every(f => f instanceof Filter);
        if (!isAllFilters) throw new Error(this.errors.notFilterInstance);
        this.filters = filters(imgSelector);
        this._initializeStyles(imgSelector);
        this._imageVarSubscribe();
        this._initializeStorage();
    }

    _getStoredFilters() {
        return sessionStorage.getItem(FiltersHandler.STORAGE_FILTERS);
    }

    _setStoredFilters(filterValue) {
        sessionStorage.setItem(FiltersHandler.STORAGE_FILTERS, filterValue);
    }

    _initializeStyles(imgSelector) {
        const styleElement = document.createElement('style');
        styleElement.id = 'filter-styles';
        document.head.appendChild(styleElement);
        styleElement.sheet.insertRule(`
            ${imgSelector} {
                filter: ${this.filters.map(filter => filter.style).join('\n')};
            }`.trim()
        );
    }

    _initializeStorage() {
        if (this._getStoredFilters()) {
            this.imgElement.style.cssText = this._getStoredFilters();
        }
    }

    _imageVarSubscribe() {
        this.filters.forEach(filter => {
            filter.setOnChangeCallback(() => {
                this.imgElement.style
                    .setProperty(filter.cssVar, filter.value + filter.unit);
                this._setStoredFilters(this.imgElement.style.cssText);
            });
        });
    }

    /* Save image */

    _getCanvasFilters() {
        return this.filters.map(f => f.ctxFilter).join(' ');
    }

    getDataURI() {
        if (this.imgElement.src.startsWith('data:image/svg+xml')) {
            return this.imgElement.src;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const {naturalWidth, naturalHeight} = this.imgElement;
        canvas.width = naturalWidth;
        canvas.height = naturalHeight;
        ctx.filter = this._getCanvasFilters();
        ctx.drawImage(this.imgElement, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/png');
    }

    save() {
        const link = document.createElement('a');
        link.download = 'filtered-image';
        link.href = this.getDataURI();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /* Reset filters */

    reset() {
        this.filters.forEach(filter => {
            this.imgElement.style
                .setProperty(filter.cssVar, filter.toReset + filter.unit);
            filter.reset();
            this._setStoredFilters(this.imgElement.style.cssText);
        });
    }
}