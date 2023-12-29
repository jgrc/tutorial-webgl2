'use strict'
class Engine {
    #ctx;
    #program;
    #width;
    #height;
    
    constructor(canvas) {
        const vertexShaderSource = `#version 300 es
            precision highp float;
            in vec3 a_position;
            in vec4 a_color;
            uniform mat4 u_transform;
            out vec4 v_color;

            void main() {
                gl_Position = u_transform * vec4(a_position, 1);
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
        this.#width = 400;
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
        this.#ctx.enable(this.#ctx.DEPTH_TEST);
        this.#ctx.viewport(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
        const positionAttr = this.#ctx.getAttribLocation(this.#program, 'a_position');
        const colorAttr = this.#ctx.getAttribLocation(this.#program, 'a_color');
        const transformUniform = this.#ctx.getUniformLocation(this.#program, 'u_transform');
        this.#ctx.enableVertexAttribArray(positionAttr);
        this.#ctx.enableVertexAttribArray(colorAttr);
        this.#drawLoop(positionAttr, colorAttr, transformUniform,);
    }

    #drawLoop(positionAttr, colorAttr, transformUniform) {
        this.#clear();
        this.#drawPyramid(positionAttr, colorAttr, transformUniform);
        this.#drawCube(positionAttr, colorAttr, transformUniform);
        window.requestAnimationFrame(() => this.#drawLoop(positionAttr, colorAttr, transformUniform));
    }

    #clear() {
        this.#ctx.clearColor(0, 0, 0, 1);
        this.#ctx.clear(this.#ctx.COLOR_BUFFER_BIT | this.#ctx.DEPTH_BUFFER_BIT);
    }

    #drawPyramid(positionAttr, colorAttr, transformUniform) {
        const coordBlockSize = 3;
        const coords = new Float32Array([
            // Front face
            0.0, 0.5, 0.0,
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            // Right face
            0.0, 0.5, 0.0,
            0.5, -0.5,  0.5,
            0.5, -0.5, -0.5,
            // Back face
            0.0, 0.5, 0.0,
            0.5, -0.5, 0.5,
            -0.5, -0.5, 0.5,
            // Left face
            0.0, 0.5, 0.0,
            -0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5,
            // Base
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, -0.5, -0.5,
            -0.5, -0.5, -0.5
        ]);
        const coordIndex = new Uint16Array([
            0, 1, 2, // Front face
            3, 4, 5, // Right face
            6, 7, 8, // Back face
            9, 10, 11, // Left face
            12, 13, 14, 12, 14, 15 // Base
        ]);
        const colorBlockSize = 4;
        const colors = new Float32Array(
            []
                .concat(this.#repeatColor([0.93, 0.13, 0.55, 1], 3)) // Right face
                .concat(this.#repeatColor([0.76, 0.23, 0.47, 1], 3)) // Right face
                .concat(this.#repeatColor([0.42, 0.12, 0.78, 1], 3)) // Back face
                .concat(this.#repeatColor([0.51, 0.25, 0.67, 1], 3)) // Left face
                .concat(this.#repeatColor([0.98, 0.75, 0.04, 1], 4)) // Base
        );
        const transform = Matrix4.identity()
            .scale(100, 100, 100)
            .rotateX(Date.now() / 1000)
            .rotateY(Date.now() / 1000)
            .rotateZ(Date.now() / 1000)
            .translate(250, 150, 0)
            .resolution(this.#width, this.#height, 200);

        this.#ctx.bindBuffer(this.#ctx.ARRAY_BUFFER, this.#ctx.createBuffer());
        this.#ctx.bufferData(this.#ctx.ARRAY_BUFFER, coords, this.#ctx.STATIC_DRAW);
        this.#ctx.vertexAttribPointer(positionAttr, coordBlockSize, this.#ctx.FLOAT, false, 0, 0);

        this.#ctx.bindBuffer(this.#ctx.ARRAY_BUFFER, this.#ctx.createBuffer());
        this.#ctx.bufferData(this.#ctx.ARRAY_BUFFER, colors, this.#ctx.STATIC_DRAW);
        this.#ctx.vertexAttribPointer(colorAttr, colorBlockSize, this.#ctx.FLOAT, false, 0, 0);

        this.#ctx.bindBuffer(this.#ctx.ELEMENT_ARRAY_BUFFER, this.#ctx.createBuffer());
        this.#ctx.bufferData(this.#ctx.ELEMENT_ARRAY_BUFFER, coordIndex, this.#ctx.STATIC_DRAW);

        this.#ctx.uniformMatrix4fv(transformUniform, false, transform.matrix);

        this.#ctx.drawElements(this.#ctx.TRIANGLES, coordIndex.length, this.#ctx.UNSIGNED_SHORT, 0);
    }

    #drawCube(positionAttr, colorAttr, transformUniform) {
        const coordBlockSize = 3;
        const coords = new Float32Array([
            // Front face
            -0.5, -0.5,  -0.5,
            0.5, -0.5,  -0.5,
            0.5,  0.5,  -0.5,
            -0.5,  0.5,  -0.5,
            // Back face
            0.5, -0.5, 0.5,
            -0.5, -0.5, 0.5,
            -0.5,  0.5, 0.5,
            0.5,  0.5, 0.5,
            // Top face
            -0.5, -0.5,  0.5,
            0.5, -0.5,  0.5,
            0.5, -0.5, -0.5,
            -0.5, -0.5, -0.5,
            // Bottom face
            -0.5,  0.5, -0.5,
            0.5,  0.5,  -0.5,
            0.5,  0.5,  0.5,
            -0.5,  0.5,  0.5,
            // Left face
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            0.5,  0.5,  0.5,
            0.5, 0.5, -0.5,
            // Right face
            -0.5, -0.5,  0.5,
            -0.5, -0.5, -0.5,
            -0.5,  0.5, -0.5,
            -0.5,  0.5,  0.5
        ]);
        const coordIndex = new Uint16Array([
            0, 1, 2,      0, 2, 3,    // Front face
            4, 5, 6,      4, 6, 7,    // Back face
            8, 9, 10,     8, 10, 11,  // Top face
            12, 13, 14,   12, 14, 15, // Bottom face
            16, 17, 18,   16, 18, 19, // Left face
            20, 21, 22,   20, 22, 23  // Right face
        ]);
        const colorBlockSize = 4;
        const colors = new Float32Array(
            []
                .concat(this.#repeatColor([0.23, 0.56, 0.78, 1], 4)) // Front face
                .concat(this.#repeatColor([0.12, 0.87, 0.45, 1], 4)) // Back face
                .concat(this.#repeatColor([0.85, 0.65, 0.12, 1], 4)) // Top face
                .concat(this.#repeatColor([0.27, 0.76, 0.62, 1], 4)) // Bottom face
                .concat(this.#repeatColor([0.91, 0.53, 0.14, 1], 4)) // Left face
                .concat(this.#repeatColor([0.32, 0.67, 0.86, 1], 4)) // Right face
        );
        const transform = Matrix4.identity()
            .scale(100, 100, 100)
            .rotateX(Date.now() / -1000)
            .rotateY(Date.now() / -1000)
            .rotateZ(Date.now() / -1000)
            .translate(90, 310, 0)
            .resolution(this.#width, this.#height, 200);

        this.#ctx.bindBuffer(this.#ctx.ARRAY_BUFFER, this.#ctx.createBuffer());
        this.#ctx.bufferData(this.#ctx.ARRAY_BUFFER, coords, this.#ctx.STATIC_DRAW);
        this.#ctx.vertexAttribPointer(positionAttr, coordBlockSize, this.#ctx.FLOAT, false, 0, 0);

        this.#ctx.bindBuffer(this.#ctx.ARRAY_BUFFER, this.#ctx.createBuffer());
        this.#ctx.bufferData(this.#ctx.ARRAY_BUFFER, colors, this.#ctx.STATIC_DRAW);
        this.#ctx.vertexAttribPointer(colorAttr, colorBlockSize, this.#ctx.FLOAT, false, 0, 0);

        this.#ctx.bindBuffer(this.#ctx.ELEMENT_ARRAY_BUFFER, this.#ctx.createBuffer());
        this.#ctx.bufferData(this.#ctx.ELEMENT_ARRAY_BUFFER, coordIndex, this.#ctx.STATIC_DRAW);

        this.#ctx.uniformMatrix4fv(transformUniform, false, transform.matrix);

        this.#ctx.drawElements(this.#ctx.TRIANGLES, coordIndex.length, this.#ctx.UNSIGNED_SHORT, 0);
    }

    #repeatColor(color, times) {
        return Array.from({length: times}).fill(color).flat();
    }
}