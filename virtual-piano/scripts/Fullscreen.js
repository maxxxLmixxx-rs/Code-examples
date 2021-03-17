class Fullscreen {
    constructor(element = document.documentElement) {
        this.element = element;
    }

    showState() {
        return !!document.fullscreenElement;
    }

    inFull() {
        if (!document.fullscreenElement) {
            this.element.requestFullscreen();
        }
    }

    outFull() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
}

export default Fullscreen;