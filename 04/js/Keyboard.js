'use strict'
class Keyboard {
    #pressed;

    constructor() {
        this.#pressed = {};
        document.body.addEventListener('keydown', evt => this.#pressed[evt.code] = true);
        document.body.addEventListener('keyup', evt => this.#pressed[evt.code] = false);
    }

    is(key) {
        return !!this.#pressed[key];
    }

    static get Key() {
        return {
            UP: "ArrowUp",
            LEFT: "ArrowLeft",
            RIGHT: "ArrowRight",
            DOWN: "ArrowDown",
            SPACE: "Space"
        }
    }
}
