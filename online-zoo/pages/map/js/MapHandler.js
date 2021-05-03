import {Map} from './Map.js';

export class MapHandler {
    messages = {
        notMap: 'Constructor() parameter should be Map instance'
    }

    constructor(map) {
        if (!map instanceof Map) throw new Error(this.messages.notMap);
        this.map = map;
        this.map.setFullscreen();
        this.zoomStep = 0.1;
    }

    _mouseMove() {
        const prev = { x: null, y: null };
        const divider = 1.2;
        return ({pageX, pageY}) => {
            if (prev.x === null || prev.y === null) {
                prev.x = pageX;
                prev.y = pageY;
                return;
            }
            this.map.move((pageX - prev.x) / divider, (pageY - prev.y) / divider);
            prev.x = pageX; 
            prev.y = pageY;
        };
    }

    startScrollEvent(step = this.zoomStep) {
        document.addEventListener('wheel', ({ deltaY }) => {
            if (Math.sign(deltaY) < 0) {
                this.map.zoomIn(step || this.zoomStep);
            } else {
                this.map.zoomOut(step || this.zoomStep);
            }
        });
    }

    startDragEvents() {
        const draggableElement = this.map.svgContainer;
        draggableElement.addEventListener('mousedown', () => {
            const dragstart = (event) => event.preventDefault();
            const mousemove = this._mouseMove();
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

    bindZoomIn({eventType = 'click', step, element}) {
        element.addEventListener(eventType, event => {
            this.map.zoomIn(step || this.zoomStep);
        });
    }

    bindZoomOut({eventType = 'click', step, element}) {
        element.addEventListener(eventType, event => {
            this.map.zoomOut(step || this.zoomStep);
        });
    }
}