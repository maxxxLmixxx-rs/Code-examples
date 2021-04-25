const createGetter = (context, name, value) => {
    return Object.defineProperty(context, name, {
        get() { return value(); },
    });
};
const createFunction = (context, name, callback) => {
    return Object.defineProperty(context, name, {
        value: callback,
        writable: false,
        configurable: false,
    });
};

export function Filter({filterName, varFallback, inputQuery, outputQuery}) {
    /* --> Initialize */
    createGetter(this, 'input',  $=> document.querySelector(inputQuery));
    createGetter(this, 'output', $=> document.querySelector(outputQuery));

    createGetter(this, 'value',   $=> this.input.value);
    createGetter(this, 'toReset', $=> varFallback.replace(/[^0-9]/g, ''));
    createGetter(this, 'unit',  $=> varFallback.replace(/[0-9]/g, ''));

    createGetter(this, 'name',   $=> filterName);
    createGetter(this, 'cssVar', $=> '--' + this.name);
    
    createGetter(this, 'style', $=> `${this.name}(var(${this.cssVar}, ${varFallback}))`);
    createGetter(this, 'ctxFilter', $=> `${filterName}(${this.value + this.unit})`);

    /* Errors check */
    switch (false) {
        case this.output:
            console.warn(`DOM doesn't contain '${outputQuery}' element`);
        case this.input:
            throw new Error(`No such <input /> element for selector: ${inputQuery}`);
        case this.input.type == 'range':
            throw new Error(`<input /> element type attribute is not 'range'`);
    }

    /* --> reset */
    createFunction(this, 'reset', () => {
        if(this.output) this.output.value = this.toReset;
        this.input.value = this.toReset;
    });

    /* --> onChange hook */
    const onChangeCallbacks = [];
    createFunction(this, 'setOnChangeCallback', (callback) => {
        onChangeCallbacks.push(callback);
        return onChangeCallbacks.slice();
    });

    /* Session storage */
    const updateInput = (value) => {
        if(this.output) this.output.innerText = value;
        this.input.setAttribute('value', value);
        sessionStorage.setItem(filterName, value);
    };

    if (sessionStorage.getItem(filterName)) {
        updateInput(sessionStorage.getItem(filterName));
    }

    /* Bind input */
    const callFunctions = (callbacks) => {
        callbacks.forEach(func => func());
    };
    this.input.addEventListener('input', ({ target: {value} }) => {
        callFunctions(onChangeCallbacks);
        updateInput(value);
    });

    updateInput(this.input.value);
}

export function BlurFilter(img, props) {
    Object.setPrototypeOf(this, new Filter(props));
    const calculateMultiplier = () => {
        const [ 
            {naturalWidth, naturalHeight},
            {width, height} 
        ] = [ img, img.getBoundingClientRect() ];
        if (!naturalWidth || !naturalHeight) return 1;
        return Math.trunc(Math.max(naturalWidth / width, naturalHeight / height));
    };
    createGetter(this, 'ctxFilter', $=> `${this.name}(${this.value * calculateMultiplier() + this.unit})`);
};

export const filtersArray = (imgQuery) => [
    new BlurFilter(document.querySelector(imgQuery),
               {filterName: 'blur'      , varFallback: '0px' , inputQuery: '[name=blur]'    , outputQuery: '[name=blur]+[name=result]'    }),
    new Filter({filterName: 'invert'    , varFallback: '0%'  , inputQuery: '[name=invert]'  , outputQuery: '[name=invert]+[name=result]'  }),
    new Filter({filterName: 'sepia'     , varFallback: '0%'  , inputQuery: '[name=sepia]'   , outputQuery: '[name=sepia]+[name=result]'   }),
    new Filter({filterName: 'saturate'  , varFallback: '100%', inputQuery: '[name=saturate]', outputQuery: '[name=saturate]+[name=result]'}),
    new Filter({filterName: 'hue-rotate', varFallback: '0deg', inputQuery: '[name=hue]'     , outputQuery: '[name=hue]+[name=result]'     }),
];