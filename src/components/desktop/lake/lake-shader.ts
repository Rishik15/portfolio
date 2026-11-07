export const LAKE_VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const LAKE_FRAGMENT = `
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
    vec3 c = mix(uPal[0], uPal[1], smoothstep(0.0, mix(0.55, 0.9, uDark), y));
    c = mix(c, uPal[2], smoothstep(0.45, 1.0, y));
    c = mix(c, uPal[6], 0.55 * blob(w, vec2(0.85, -0.05), vec2(1.0), 0.12));
    c = mix(c, uPal[4], 0.8 * blob(w, vec2(0.0, 0.92), vec2(1.0), 0.1));
    c = mix(c, uPal[5], 0.75 * blob(w, vec2(1.0, 0.85), vec2(1.0), 0.1));
    c = mix(c, uPal[3], 0.85 * blob(w, vec2(0.5, 1.02), vec2(1.0, 1.5), mix(0.16, 0.09, uDark)));
    return c;
}

void main() {
    vec2 fp = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
    vec2 q = fp / uTile;
    vec2 cell = floor(q);
    vec2 local = q - cell - 0.5;

    vec4 f = texture2D(uField, (cell + 0.5) / uGrid);
    vec4 fs = texture2D(uField, q / uGrid);

    float dc = f.b * 1.5 - 0.5;
    float ds = fs.b * 1.5 - 0.5;
    float press = smoothstep(0.0, 1.0, clamp(dc, 0.0, 1.0));
    float well = smoothstep(0.0, 1.0, clamp(ds, 0.0, 1.0));
    float lift = clamp(-dc * 6.0, 0.0, 1.0);
    vec2 grad = (fs.rg - 0.5) * 2.0 / 5.0;
    float slope = length(grad);
    vec3 N = normalize(vec3(-grad * 3.2, 1.0));

    vec2 screen = (cell + 0.5) * uTile / uRes;
    vec3 tint = gradient(screen);
    tint += vec3(0.014, 0.0, -0.014) * (screen.x - 0.5) * (0.4 + screen.y);
    tint *= 1.0 + (hash(cell) - 0.5) * 0.014;

    float px = 1.0 / uTile;
    float hw = 0.44 - 0.03 * press + 0.015 * lift;
    vec2 lean = local - grad * 0.25;
    float d = tileSdf(lean, hw, 0.06);
    float mask = 1.0 - smoothstep(-px, px, d);

    vec3 floorBase = mix(mix(tint, vec3(1.0), 0.85), tint * 0.45, uDark);
    vec3 floorCol = floorBase * (1.0 - well * mix(0.34, 0.55, uDark));

    float e = 1.0 - press;
    float shadowSdf = tileSdf(lean - vec2(0.09, 0.12) * e * (1.0 + 0.3 * lift), hw, 0.06);
    float shadow = (1.0 - smoothstep(-0.02, 0.13, shadowSdf)) * e * mix(0.1, 0.55, uDark) * (1.0 - 0.4 * lift);
    vec3 shadowDye = mix(vec3(1.0, 1.08, 0.72), vec3(1.0), uDark);
    vec3 col = floorCol * (1.0 - shadow * shadowDye);

    vec3 L = normalize(vec3(-0.45, -0.62, 0.64));
    vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
    float dif = clamp((dot(N, L) - L.z) * mix(0.9, 1.2, uDark), -0.32, 0.24);

    vec3 face = tint * (1.0 + dif);
    face *= 1.0 - pow(press, 1.3) * mix(0.24, 0.36, uDark);
    face *= 1.0 - fs.a * mix(0.12, 0.18, uDark);
    face = mix(face, face * mix(vec3(1.04, 1.0, 0.97), vec3(0.96, 0.98, 1.04), uDark), press * 0.6);

    vec2 n = abs(lean.x) > abs(lean.y) ? vec2(sign(lean.x), 0.0) : vec2(0.0, sign(lean.y));
    float side = dot(n, normalize(vec2(-0.45, -0.62)));
    float rim = 1.0 - smoothstep(0.0, 0.1, -d);
    float rimLit = mix(mix(0.05, 0.08, uDark), -mix(0.1, 0.18, uDark), press);
    face += rim * (max(side, 0.0) * rimLit + max(-side, 0.0) * 0.04 * press) * (1.0 - well * 0.5);
    face += lift * mix(0.03, 0.05, uDark);

    float facing = max(dot(N, H), 0.0);
    vec3 sheenCol = mix(vec3(1.0, 0.97, 0.94), vec3(0.85, 0.9, 1.0), uDark);
    float sheen = pow(facing, 36.0) * mix(0.1, 0.16, uDark) + pow(facing, 8.0) * 0.03;
    face += sheenCol * sheen * smoothstep(0.02, 0.2, slope) * (1.0 + 0.3 * lift);

    col = mix(col, face, mask);

    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    float grain = hash(floor(gl_FragCoord.xy / max(uDpr, 1.0)) + 17.0) - 0.5;
    col += grain * mix(0.016, 0.014, uDark) * (0.6 + 0.4 * luma) * (1.0 - 0.3 * well);
    col += (hash(gl_FragCoord.xy + 3.1) - 0.5) / 255.0;
    gl_FragColor = vec4(col, 1.0);
}
`;

export const LAKE_PALETTES = {
    light: [
        [0.957, 0.953, 0.941],
        [0.965, 0.902, 0.882],
        [0.918, 0.851, 0.918],
        [0.976, 0.64, 0.5],
        [0.784, 0.761, 0.918],
        [0.886, 0.753, 0.863],
        [0.969, 0.918, 0.847],
    ],
    dark: [
        [0.02, 0.018, 0.02],
        [0.18, 0.09, 0.13],
        [0.3, 0.14, 0.19],
        [0.72, 0.36, 0.21],
        [0.24, 0.11, 0.18],
        [0.34, 0.15, 0.19],
        [0.08, 0.06, 0.08],
    ],
} as const;
