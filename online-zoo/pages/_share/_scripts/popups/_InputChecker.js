export function InputChecker({ target, checker: { eventType, check } }) {
    function createGetter(context, name, valueFunction) {
        return Object.defineProperty(context, name, {
            get() {
                return valueFunction();
            }
        });
    }
    
    let status = null;
    createGetter(this, 'status', $=> status);
    createGetter(this, 'element', $=> element);
    createGetter(this, 'checkFunction', $=> checkFunction);
    target.addEventListener(eventType, event => {
        status = check(event);
        this.ifAllowed();
    });
}

InputChecker.prototype.ifAllowed = () => '';

InputChecker.getIsBlankChecker = () => {
    return {
        eventType: 'input',
        check: ({ target: {value} }) => !!value.trim()
    };
};

InputChecker.getIsLengthChecker = (length) => {
    return {
        eventType: 'input',
        check: ({ target: {value} }) => value.length >= length,
    }
};

InputChecker.getIsCheckedChecker = () => {
    return {
        eventType: 'change',
        check: ({ target: {checked} }) => checked,
    };
};