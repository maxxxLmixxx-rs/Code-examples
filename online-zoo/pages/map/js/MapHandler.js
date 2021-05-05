import {Map} from './Map.js';

export class MapHandler {
    messages = {
        notMap: 'Constructor() parameter should be Map instance'
    }

    constructor(map) {
        if (!map instanceof Map) throw new Error(this.messages.notMap);
        this.map = map;
        this.map.initialize([-745, -1525, 2885, 4050]);
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

    _mouseMove() {
        const prev = { x: null, y: null };
        const normalize = this.map.createNormalizer();
        return ({clientX, clientY}) => {
            [clientX, clientY] = normalize(clientX, clientY);
            if (prev.x === null || prev.y === null) {
                return [prev.x, prev.y] = [clientX, clientY];
            }
            this.map.move(clientX - prev.x, clientY - prev.y);
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
        const wheel = ({ ctrlKey, deltaY, clientX, clientY }) => {
            if (ctrlKey) return;
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