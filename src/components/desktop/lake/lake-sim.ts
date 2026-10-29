export type Rect = { left: number; top: number; right: number; bottom: number };

const WINDOW_SIGMA = 2.6;
const SIGMA_VARIATION = 0.14;
const POINTER_REACH = 1.8;
const POINTER_DEPTH = 0.6;
const PRESS_RATE = 0.42;
const RELEASE_RATE = 0.16;
const GRADIENT_GAIN = 3;
const REST = 0.002;
const WAVE_SPEED = 0.12;
const WAVE_DAMPING = 0.95;
const WAVE_INJECT = 0.2;
const WAVE_LIMIT = 0.22;

export type LakeSim = {
    cols: number;
    rows: number;
    field: Uint8Array;
    setWindows: (rects: Rect[]) => void;
    setPointer: (x: number, y: number) => void;
    clearPointer: () => void;
    step: () => boolean;
};

function lattice(x: number, y: number) {
    const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return h - Math.floor(h);
}

function smoothNoise(x: number, y: number) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const u = fx * fx * (3 - 2 * fx);
    const v = fy * fy * (3 - 2 * fy);
    const top = lattice(ix, iy) * (1 - u) + lattice(ix + 1, iy) * u;
    const bottom = lattice(ix, iy + 1) * (1 - u) + lattice(ix + 1, iy + 1) * u;
    return top * (1 - v) + bottom * v;
}

export function createLakeSim(cols: number, rows: number, cellPx: number): LakeSim {
    const size = cols * rows;
    const depth = new Float32Array(size);
    const windowDepth = new Float32Array(size);
    const target = new Float32Array(size);
    const field = new Uint8Array(size * 4);
    const terrain = new Float32Array(size);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            terrain[y * cols + x] = smoothNoise(x / 14, y / 14);
        }
    }
    let wave = new Float32Array(size);
    let wavePrev = new Float32Array(size);
    let pointer: { x: number; y: number } | null = null;
    field.fill(128);

    function setWindows(rects: Rect[]) {
        windowDepth.fill(0);
        const reachPx = WINDOW_SIGMA * cellPx * (1 + SIGMA_VARIATION) * 3;

        for (const rect of rects) {
            const x0 = Math.max(0, Math.floor((rect.left - reachPx) / cellPx));
            const x1 = Math.min(cols - 1, Math.ceil((rect.right + reachPx) / cellPx));
            const y0 = Math.max(0, Math.floor((rect.top - reachPx) / cellPx));
            const y1 = Math.min(rows - 1, Math.ceil((rect.bottom + reachPx) / cellPx));

            for (let y = y0; y <= y1; y++) {
                for (let x = x0; x <= x1; x++) {
                    const px = (x + 0.5) * cellPx;
                    const py = (y + 0.5) * cellPx;
                    const dx = Math.max(rect.left - px, 0, px - rect.right);
                    const dy = Math.max(rect.top - py, 0, py - rect.bottom);
                    const i = y * cols + x;
                    const sigma = WINDOW_SIGMA * cellPx * (1 + SIGMA_VARIATION * (2 * terrain[i] - 1));
                    const distance = Math.hypot(dx, dy);
                    windowDepth[i] = Math.max(windowDepth[i], Math.exp(-(distance * distance) / (2 * sigma * sigma)));
                }
            }
        }
    }

    function setPointer(x: number, y: number) {
        pointer = { x, y };
    }

    function clearPointer() {
        pointer = null;
    }

    function buildTarget() {
        target.set(windowDepth);
        if (!pointer) return;

        const cx = pointer.x / cellPx - 0.5;
        const cy = pointer.y / cellPx - 0.5;
        const reach = Math.ceil(POINTER_REACH * 3);
        for (let y = Math.max(0, Math.round(cy) - reach); y <= Math.min(rows - 1, Math.round(cy) + reach); y++) {
            for (let x = Math.max(0, Math.round(cx) - reach); x <= Math.min(cols - 1, Math.round(cx) + reach); x++) {
                const d2 = (x - cx) ** 2 + (y - cy) ** 2;
                const i = y * cols + x;
                target[i] = Math.max(target[i], POINTER_DEPTH * Math.exp(-d2 / (2 * POINTER_REACH ** 2)));
            }
        }
    }

    function ease() {
        let active = false;

        for (let i = 0; i < size; i++) {
            const diff = target[i] - depth[i];
            if (Math.abs(diff) < REST) {
                depth[i] = target[i];
                continue;
            }
            const move = diff * (diff > 0 ? PRESS_RATE : RELEASE_RATE);
            depth[i] += move;
            wave[i] -= move * WAVE_INJECT;
            active = true;
        }

        return active;
    }

    function propagate() {
        let energy = 0;

        for (let y = 0; y < rows; y++) {
            const up = Math.max(y - 1, 0) * cols;
            const down = Math.min(y + 1, rows - 1) * cols;
            for (let x = 0; x < cols; x++) {
                const i = y * cols + x;
                const lap =
                    wave[Math.max(x - 1, 0) + y * cols] +
                    wave[Math.min(x + 1, cols - 1) + y * cols] +
                    wave[x + up] +
                    wave[x + down] -
                    4 * wave[i];
                const next = (2 * wave[i] - wavePrev[i] + WAVE_SPEED * lap) * WAVE_DAMPING;
                wavePrev[i] = Math.max(-WAVE_LIMIT, Math.min(WAVE_LIMIT, next));
                energy = Math.max(energy, Math.abs(next));
            }
        }

        [wave, wavePrev] = [wavePrev, wave];

        if (energy < REST) {
            wave.fill(0);
            wavePrev.fill(0);
            return false;
        }
        return true;
    }

    function step() {
        buildTarget();
        const easing = ease();
        const rippling = propagate();
        encode();
        return easing || rippling;
    }

    function level(x: number, y: number) {
        const i = Math.min(Math.max(y, 0), rows - 1) * cols + Math.min(Math.max(x, 0), cols - 1);
        return depth[i] + wave[i];
    }

    function encode() {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const o = (y * cols + x) * 4;
                const gx = (level(x + 1, y) - level(x - 1, y)) * GRADIENT_GAIN;
                const gy = (level(x, y + 1) - level(x, y - 1)) * GRADIENT_GAIN;
                field[o] = 128 + Math.max(-1, Math.min(1, gx)) * 127;
                field[o + 1] = 128 + Math.max(-1, Math.min(1, gy)) * 127;
                field[o + 2] = 128 - Math.max(-1, Math.min(1, level(x, y))) * 127;
                field[o + 3] = 255;
            }
        }
    }

    return { cols, rows, field, setWindows, setPointer, clearPointer, step };
}
