import {Map} from './Map.js';

export class MapHandler {
    messages = {
        notMap: 'Constructor() parameter should be Map instance'
    }

    constructor(map) {
        if (!map instanceof Map) throw new Error(this.messages.notMap);
        this.map = map;
        this.map.setFullscreen();
    }

    _throttle(eventFunction, timeFrame) {
        if (!timeFrame) return eventFunction;
        let lastTime = 0;
        return (params) => {
            let now = Date.now();
            if (now - lastTime >= timeFrame) {
                eventFunction(params);
                lastTime = now;
            }
        };
    }

    _splitCall(dx, dy) {
        const callsArray = [];
        const {threshold} = this.map.limits.move;
        const count = Math.ceil(
            Math.max(
                Math.abs(dx / threshold), 
                Math.abs(dy / threshold),
            )
        );
        if (count <= 1) return this.map.move(dx, dy);
        for (let i = 1; i <= count; i++) {
            callsArray.push({
                dx: i * threshold <= Math.abs(dx) ? Math.sign(dx) * threshold : 0,
                dy: i * threshold <= Math.abs(dy) ? Math.sign(dy) * threshold : 0,
            });
        }
        callsArray.push({ dx: dx % threshold, dy: dy % threshold });
        callsArray.forEach(({dx, dy}) => this.map.move(dx, dy));
    }

    _mouseMove() {
        const prev = { x: null, y: null };
        const normalize = this.map.createNormalizer();
        return ({clientX, clientY}) => {
            [clientX, clientY] = normalize(clientX, clientY);
            if (prev.x === null || prev.y === null) {
                return [prev.x, prev.y] = [clientX, clientY];
            }
            this._splitCall(clientX - prev.x, clientY - prev.y);
            [prev.x, prev.y] = [clientX, clientY];
        };
    }

    startDragEvents() {
        const draggableElement = this.map.svgContainer;
        draggableElement.addEventListener('mousedown', () => {
            const dragstart = (event) => event.preventDefault();
            const mousemove = this._throttle(this._mouseMove());
            const clearEvents = () => {
                draggableElement.removeEventListener('dragstart', dragstart);
                document.removeEventListener('mousemove', mousemove);
                document.removeEventListener('mouseup', clearEvents);
            };
            draggableElement.addEventListener('dragstart', dragstart);
            document.addEventListener('mousemove', mousemove);
            document.addEventListener('mouseup', clearEvents);
        });
    }

    startScrollEvent() {
        const wheel = ({ deltaY, clientX, clientY }) => {
            if (Math.sign(deltaY) < 0) {
                this.map.zoomIn({ zoomStep: 0.025, clientX, clientY, duration: null });
            } else {
                this.map.zoomOut({ zoomStep: 0.025, clientX, clientY, duration: null });
            }
        };
        document.addEventListener('wheel', this._throttle(wheel));
    }

    bindZoomIn({eventType = 'click', element, duration, zoomStep}) {
        element.addEventListener(eventType, () => {
            this.map.zoomIn({ zoomStep, duration });
        });
    }

    bindZoomOut({eventType = 'click', element, duration, zoomStep}) {
        element.addEventListener(eventType, () => {
            this.map.zoomOut({ zoomStep, duration });
        });
    }
}