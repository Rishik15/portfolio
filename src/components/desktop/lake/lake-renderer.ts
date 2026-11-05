import { LAKE_FRAGMENT, LAKE_PALETTES, LAKE_VERTEX } from "./lake-shader";

export type LakeRenderer = {
    software: boolean;
    resize: (
        width: number,
        height: number,
        dpr: number,
        tilePx: number,
    ) => void;
    setGrid: (cols: number, rows: number) => void;
    draw: (field: Uint8Array, dark: boolean) => void;
};

const SOFTWARE_PATTERN = /swiftshader|llvmpipe|softpipe|software/i;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function link(gl: WebGLRenderingContext) {
    const vertex = compile(gl, gl.VERTEX_SHADER, LAKE_VERTEX);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, LAKE_FRAGMENT);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return null;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

function detectSoftware(gl: WebGLRenderingContext) {
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    if (!info) return false;
    return SOFTWARE_PATTERN.test(
        String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)),
    );
}

function createFullscreenTriangle(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
) {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
}

function createFieldTexture(gl: WebGLRenderingContext) {
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
}

export function createLakeRenderer(
    canvas: HTMLCanvasElement,
): LakeRenderer | null {
    const gl = canvas.getContext("webgl", {
        antialias: false,
        alpha: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
    });
    if (!gl || gl.isContextLost()) return null;

    const program = link(gl);
    if (!program) return null;
    gl.useProgram(program);
    createFullscreenTriangle(gl, program);
    createFieldTexture(gl);

    const uniforms = {
        res: gl.getUniformLocation(program, "uRes"),
        grid: gl.getUniformLocation(program, "uGrid"),
        tile: gl.getUniformLocation(program, "uTile"),
        dpr: gl.getUniformLocation(program, "uDpr"),
        dark: gl.getUniformLocation(program, "uDark"),
        palette: gl.getUniformLocation(program, "uPal[0]"),
    };
    const palettes = {
        light: new Float32Array(LAKE_PALETTES.light.flat()),
        dark: new Float32Array(LAKE_PALETTES.dark.flat()),
    };
    let cols = 0;
    let rows = 0;

    function resize(
        width: number,
        height: number,
        dpr: number,
        tilePx: number,
    ) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        gl!.viewport(0, 0, canvas.width, canvas.height);
        gl!.uniform2f(uniforms.res, canvas.width, canvas.height);
        gl!.uniform1f(uniforms.dpr, dpr);
        gl!.uniform1f(uniforms.tile, tilePx * dpr);
    }

    function setGrid(nextCols: number, nextRows: number) {
        cols = nextCols;
        rows = nextRows;
        gl!.uniform2f(uniforms.grid, cols, rows);
        gl!.texImage2D(
            gl!.TEXTURE_2D,
            0,
            gl!.RGBA,
            cols,
            rows,
            0,
            gl!.RGBA,
            gl!.UNSIGNED_BYTE,
            null,
        );
    }

    function draw(field: Uint8Array, dark: boolean) {
        gl!.uniform1f(uniforms.dark, dark ? 1 : 0);
        gl!.uniform3fv(uniforms.palette, dark ? palettes.dark : palettes.light);
        gl!.texSubImage2D(
            gl!.TEXTURE_2D,
            0,
            0,
            0,
            cols,
            rows,
            gl!.RGBA,
            gl!.UNSIGNED_BYTE,
            field,
        );
        gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    return { software: detectSoftware(gl), resize, setGrid, draw };
}
