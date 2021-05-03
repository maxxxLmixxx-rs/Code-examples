export class Map {
    messages = {
        notSvg: `First Constructor() argument should be a <svg> element`,
        noViewBox: `<svg> element doesn't contain viewBox.`,
        noZoomIn: `Maximum zoom in.`,
        noZoomOut: `Maximum zoom out.`,
        noInnerElementWidth: 'Inner svg should contain width attribute',
        noDOMElement: 'No such DOM element'
    };

    constructor(svgMapSelector, innerSvgContainerSelector) {
        this.svg = document.querySelector(svgMapSelector);
        if (this.svg.tagName !== 'svg') throw new Error(this.messages.notSvg);
        if (!this.svg.getAttribute('viewBox')) throw new Error(this.messages.noViewBox);

        this.svgContainer = this.svg.querySelector(innerSvgContainerSelector);
        if (!this.svgContainer) throw new Error(this.messages.noDOMElement);
        if (!this.svgContainer.getAttribute('width')) throw new Error(this.messages.noInnerElementWidth);

        this.baseVal = this.svg.getAttribute('viewBox').split(' ').map(n => +n);
        this.scale = 1;
        this.moveX = 0;
        this.moveY = 0;

        this.limits = {
            zoom: {
                in: 5.0,
                out: .1,
            }
        }
    }

    setFullscreen() {     
        this.svgContainer.style.setProperty('--scale', '1');
        
        let lastInnerWidth = window.innerWidth;
        let lastInnerHeight = window.innerHeight;

        const {width, height} = this.svg.getBoundingClientRect();
        this.update([0, 0, width, height]);

        const onResize = () => {
            const diffX = window.innerWidth - lastInnerWidth;
            const diffY = window.innerHeight - lastInnerHeight;

            /* Center inner svg based on it's width */
            const {width} = this.svg.getBoundingClientRect();
            const xOffset = (width - this.svgContainer.getAttribute('width')) / 2;
            this.svgContainer.setAttribute('x', xOffset);
            
            /* Resize viewBox */
            this.update([
                this.baseVal[0], this.baseVal[1], 
                this.baseVal[2] + diffX, this.baseVal[3]
            ]);
            this.update([
                this.baseVal[0], this.baseVal[1], 
                this.baseVal[2], this.baseVal[3] + diffY
            ]);
            lastInnerWidth = window.innerWidth;
            lastInnerHeight = window.innerHeight;
        };
        onResize();
        window.addEventListener('resize', onResize);
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


    _animateMove({ currentX, initialX, currentY, initialY }) {
        this._animate({
            duration: 100,
            draw: (progress) => {
                let dx = currentX - initialX;
                let dy = currentY - initialY;
                this.svgContainer.style.setProperty('--move-x', initialX + dx * progress + 'px');
                this.svgContainer.style.setProperty('--move-y', initialY + dy * progress + 'px');
            },
            timing: (timeFraction) => timeFraction,
        });
    }

    _animateZoom({ currentZoom, initialZoom }) {
        this._animate({
            duration: 100,
            draw: (progress) => {
                let dx = currentZoom - initialZoom;
                this.svgContainer.style.setProperty('--scale', initialZoom + dx * progress);
            },
            timing: (timeFraction) => Math.pow(timeFraction, 2),
        });
    }

    update(baseVal) {
        const rounded = baseVal.map(v => +v);
        this.baseVal = rounded;
        this.svg.setAttribute('viewBox', rounded.join(' '));
    }

    _nextZoom(zoomStep, sign) {
        return this.scale + Math.sign(sign) * this.scale * zoomStep;
    }

    _zoomEvent(zoomStep, eventName) {
        const initialZoom = this.scale;
        const currentZoom = eventName === 'zoomIn' ? 
            this._nextZoom(zoomStep, +1):
            this._nextZoom(zoomStep, -1);
        this._animateZoom({ currentZoom, initialZoom });
        this.scale = currentZoom;
    }

    /* Interface */

    _isZoomLimit() {
        const { zoom } = this.limits;
        if (this.scale >= zoom.in) return 'in';
        if (this.scale <= zoom.out) return 'out'
        return false;
    }

    zoomIn(zoomStep) {
        if (this._isZoomLimit() === 'in') return;
        this._zoomEvent(zoomStep, 'zoomIn');
    }

    zoomOut(zoomStep) {
        if (this._isZoomLimit() === 'out') return;
        this._zoomEvent(zoomStep, 'zoomOut');
    }

    move(x, y) {
        this._animateMove({
            currentX: this.moveX + x,
            initialX: this.moveX,
            currentY: this.moveY + y,
            initialY: this.moveY,
        });
        this.moveX += x;
        this.moveY += y;
    }
}