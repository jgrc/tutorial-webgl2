'use strict'
class Matrix3 {
    #matrix;
    
    constructor(matrix) {
        this.#matrix = matrix;
    }

    get matrix() {
        return this.#matrix;
    }

    rotate(rad) {
        const c = Math.cos(rad);
        const s = Math.sin(rad);

        this.#matrix = this.#multiply(
            [
                c, -s, 0,
                s, c, 0,
                0, 0, 1
            ]
        );
        
        return this;
    }

    scale(sx, sy) {
        this.#matrix = this.#multiply(
            [
                sx, 0, 0,
                0, sy, 0,
                0, 0, 1
            ]
        );
        
        return this;
    }

    translate(tx, ty) {
        this.#matrix = this.#multiply(
            [
                1, 0, 0,
                0, 1, 0,
                tx, ty, 1
            ]
        );
        
        return this;
    }

    #multiply(other) {
        return [
            this.#matrix[0] * other[0] + this.#matrix[1] * other[3] + this.#matrix[2] * other[6],
            this.#matrix[0] * other[1] + this.#matrix[1] * other[4] + this.#matrix[2] * other[7],
            this.#matrix[0] * other[2] + this.#matrix[1] * other[5] + this.#matrix[2] * other[8],
            this.#matrix[3] * other[0] + this.#matrix[4] * other[3] + this.#matrix[5] * other[6],
            this.#matrix[3] * other[1] + this.#matrix[4] * other[4] + this.#matrix[5] * other[7],
            this.#matrix[3] * other[2] + this.#matrix[4] * other[5] + this.#matrix[5] * other[8],
            this.#matrix[6] * other[0] + this.#matrix[7] * other[3] + this.#matrix[8] * other[6],
            this.#matrix[6] * other[1] + this.#matrix[7] * other[4] + this.#matrix[8] * other[7],
            this.#matrix[6] * other[2] + this.#matrix[7] * other[5] + this.#matrix[8] * other[8]
        ];
    }

    static identity() {
        return new Matrix3(
            [
                1, 0, 0,
                0, 1, 0,
                0, 0, 1
            ]
        );
    }
}