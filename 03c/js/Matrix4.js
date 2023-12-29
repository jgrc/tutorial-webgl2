'use strict'
class Matrix4 {
    #matrix;
    
    constructor(matrix) {
        this.#matrix = matrix;
    }

    get matrix() {
        return this.#matrix;
    }

    rotateX(rad) {
        const c = Math.cos(rad);
        const s = Math.sin(rad);

        this.#matrix = this.#multiply(
            [
                1, 0, 0, 0,
                0, c, -s, 0,
                0, s, c, 0,
                0, 0, 0, 1
            ]
        );
        
        return this;
    }

    rotateY(rad) {
        const c = Math.cos(rad);
        const s = Math.sin(rad);

        this.#matrix = this.#multiply(
            [
                c, 0, s, 0,
                0, 1, 0, 0,
                -s, 0, c, 0,
                0, 0, 0, 1
            ]
        );
        
        return this;
    }

    rotateZ(rad) {
        const c = Math.cos(rad);
        const s = Math.sin(rad);

        this.#matrix = this.#multiply(
            [
                c, -s, 0, 0,
                s, c, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]
        );
        
        return this;
    }

    scale(sx, sy, sz) {
        this.#matrix = this.#multiply(
            [
                sx, 0, 0, 0,
                0, sy, 0, 0,
                0, 0, sz, 0,
                0, 0, 0, 1
            ]
        );
        
        return this;
    }

    translate(tx, ty, tz) {
        this.#matrix = this.#multiply(
            [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                tx, ty, tz, 1

            ]
        );
        
        return this;
    }

    resolution(width, height, depth) {
        return this
            .scale(2 / width, -2 / height, 2 / depth)
            .translate(-1, 1, 0);
    }

    #multiply(other) {
        return [
            this.#matrix[0] * other[0] + this.#matrix[1] * other[4] + this.#matrix[2] * other[8] + this.#matrix[3] * other[12],
            this.#matrix[0] * other[1] + this.#matrix[1] * other[5] + this.#matrix[2] * other[9] + this.#matrix[3] * other[13],
            this.#matrix[0] * other[2] + this.#matrix[1] * other[6] + this.#matrix[2] * other[10] + this.#matrix[3] * other[14],
            this.#matrix[0] * other[3] + this.#matrix[1] * other[7] + this.#matrix[2] * other[11] + this.#matrix[3] * other[15],
            this.#matrix[4] * other[0] + this.#matrix[5] * other[4] + this.#matrix[6] * other[8] + this.#matrix[7] * other[12],
            this.#matrix[4] * other[1] + this.#matrix[5] * other[5] + this.#matrix[6] * other[9] + this.#matrix[7] * other[13],
            this.#matrix[4] * other[2] + this.#matrix[5] * other[6] + this.#matrix[6] * other[10] + this.#matrix[7] * other[14],
            this.#matrix[4] * other[3] + this.#matrix[5] * other[7] + this.#matrix[6] * other[11] + this.#matrix[7] * other[15],
            this.#matrix[8] * other[0] + this.#matrix[9] * other[4] + this.#matrix[10] * other[8] + this.#matrix[11] * other[12],
            this.#matrix[8] * other[1] + this.#matrix[9] * other[5] + this.#matrix[10] * other[9] + this.#matrix[11] * other[13],
            this.#matrix[8] * other[2] + this.#matrix[9] * other[6] + this.#matrix[10] * other[10] + this.#matrix[11] * other[14],
            this.#matrix[8] * other[3] + this.#matrix[9] * other[7] + this.#matrix[10] * other[11] + this.#matrix[11] * other[15],
            this.#matrix[12] * other[0] + this.#matrix[13] * other[4] + this.#matrix[14] * other[8] + this.#matrix[15] * other[12],
            this.#matrix[12] * other[1] + this.#matrix[13] * other[5] + this.#matrix[14] * other[9] + this.#matrix[15] * other[13],
            this.#matrix[12] * other[2] + this.#matrix[13] * other[6] + this.#matrix[14] * other[10] + this.#matrix[15] * other[14],
            this.#matrix[12] * other[3] + this.#matrix[13] * other[7] + this.#matrix[14] * other[11] + this.#matrix[15] * other[15]
        ];
    }

    static identity() {
        return new Matrix4(
            [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]
        );
    }
}