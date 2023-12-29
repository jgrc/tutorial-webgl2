'use strict'
class Engine {
    #ctx;
    
    constructor(canvas) {
        const vertexShaderSource = `#version 300 es
            precision highp float;
            in vec2 a_position;
            
            void main() {
                gl_Position = vec4(a_position, 0, 1);
            }
        `;
        const fragmentShaderSource = `#version 300 es
            precision highp float;
            out vec4 outColor;
            uniform vec4 u_color;

            void main() {
                outColor = u_color;
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
        const colorUniform = this.#ctx.getUniformLocation(program, 'u_color');
        this.#clear();
        this.#drawTriangle(positionAttr, colorUniform);
        this.#drawRectangle(positionAttr, colorUniform);
    }

    #clear() {
        this.#ctx.clearColor(0, 0, 0, 1);
        this.#ctx.clear(this.#ctx.COLOR_BUFFER_BIT);
    }

    #drawTriangle(positionAttr, colorUniform) {
        const blockSize = 2;
        const coords = new Float32Array([
            0, 0,
            0, 0.5,
            0.7, 0
        ]);
        const totalBlocks = coords.length / blockSize;
        const color = [1, 0, 0, 1];
        this.#ctx.enableVertexAttribArray(positionAttr);
        this.#ctx.bindBuffer(this.#ctx.ARRAY_BUFFER, this.#ctx.createBuffer());
        this.#ctx.bufferData(this.#ctx.ARRAY_BUFFER, coords, this.#ctx.STATIC_DRAW);
        this.#ctx.vertexAttribPointer(positionAttr, blockSize, this.#ctx.FLOAT, false, 0, 0);
        this.#ctx.uniform4fv(colorUniform, color);
        this.#ctx.drawArrays(this.#ctx.TRIANGLES, 0, totalBlocks);
        this.#ctx.disableVertexAttribArray(positionAttr);
    }

    #drawRectangle(positionAttr, colorUniform) {
        const blockSize = 2;
        const coords = new Float32Array([
            -0.8, -0.8,
            -0.8, -0.3,
            -0.3, -0.3,
            -0.8, -0.8,
            -0.3, -0.8
        ]);
        const totalBlocks = coords.length / blockSize;
        const color = [1, 1, 0, 1];
        this.#ctx.enableVertexAttribArray(positionAttr);
        this.#ctx.bindBuffer(this.#ctx.ARRAY_BUFFER, this.#ctx.createBuffer());
        this.#ctx.bufferData(this.#ctx.ARRAY_BUFFER, coords, this.#ctx.STATIC_DRAW);
        this.#ctx.vertexAttribPointer(positionAttr, blockSize, this.#ctx.FLOAT, false, 0, 0);
        this.#ctx.uniform4fv(colorUniform, color);
        this.#ctx.drawArrays(this.#ctx.TRIANGLE_STRIP, 0, totalBlocks);
        this.#ctx.disableVertexAttribArray(positionAttr);
    }
}