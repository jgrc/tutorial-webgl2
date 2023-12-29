'use strict'
class Webgl {
    static #createShader(ctx, type, source) {
        const shader = ctx.createShader(type);
        ctx.shaderSource(shader, source);
        ctx.compileShader(shader);
        if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
            console.error(ctx.getShaderInfoLog(shader));
            throw 'Error in your shader';
        }
        
        return shader;
    }

    static createProgram(ctx, vertexShaderSource, fragmentShaderSource) {
        const vertexShader = Webgl.#createShader(ctx, ctx.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = Webgl.#createShader(ctx, ctx.FRAGMENT_SHADER, fragmentShaderSource);
        const program = ctx.createProgram();
        ctx.attachShader(program, vertexShader);
        ctx.attachShader(program, fragmentShader);
        ctx.linkProgram(program);
        ctx.useProgram(program);
        return program;
    }
}