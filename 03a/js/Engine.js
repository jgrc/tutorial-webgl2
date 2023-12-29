'use strict'
class Engine {
    #ctx;
    
    constructor(canvas) {
        const vertexShaderSource = `#version 300 es
            precision highp float;
            in vec3 a_position;
            in vec4 a_color;
            out vec4 v_color;

            void main() {
                gl_Position = vec4(a_position, 1);
                v_color = a_color;
            }
        `;
        const fragmentShaderSource = `#version 300 es
            precision highp float;
            in vec4 v_color;
            out vec4 color;

            void main() {
                color = v_color;
            }
        `;
        this.#ctx = canvas.getContext('webgl2');
        if (!this.#ctx) {
            throw 'Your browser does not support webgl2';
        }
        canvas.width = 400;
        canvas.height = 400;
        this.#init(vertexShaderSource, fragmentShaderSource);
    }

    #init(vertexShaderSource, fragmentShaderSource) {
        const vertexShader = this.#createShader(this.#ctx.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.#createShader(this.#ctx.FRAGMENT_SHADER, fragmentShaderSource);
        const program = this.#createProgram(vertexShader, fragmentShader);
        this.#ctx.linkProgram(program);
        this.#ctx.useProgram(program);
        this.#drawAll(program);
        this.#ctx.deleteProgram(program);
    }

    #createShader(type, source) {
        const shader = this.#ctx.createShader(type);
        this.#ctx.shaderSource(shader, source);
        this.#ctx.compileShader(shader);
        if (!this.#ctx.getShaderParameter(shader, this.#ctx.COMPILE_STATUS)) {
            console.error(this.#ctx.getShaderInfoLog(shader));
            throw 'Error in your shader';
        }
        
        return shader;
    }

    #createProgram(vertexShader, fragmentShader) {
        const program = this.#ctx.createProgram();
        this.#ctx.attachShader(program, vertexShader);
        this.#ctx.attachShader(program, fragmentShader);
        return program;
    }

    #drawAll(program) {
        this.#ctx.viewport(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
        const positionAttr = this.#ctx.getAttribLocation(program, 'a_position');
        const colorAttr = this.#ctx.getAttribLocation(program, 'a_color');
        this.#clear();
        this.#ctx.enableVertexAttribArray(positionAttr);
        this.#ctx.enableVertexAttribArray(colorAttr);
        this.#drawTriangle(positionAttr, colorAttr);
        this.#ctx.disableVertexAttribArray(positionAttr);
        this.#ctx.disableVertexAttribArray(colorAttr);
    }

    #clear() {
        this.#ctx.clearColor(0, 0, 0, 1);
        this.#ctx.clear(this.#ctx.COLOR_BUFFER_BIT);
    }

    #drawTriangle(positionAttr, colorAttr) {
        const coordsBlockSize = 2;
        const coords = new Float32Array([
            -0.8, 0.8,
            0.8, -0.8,
            -0.8, -0.8
        ]);
        const colorsBlockSize = 4;
        const colors = new Float32Array([
            1, 0, 0, 1,
            0, 1, 0, 1,
            0, 0, 1, 1
        ]);
        const totalBlocks = coords.length / coordsBlockSize;
        this.#ctx.bindBuffer(this.#ctx.ARRAY_BUFFER, this.#ctx.createBuffer());
        this.#ctx.bufferData(this.#ctx.ARRAY_BUFFER, coords, this.#ctx.STATIC_DRAW);
        this.#ctx.vertexAttribPointer(positionAttr, coordsBlockSize, this.#ctx.FLOAT, false, 0, 0);
        this.#ctx.bindBuffer(this.#ctx.ARRAY_BUFFER, this.#ctx.createBuffer());
        this.#ctx.bufferData(this.#ctx.ARRAY_BUFFER, colors, this.#ctx.STATIC_DRAW);
        this.#ctx.vertexAttribPointer(colorAttr, colorsBlockSize, this.#ctx.FLOAT, false, 0, 0);
        this.#ctx.drawArrays(this.#ctx.TRIANGLES, 0, totalBlocks);
    }
}