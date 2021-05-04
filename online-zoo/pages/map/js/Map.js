export class Map {
    messages = {
        notSvg: `First Constructor() argument should be a <svg> element`,
        noViewBox: `<svg> element should contain 'viewBox' attribute`,
        notGroupElement: `Svg container should be a group element`,
        noSuchElement: (selector) => `DOM does not contain ${selector} element`,
    };

    static STORAGE = {
        VIEWBOX: 'MAP_VIEWBOX'
    };

    static animations = {
        linear: (timeFraction) => timeFraction,
        pow2: (timeFraction) => Math.pow(timeFraction, 2),
    };

    constructor(svgSelector, svgContainerSelector) {
        this.svg = document.querySelector(svgSelector);
        this.svgContainer = this.svg.querySelector(svgContainerSelector);

        if (!this.svg) throw new Error(this.messages.noSuchElement(svgSelector));
        if (!this.svgContainer) throw new Error(this.messages.noSuchElement(svgContainerSelector));
        if (!this.svg.getAttribute('viewBox')) throw new Error(this.messages.noViewBox);
        if (this.svg.tagName !== 'svg') throw Error(this.messages.notSvg);
        if (this.svgContainer.tagName !== 'g') throw Error(this.messages.notGroupElement);

        this.containerOffset = { x: 0, y: 250 };
        this.zoomStep = 0.2;
        this._toFixed = 3;

        this.limits = {
            zoom: {
                min: {w:  500, h: null},
                max: {w: 3000, h: null},
            },
            move: {
                xAxis: { min: -1200, max: 1200, },
                yAxis: { min: -600, max: 600, },
                threshold: 75,
            }
        };

        this._initialize();
    }

    /** Service */

    _initialize() {
        const {max: { w: limW, h: limH }} = this.limits.zoom;
        const [w, h] = [window.innerWidth, window.innerHeight];
        const storedViewBox = this._getStorageViewBox();
        const initialViewBox = [0, 0, limW ? limW : w, limH ? limH : h];
        this.setViewBox(storedViewBox ? storedViewBox : initialViewBox);
    }

    _setStorageViewBox(array) {
        sessionStorage.setItem(Map.STORAGE.VIEWBOX, JSON.stringify(array));
    }

    _getStorageViewBox() {
        return JSON.parse(
            sessionStorage.getItem(Map.STORAGE.VIEWBOX)
        )?.map(v => Number(v));
    }

    _round(values, accuracy = this._toFixed) {
        const round = (v) => Number(v).toFixed(accuracy);
        return !Array.isArray(values) ? round(values) : values.map(v => round(v));
    }

    /** Main */

    getViewBox() {
        return Array.from(
            this.svg.getAttribute('viewBox').split(' ')
            .map(v => Number(v))
        );
    }

    setViewBox([x1, y1, w1, h1], {
        duration = null, callback = () => '',
        timing = Map.animations.linear,
    } = {}) {
        this._setStorageViewBox(this._round([x1, y1, w1, h1]));
        if (!duration) {
            const [rx1, ry1, rw1, rh1] = this._round([x1, y1, w1, h1]);
            return this.svg.setAttribute('viewBox', `${rx1} ${ry1} ${rw1} ${rh1}`);
        }
        const [x, y, w, h] = this.getViewBox();
        const [dx, dy, dw, dh] = [x1 - x, y1 - y, w1 - w, h1 - h];
        this._animate({
            duration, timing,
            draw: (progress) => {
                if (progress >= 1) return callback();
                const [px, py, pw, ph] = [dx, dy, dw, dh].map(v => progress * v);
                const [rx, ry, rw, rh] = this._round([x + px, y + py, w + pw, h + ph]);
                this.svg.setAttribute('viewBox', `${rx} ${ry} ${rw} ${rh}`);
            },
        });
    }

    _animate({ timing, draw, duration }) {
        let start = performance.now();
        requestAnimationFrame(function animate(time) {
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;
            let progress = timing.call(this, timeFraction);
            draw.call(this, progress);
            if (timeFraction < 1) requestAnimationFrame(animate);
        }.bind(this));
    }

    setFullscreen() {
        const containerWidth = this.svgContainer.getBBox().width;
        this.containerOffset.x = (window.innerWidth - containerWidth) / 2;
        let prevInnerWidth = window.innerWidth;
        const onResize = () => {
            const dx = window.innerWidth === prevInnerWidth ? 0 :
                (window.innerWidth - prevInnerWidth) / 2;
            this.svgContainer.style.setProperty(
                `transform`, `translate(${this.containerOffset.x += dx}px, ${this.containerOffset.y}px)`
            );
            prevInnerWidth = window.innerWidth;
        };
        onResize();
        window.addEventListener('resize', onResize);
        this.svg.style.setProperty('width', '100vw');
        this.svg.style.setProperty('height', '100vh');
    }

    createNormalizer() {
        const CTM = this.svg.getScreenCTM();
        return (...values) => {
            const resultArray = values.map(v => (v - CTM.e) / CTM.a);
            return resultArray.length === 1 ? resultArray.pop() : resultArray;
        };
    }

    /** Map actions */

    _checkZoomLimits(sign) {
        const {min, max} = this.limits.zoom;
        const [,, w, h] = this.getViewBox();
        switch (true) {
            case min.w && w <= min.w && sign === +1:
            case min.h && h <= min.h && sign === +1:
            case max.w && w >= max.w && sign === -1:
            case max.h && h >= max.h && sign === -1:
            return true;
        }
        return false;
    }

    _zoomEvent({ 
        zoomStep = this.zoomStep, duration = 250, clientX = 0, clientY = 0 
    }, sign) {
        if (this._checkZoomLimits(sign)) return;
        const [x, y, w, h] = this.getViewBox();
        this.setViewBox([
            x + sign * w * zoomStep / 2 - 0.25 * w * zoomStep,
            y + sign * y * zoomStep / 2 - 0.25 * h * zoomStep,
            w - sign * w * zoomStep,
            h - sign * h * zoomStep,
        ], { duration, timing: Map.animations.pow2 });
    }

    _checkMoveLimits(dx, dy) {
        const normalize = this.createNormalizer();
        const {xAxis, yAxis} = this.limits.move;
        const [xSign, ySign] = [Math.sign(dx), Math.sign(dy)];
        const {width, height} = this.svgContainer.getBBox();
        const {x, y} = this.svgContainer.getBoundingClientRect();
        switch(true) {
            case xAxis.min && normalize(x) - normalize(dx) <= xAxis.min && xSign === -1:
            case yAxis.min && normalize(y) - normalize(dy) <= yAxis.min && ySign === -1:
            case xAxis.max && normalize(window.innerWidth)  - normalize(x) - width  <= -xAxis.max && xSign === +1:
            case yAxis.max && normalize(window.innerHeight) - normalize(y) - height <= -yAxis.max && ySign === +1:
            return true;
        }
        return false;
    }

    _move(dx, dy) {
        if (this._checkMoveLimits(dx, dy)) return;
        const [x, y, w, h] = this.getViewBox();
        this.setViewBox([ x - dx, y - dy, w, h ]);
    }

    _splitMoveCall(dx, dy) {
        const callsArray = [];
        const {threshold} = this.limits.move;
        const count = Math.ceil(
            Math.max(
                Math.abs(dx / threshold), 
                Math.abs(dy / threshold),
            )
        );
        if (count <= 1) return this._move(dx, dy);
        for (let i = 1; i <= count; i++) {
            callsArray.push({
                dx: i * threshold <= Math.abs(dx) ? Math.sign(dx) * threshold : 0,
                dy: i * threshold <= Math.abs(dy) ? Math.sign(dy) * threshold : 0,
            });
        }
        callsArray.push({ dx: dx % threshold, dy: dy % threshold });
        callsArray.forEach(({dx, dy}) => this._move(dx, dy));
    }
    
    /** Action interface */

    zoomIn(...props) {
        this._zoomEvent(...props, +1);
    }

    zoomOut(...props) {
        this._zoomEvent(...props, -1);
    }

    move(...props) {
        this._splitMoveCall(...props);
    }
}