import { LAKE_REST } from "./lake-config";

export type Rect = { left: number; top: number; right: number; bottom: number };

export type LakeRest = {
    values: Float32Array;
    setWindows: (rects: Rect[]) => void;
    setPointer: (x: number, y: number) => void;
    clearPointer: () => void;
};

type Box = { x0: number; x1: number; y0: number; y1: number };

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

export function createLakeRest(
    cols: number,
    rows: number,
    cellPx: number,
): LakeRest {
    const size = cols * rows;
    const values = new Float32Array(size);
    const windows = new Float32Array(size);
    const sigmas = new Float32Array(size);
    let pointer: { x: number; y: number } | null = null;
    let pointerBox: Box | null = null;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const variation =
                LAKE_REST.sigmaVariation *
                (2 * smoothNoise(x / 14, y / 14) - 1);
            sigmas[y * cols + x] =
                LAKE_REST.windowSigma * cellPx * (1 + variation);
        }
    }

    function restoreBox(box: Box) {
        for (let y = box.y0; y <= box.y1; y++) {
            for (let x = box.x0; x <= box.x1; x++) {
                values[y * cols + x] = windows[y * cols + x];
            }
        }
    }

    function applyPointer() {
        if (!pointer) return;
        const cx = pointer.x / cellPx - 0.5;
        const cy = pointer.y / cellPx - 0.5;
        const reach = Math.ceil(LAKE_REST.pointerReach * 3);
        const box: Box = {
            x0: Math.max(0, Math.round(cx) - reach),
            x1: Math.min(cols - 1, Math.round(cx) + reach),
            y0: Math.max(0, Math.round(cy) - reach),
            y1: Math.min(rows - 1, Math.round(cy) + reach),
        };
        const twoSigma2 = 2 * LAKE_REST.pointerReach ** 2;

        for (let y = box.y0; y <= box.y1; y++) {
            for (let x = box.x0; x <= box.x1; x++) {
                const i = y * cols + x;
                const bump =
                    LAKE_REST.pointerDepth *
                    Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / twoSigma2);
                values[i] = Math.max(values[i], bump);
            }
        }
        pointerBox = box;
    }

    function addWindow(rect: Rect) {
        const reachPx =
            LAKE_REST.windowSigma * cellPx * (1 + LAKE_REST.sigmaVariation) * 3;
        const x0 = Math.max(0, Math.floor((rect.left - reachPx) / cellPx));
        const x1 = Math.min(
            cols - 1,
            Math.ceil((rect.right + reachPx) / cellPx),
        );
        const y0 = Math.max(0, Math.floor((rect.top - reachPx) / cellPx));
        const y1 = Math.min(
            rows - 1,
            Math.ceil((rect.bottom + reachPx) / cellPx),
        );

        for (let y = y0; y <= y1; y++) {
            for (let x = x0; x <= x1; x++) {
                const px = (x + 0.5) * cellPx;
                const py = (y + 0.5) * cellPx;
                const dx = Math.max(rect.left - px, 0, px - rect.right);
                const dy = Math.max(rect.top - py, 0, py - rect.bottom);
                const i = y * cols + x;
                const falloff = Math.exp(
                    -(dx * dx + dy * dy) / (2 * sigmas[i] * sigmas[i]),
                );
                windows[i] = Math.max(windows[i], falloff);
            }
        }
    }

    function setWindows(rects: Rect[]) {
        windows.fill(0);
        rects.forEach(addWindow);
        values.set(windows);
        pointerBox = null;
        applyPointer();
    }

    function setPointer(x: number, y: number) {
        if (pointerBox) restoreBox(pointerBox);
        pointer = { x, y };
        applyPointer();
    }

    function clearPointer() {
        if (pointerBox) restoreBox(pointerBox);
        pointerBox = null;
        pointer = null;
    }

    return { values, setWindows, setPointer, clearPointer };
}
