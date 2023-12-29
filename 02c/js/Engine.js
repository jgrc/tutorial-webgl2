'use strict'
class Engine {
    #ctx;
    #program;
    #width;
    #height;
    
    constructor(canvas) {
        const vertexShaderSource = `#version 300 es
            precision highp float;
            in vec2 a_position;
            uniform mat3 u_transform;

            void main() {
                gl_Position = vec4(u_transform * vec3(a_position, 1), 1);
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
        this.#width = 600;
        this.#height = 400;
        canvas.width = this.#width;
        canvas.height = this.#height;
        this.#ctx = canvas.getContext('webgl2');
        if (!this.#ctx) {
            throw 'Your browser does not support webgl2';
        }
        this.#program = Webgl.createProgram(this.#ctx, vertexShaderSource, fragmentShaderSource);
        this.#drawAll();
    }

    #drawAll() {
        this.#ctx.viewport(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
        const positionAttr = this.#ctx.getAttribLocation(this.#program, 'a_position');
        const transformUniform = this.#ctx.getUniformLocation(this.#program, 'u_transform');
        const colorUniform = this.#ctx.getUniformLocation(this.#program, 'u_color');
        this.#drawLoop(positionAttr, transformUniform, colorUniform);
    }

    #drawLoop(positionAttr, transformUniform, colorUniform) {
        this.#clear();
        this.#drawTriangle(positionAttr, transformUniform, colorUniform);
        this.#drawRectangle(positionAttr, transformUniform, colorUniform);
        window.requestAnimationFrame(() => this.#drawLoop(positionAttr, transformUniform, colorUniform));
    }

    #clear() {
        this.#ctx.clearColor(0, 0, 0, 1);
        this.#ctx.clear(this.#ctx.COLOR_BUFFER_BIT);
    }

    #drawTriangle(positionAttr, transformUniform, colorUniform) {
        const blockSize = 2;
        const coords = new Float32Array([
            0, 0,
            0, -1,
            1.4, 0
        ]);
        const totalBlocks = coords.length / blockSize;
        const color = [1, 0, 0, 1];
        const transform = Matrix3.identity()
            .scale(100, 100)
            .rotate(Date.now() / 1000)
            .translate(200, 200)
            .resolution(this.#width, this.#height);
        this.#ctx.enableVertexAttribArray(positionAttr);
        this.#ctx.bindBuffer(this.#ctx.ARRAY_BUFFER, this.#ctx.createBuffer());
        this.#ctx.bufferData(this.#ctx.ARRAY_BUFFER, coords, this.#ctx.STATIC_DRAW);
        this.#ctx.vertexAttribPointer(positionAttr, blockSize, this.#ctx.FLOAT, false, 0, 0);
        this.#ctx.uniformMatrix3fv(transformUniform, false, transform.matrix);
        this.#ctx.uniform4fv(colorUniform, color);
        this.#ctx.drawArrays(this.#ctx.TRIANGLES, 0, totalBlocks);
        this.#ctx.disableVertexAttribArray(positionAttr);
    }

    #drawRectangle(positionAttr, transformUniform, colorUniform) {
        const blockSize = 2;
        const coords = new Float32Array([
            -0.5, -0.5,
            -0.5, 0.5,
            0.5, 0.5,
            -0.5, -0.5,
            0.5, -0.5,
        ]);
        const totalBlocks = coords.length / blockSize;
        const color = [1, 1, 0, 1];
        const transform = Matrix3.identity()
            .scale(100, 100)
            .rotate(Date.now() / -1000)
            .translate(90, 310)
            .resolution(this.#width, this.#height);
        this.#ctx.enableVertexAttribArray(positionAttr);
        this.#ctx.bindBuffer(this.#ctx.ARRAY_BUFFER, this.#ctx.createBuffer());
        this.#ctx.bufferData(this.#ctx.ARRAY_BUFFER, coords, this.#ctx.STATIC_DRAW);
        this.#ctx.vertexAttribPointer(positionAttr, blockSize, this.#ctx.FLOAT, false, 0, 0);
        this.#ctx.uniformMatrix3fv(transformUniform, false, transform.matrix);
        this.#ctx.uniform4fv(colorUniform, color);
        this.#ctx.drawArrays(this.#ctx.TRIANGLE_STRIP, 0, totalBlocks);
        this.#ctx.disableVertexAttribArray(positionAttr);
    }
}