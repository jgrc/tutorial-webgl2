'use strict'
class Engine {
    #ctx;
    #image;
    #program;
    #width;
    #height;
    #keyBoard;
    #xCurrentRotation;
    #xRotationIncrement;
    #yCurrentRotation;
    #yRotationIncrement;
    
    constructor(canvas, image) {
        const vertexShaderSource = `#version 300 es
            precision highp float;
            in vec3 a_position;
            in vec2 a_texture_coords;
            uniform mat4 u_transform;
            out vec2 v_texture_coords;

            void main() {
                gl_Position = u_transform * vec4(a_position, 1);
                v_texture_coords = a_texture_coords;
            }
        `;
        const fragmentShaderSource = `#version 300 es
            precision highp float;
            in vec2 v_texture_coords;
            uniform sampler2D u_texture;
            out vec4 color;

            void main() {
                color = texture(u_texture, v_texture_coords);
            }
        `;
        this.#width = 600;
        this.#height = 600;
        canvas.width = this.#width;
        canvas.height = this.#height;
        this.#ctx = canvas.getContext('webgl2');
        if (!this.#ctx) {
            throw 'Your browser does not support webgl2';
        }
        this.#image = image;
        this.#program = Webgl.createProgram(this.#ctx, vertexShaderSource, fragmentShaderSource);
        this.#keyBoard = new Keyboard();
        this.#xCurrentRotation = 0;
        this.#xRotationIncrement = 0;
        this.#yCurrentRotation = 0;
        this.#yRotationIncrement = 0;
        this.#drawAll();
    }

    #drawAll() {
        this.#ctx.enable(this.#ctx.DEPTH_TEST);
        this.#ctx.viewport(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
        const positionAttr = this.#ctx.getAttribLocation(this.#program, 'a_position');
        const textureCoordsAttr = this.#ctx.getAttribLocation(this.#program, 'a_texture_coords');
        const transformUniform = this.#ctx.getUniformLocation(this.#program, 'u_transform');
        this.#ctx.enableVertexAttribArray(positionAttr);
        this.#ctx.enableVertexAttribArray(textureCoordsAttr);
        this.#loadTexture();
        this.#drawLoop(positionAttr, textureCoordsAttr, transformUniform);
    }

    #drawLoop(positionAttr, textureCoordsAttr, transformUniform) {
        this.#clear();
        this.#drawCube(positionAttr, textureCoordsAttr, transformUniform);
        this.#updateRotation();
        window.requestAnimationFrame(() => this.#drawLoop(positionAttr, textureCoordsAttr, transformUniform));
    }

    #clear() {
        this.#ctx.clearColor(0, 0, 0, 1);
        this.#ctx.clear(this.#ctx.COLOR_BUFFER_BIT | this.#ctx.DEPTH_BUFFER_BIT);
    }

    #drawCube(positionAttr, textureCoordsAttr, transformUniform) {
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
            // Right face
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            0.5,  0.5,  0.5,
            0.5, 0.5, -0.5,
            // Left face
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
            16, 17, 18,   16, 18, 19, // Right face
            20, 21, 22,   20, 22, 23  // Left face
        ]);
        const textureCoordsSize = 2;
        const textureCoords = new Float32Array([
            0.5, 1/3,    0.75, 1/3,   0.75, 2/3,   0.5, 2/3,   // Front face -> One
            0, 1/3,      0.25, 1/3,   0.25, 2/3,   0, 2/3,     // Back face -> Six
            0.25, 0,     0.5, 0,      0.5, 1/3,    0.25, 1/3,  // Top face -> Five
            0.25, 2/3,   0.5, 2/3,    0.5, 1,      0.25, 1,    // Bottom face -> Two
            0.25, 1/3,   0.5, 1/3,    0.5, 2/3,    0.25, 2/3,  // Left face -> Three
            0.75, 1/3,   1, 1/3,      1, 2/3,      0.75, 2/3   // Right face -> Four
        ]);
        const transform = Matrix4.identity()
            .scale(300, 300, 300)
            .rotateX(this.#xCurrentRotation)
            .rotateY(this.#yCurrentRotation)
            .translate(300, 300, 0)
            .resolution(this.#width, this.#height, 600);

        this.#ctx.bindBuffer(this.#ctx.ARRAY_BUFFER, this.#ctx.createBuffer());
        this.#ctx.bufferData(this.#ctx.ARRAY_BUFFER, coords, this.#ctx.STATIC_DRAW);
        this.#ctx.vertexAttribPointer(positionAttr, coordBlockSize, this.#ctx.FLOAT, false, 0, 0);

        this.#ctx.bindBuffer(this.#ctx.ARRAY_BUFFER, this.#ctx.createBuffer());
        this.#ctx.bufferData(this.#ctx.ARRAY_BUFFER, textureCoords, this.#ctx.STATIC_DRAW);
        this.#ctx.vertexAttribPointer(textureCoordsAttr, textureCoordsSize, this.#ctx.FLOAT, true, 0, 0);

        this.#ctx.bindBuffer(this.#ctx.ELEMENT_ARRAY_BUFFER, this.#ctx.createBuffer());
        this.#ctx.bufferData(this.#ctx.ELEMENT_ARRAY_BUFFER, coordIndex, this.#ctx.STATIC_DRAW);

        this.#ctx.uniformMatrix4fv(transformUniform, false, transform.matrix);

        this.#ctx.drawElements(this.#ctx.TRIANGLES, coordIndex.length, this.#ctx.UNSIGNED_SHORT, 0);
    }

    #loadTexture() {
        this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, this.#ctx.createTexture());
        this.#ctx.texImage2D(this.#ctx.TEXTURE_2D, 0, this.#ctx.RGBA, this.#ctx.RGBA, this.#ctx.UNSIGNED_BYTE, this.#image);
        this.#ctx.generateMipmap(this.#ctx.TEXTURE_2D);
    }

    #updateRotation() {
        const step = 0.0005;
        if (this.#keyBoard.is(Keyboard.Key.UP)) {
            this.#xRotationIncrement += step;
        }
        if (this.#keyBoard.is(Keyboard.Key.DOWN)) {
            this.#xRotationIncrement -= step;
        }
        if (this.#keyBoard.is(Keyboard.Key.RIGHT)) {
            this.#yRotationIncrement += step;
        }
        if (this.#keyBoard.is(Keyboard.Key.LEFT)) {
            this.#yRotationIncrement -= step;
        }
        if (this.#keyBoard.is(Keyboard.Key.SPACE)) {
            this.#xRotationIncrement = 0;
            this.#yRotationIncrement = 0;
        }
        this.#xCurrentRotation += this.#xRotationIncrement;
        this.#yCurrentRotation += this.#yRotationIncrement;
    }
}