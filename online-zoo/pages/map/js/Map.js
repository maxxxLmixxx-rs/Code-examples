export class Map {
    messages = {
        notSvg: `First Constructor() argument should be a <svg> element`,
        noViewBox: `<svg> element should contain 'viewBox' attribute`,
        notGroupElement: `Svg container should be a group element`,
        noSuchElement: (selector) => `DOM does not contain ${selector} element`,
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
    }

    _round(values, accuracy = this._toFixed) {
        const round = (v) => Number(v).toFixed(accuracy);
        return !Array.isArray(values) ? round(values) : values.map(v => round(v));
    }

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
        if (!duration) {
            const [rx1, ry1, rw1, rh1] = [x1, y1, w1, h1].map(v => this._round(v));
            return this.svg.setAttribute('viewBox', `${rx1} ${ry1} ${rw1} ${rh1}`);
        }
        const [x, y, w, h] = this.getViewBox();
        const [dx, dy, dw, dh] = [x1 - x, y1 - y, w1 - w, h1 - h];
        this._animate({
            duration, timing,
            draw: (progress) => {
                if (progress >= 1) return callback();
                const [px, py, pw, ph] = [dx, dy, dw, dh].map(v => progress * v);
                const [rx, ry, rw, rh] =
                    [x + px, y + py, w + pw, h + ph].map(v => this._round(v));
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
            this.setViewBox([0, 0, window.innerWidth, window.innerHeight]);
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
        return (...values) => values.map(v => (v - CTM.e) / CTM.a);
    }

    _zoomEvent({ 
        zoomStep = this.zoomStep, duration = 250, clientX = 0, clientY = 0 
    }, sign) {
        const [x, y, w, h] = this.getViewBox();
        this.setViewBox([
            x + sign * w * zoomStep / 2,
            y + sign * y * zoomStep / 2,
            w - sign * w * zoomStep,
            h - sign * h * zoomStep,
        ], {
            duration, timing: Map.animations.pow2,
        });
    }

    zoomIn(props) {
        this._zoomEvent(props, +1);
    }

    zoomOut(props) {
        this._zoomEvent(props, -1);
    }

    move(dx, dy) {
        const [x, y, w, h] = this.getViewBox();
        this.setViewBox([ x - dx, y - dy, w, h ]);
    }
}