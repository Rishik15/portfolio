import type { LakeSim } from "./lake-sim";

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT = `
precision highp float;
uniform sampler2D uField;
uniform vec2 uRes;
uniform vec2 uGrid;
uniform float uTile;
uniform float uDpr;
uniform float uDark;
uniform vec3 uPal[7];

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float tileSdf(vec2 p, float hw, float radius) {
    vec2 q = abs(p) - vec2(hw - radius);
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
}

float blob(vec2 p, vec2 at, vec2 stretch, float size) {
    vec2 d = (p - at) * stretch;
    return exp(-dot(d, d) / size);
}

vec3 gradient(vec2 s) {
    vec2 w = s + vec2(0.035 * sin(s.y * 3.4 + 0.6), 0.03 * sin(s.x * 2.6 + 1.7));
    float y = clamp(w.y, 0.0, 1.0);
    vec3 c = mix(uPal[0], uPal[1], smoothstep(0.0, 0.55, y));
    c = mix(c, uPal[2], smoothstep(0.45, 1.0, y));
    c = mix(c, uPal[6], 0.55 * blob(w, vec2(0.85, -0.05), vec2(1.0), 0.12));
    c = mix(c, uPal[4], 0.8 * blob(w, vec2(0.0, 0.92), vec2(1.0), 0.1));
    c = mix(c, uPal[5], 0.75 * blob(w, vec2(1.0, 0.85), vec2(1.0), 0.1));
    c = mix(c, uPal[3], 0.85 * blob(w, vec2(0.5, 1.02), vec2(1.0, 1.5), 0.16));
    return c;
}

void main() {
    vec2 fp = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
    vec2 q = fp / uTile;
    vec2 cell = floor(q);
    vec2 local = q - cell - 0.5;

    vec4 f = texture2D(uField, (cell + 0.5) / uGrid);
    vec4 fs = texture2D(uField, q / uGrid);
    vec2 gs = (fs.rg - 0.5) * 2.0;
    float soft = clamp((0.5 - fs.b) * 2.0, 0.0, 1.0) * mix(1.0, 0.5, uDark);
    float signedPress = (0.5 - f.b) * 2.0;
    float press = smoothstep(0.0, 0.75, clamp(signedPress, 0.0, 1.0)) * mix(1.0, 0.9, uDark);
    float lift = clamp(-signedPress, 0.0, 1.0);

    vec2 screen = (cell + 0.5) * uTile / uRes;
    vec3 tint = gradient(screen);
    tint += vec3(0.014, 0.0, -0.014) * (screen.x - 0.5) * (0.4 + screen.y);
    tint *= 1.0 + (hash(cell) - 0.5) * 0.014;

    float px = 1.0 / uTile;
    vec2 tilt = (f.rg - 0.5) * 2.0;
    float e = 1.0 - press;
    float hw = 0.43 - 0.06 * press + 0.01 * lift;
    vec2 lean = local - tilt * 0.07;
    float d = tileSdf(lean, hw, 0.0);
    float mask = 1.0 - smoothstep(-px, px, d);

    vec3 floorCol = mix(mix(tint, vec3(1.0), 0.85), tint * 0.45, uDark);
    float shadowSdf = tileSdf(lean - vec2(0.09, 0.12) * e, hw, 0.0);
    float shadow = (1.0 - smoothstep(-0.02, 0.13, shadowSdf)) * e * mix(0.1, 0.55, uDark);
    vec3 col = floorCol * (1.0 - shadow);

    vec2 light = normalize(vec2(-0.55, -0.8));
    vec2 n = abs(lean.x) > abs(lean.y) ? vec2(sign(lean.x), 0.0) : vec2(0.0, sign(lean.y));
    float side = dot(n, light);
    float rim = 1.0 - smoothstep(0.0, 0.16, -d);

    vec3 face = tint * (1.0 + 0.04 * e - lean.y * 0.06);
    face += rim * side * e * mix(0.07, 0.12, uDark);
    face *= 1.0 - 0.12 * press;
    face *= 1.0 - rim * max(side, 0.0) * press * 0.24;
    face += rim * max(-side, 0.0) * press * 0.08;
    face *= 1.0 + dot(tilt, light) * mix(0.2, 0.32, uDark) - dot(lean, tilt) * 0.22;
    face += dot(tilt, light) * 0.035 * uDark;
    face += lift * mix(0.04, 0.075, uDark);

    col = mix(col, face, mask);
    col *= 1.0 - 0.04 * soft;

    float grain = hash(floor(gl_FragCoord.xy / max(uDpr, 1.0)) + 17.0) - 0.5;
    col += grain * mix(0.028, 0.024, uDark);
    gl_FragColor = vec4(col, 1.0);
}
`;

const PALETTES = {
    light: [
        [0.957, 0.953, 0.941],
        [0.965, 0.902, 0.882],
        [0.918, 0.851, 0.918],
        [0.957, 0.718, 0.612],
        [0.784, 0.761, 0.918],
        [0.886, 0.753, 0.863],
        [0.969, 0.918, 0.847],
    ],
    dark: [
        [0.118, 0.114, 0.125],
        [0.169, 0.141, 0.153],
        [0.251, 0.169, 0.169],
        [0.706, 0.337, 0.227],
        [0.165, 0.192, 0.251],
        [0.290, 0.184, 0.200],
        [0.173, 0.165, 0.173],
    ],
};

export type LakeRenderer = {
    resize: (width: number, height: number, dpr: number, tilePx: number) => void;
    draw: (sim: LakeSim, dark: boolean) => void;
};

function compile(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(shader));
    return shader;
}

export function createLakeRenderer(canvas: HTMLCanvasElement): LakeRenderer | null {
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return null;

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const uniform = (name: string) => gl.getUniformLocation(program, name);

    function resize(width: number, height: number, dpr: number, tilePx: number) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        gl!.viewport(0, 0, canvas.width, canvas.height);
        gl!.uniform2f(uniform("uRes"), canvas.width, canvas.height);
        gl!.uniform1f(uniform("uDpr"), dpr);
        gl!.uniform1f(uniform("uTile"), tilePx * dpr);
    }

    function draw(sim: LakeSim, dark: boolean) {
        gl!.uniform1f(uniform("uDark"), dark ? 1 : 0);
        gl!.uniform3fv(uniform("uPal[0]"), (dark ? PALETTES.dark : PALETTES.light).flat());
        gl!.uniform2f(uniform("uGrid"), sim.cols, sim.rows);
        gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, sim.cols, sim.rows, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, sim.field);
        gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    return { resize, draw };
}
