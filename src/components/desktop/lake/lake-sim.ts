import {
    LAKE_ENCODE,
    LAKE_REST,
    LAKE_SHOCK,
    LAKE_SLEEP,
    LAKE_SPRING,
    LAKE_WAVE,
} from "./lake-config";
import { createLakeRest, type Rect } from "./lake-rest";

export type LakeSim = {
    cols: number;
    rows: number;
    field: Uint8Array;
    setWindows: (rects: Rect[]) => void;
    setPointer: (x: number, y: number) => void;
    clearPointer: () => void;
    shock: (x: number, y: number) => void;
    advance: (elapsedMs: number) => boolean;
    asleep: () => boolean;
};

const STEP_MS = LAKE_SPRING.stepSeconds * 1000;

function clamp(value: number, min: number, max: number) {
    return value < min ? min : value > max ? max : value;
}

export function createLakeSim(
    cols: number,
    rows: number,
    cellPx: number,
    physics: boolean,
): LakeSim {
    const size = cols * rows;
    const rest = createLakeRest(cols, rows, cellPx);
    const depth = new Float32Array(size);
    const velocity = new Float32Array(size);
    const level = new Float32Array(size);
    const waveDamping = new Float32Array(size);
    let wave = new Float32Array(size);
    let wavePrev = new Float32Array(size);
    const blurTemp = new Float32Array(size);
    const wide = new Float32Array(size);
    const field = new Uint8Array(size * 4);
    let lastPointer: { x: number; y: number } | null = null;
    let accumulator = 0;
    let quietSteps = 0;
    let sleeping = false;
    let pending = true;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const edge = Math.min(x, y, cols - 1 - x, rows - 1 - y);
            const ramp = Math.max(0, 1 - edge / LAKE_WAVE.edgeCells);
            waveDamping[y * cols + x] =
                LAKE_WAVE.damping * (1 - LAKE_WAVE.edgeLoss * ramp * ramp);
        }
    }

    function wake() {
        sleeping = false;
        quietSteps = 0;
    }

    function propagate() {
        let peak = 0;

        for (let y = 0; y < rows; y++) {
            const row = y * cols;
            const up = Math.max(y - 1, 0) * cols;
            const down = Math.min(y + 1, rows - 1) * cols;
            for (let x = 0; x < cols; x++) {
                const i = row + x;
                const lap =
                    wave[row + Math.max(x - 1, 0)] +
                    wave[row + Math.min(x + 1, cols - 1)] +
                    wave[up + x] +
                    wave[down + x] -
                    4 * wave[i];
                const next =
                    (2 * wave[i] - wavePrev[i] + LAKE_WAVE.speedSquared * lap) *
                    waveDamping[i];
                wavePrev[i] = clamp(next, -LAKE_WAVE.limit, LAKE_WAVE.limit);
                peak = Math.max(peak, Math.abs(next));
            }
        }

        [wave, wavePrev] = [wavePrev, wave];
        return peak;
    }

    function step() {
        const dt = LAKE_SPRING.stepSeconds;
        let peakVelocity = 0;
        let peakAcceleration = 0;

        for (let y = 0; y < rows; y++) {
            const row = y * cols;
            const up = Math.max(y - 1, 0) * cols;
            const down = Math.min(y + 1, rows - 1) * cols;
            for (let x = 0; x < cols; x++) {
                const i = row + x;
                const lap =
                    depth[row + Math.max(x - 1, 0)] +
                    depth[row + Math.min(x + 1, cols - 1)] +
                    depth[up + x] +
                    depth[down + x] -
                    4 * depth[i];
                const acceleration =
                    LAKE_SPRING.stiffness * (rest.values[i] - depth[i]) -
                    LAKE_SPRING.damping * velocity[i] +
                    LAKE_SPRING.coupling * lap;
                velocity[i] += dt * acceleration;
                peakVelocity = Math.max(peakVelocity, Math.abs(velocity[i]));
                peakAcceleration = Math.max(
                    peakAcceleration,
                    Math.abs(acceleration),
                );
            }
        }

        for (let i = 0; i < size; i++) {
            depth[i] += dt * velocity[i];
            wave[i] -= LAKE_WAVE.inject * dt * velocity[i];
        }

        const peakWave = propagate();

        const quiet =
            peakVelocity < LAKE_SLEEP.velocity &&
            peakAcceleration < LAKE_SLEEP.acceleration &&
            peakWave < LAKE_SLEEP.wave;
        quietSteps = quiet ? quietSteps + 1 : 0;
        if (quietSteps >= LAKE_SLEEP.quietSteps) {
            velocity.fill(0);
            wave.fill(0);
            wavePrev.fill(0);
            sleeping = true;
        }
    }

    function composeLevel() {
        for (let i = 0; i < size; i++) level[i] = depth[i] + wave[i];
    }

    function blurWide() {
        const radius = LAKE_ENCODE.wideBlurRadius;
        const norm = 1 / (2 * radius + 1);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let sum = 0;
                for (let k = -radius; k <= radius; k++) {
                    sum += Math.max(
                        level[y * cols + clamp(x + k, 0, cols - 1)],
                        0,
                    );
                }
                blurTemp[y * cols + x] = sum * norm;
            }
        }
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let sum = 0;
                for (let k = -radius; k <= radius; k++) {
                    sum += blurTemp[clamp(y + k, 0, rows - 1) * cols + x];
                }
                wide[y * cols + x] = sum * norm;
            }
        }
    }

    function encode() {
        composeLevel();
        blurWide();

        for (let y = 0; y < rows; y++) {
            const row = y * cols;
            const up = Math.max(y - 1, 0) * cols;
            const down = Math.min(y + 1, rows - 1) * cols;
            for (let x = 0; x < cols; x++) {
                const i = row + x;
                const o = i * 4;
                const gx =
                    (level[row + Math.min(x + 1, cols - 1)] -
                        level[row + Math.max(x - 1, 0)]) *
                    0.5;
                const gy = (level[down + x] - level[up + x]) * 0.5;
                field[o] =
                    128 + clamp(gx * LAKE_ENCODE.gradientGain, -1, 1) * 127;
                field[o + 1] =
                    128 + clamp(gy * LAKE_ENCODE.gradientGain, -1, 1) * 127;
                field[o + 2] =
                    clamp(
                        (level[i] - LAKE_ENCODE.depthMin) /
                            LAKE_ENCODE.depthSpan,
                        0,
                        1,
                    ) * 255;
                field[o + 3] = clamp(wide[i], 0, 1) * 255;
            }
        }
    }

    function setWindows(rects: Rect[]) {
        rest.setWindows(rects);
        if (!physics) depth.set(rest.values);
        pending = true;
        wake();
    }

    function disturbWave(x: number, y: number, amount: number) {
        const cx = x / cellPx - 0.5;
        const cy = y / cellPx - 0.5;
        const reach = LAKE_REST.pointerReach;
        const extent = Math.ceil(reach * 3);
        const twoSigma2 = 2 * reach ** 2;

        for (
            let j = Math.max(0, Math.round(cy) - extent);
            j <= Math.min(rows - 1, Math.round(cy) + extent);
            j++
        ) {
            for (
                let i = Math.max(0, Math.round(cx) - extent);
                i <= Math.min(cols - 1, Math.round(cx) + extent);
                i++
            ) {
                wave[j * cols + i] -=
                    amount *
                    Math.exp(-((i - cx) ** 2 + (j - cy) ** 2) / twoSigma2);
            }
        }
    }

    function leaveWake(x: number, y: number) {
        if (!lastPointer) return;
        const cells = Math.hypot(x - lastPointer.x, y - lastPointer.y) / cellPx;
        const steps = Math.min(Math.ceil(cells), LAKE_WAVE.pointerWakeMaxSteps);
        if (steps === 0) return;
        const amount =
            (LAKE_WAVE.pointerWake *
                Math.min(cells, LAKE_WAVE.pointerWakeMaxSteps)) /
            steps;

        for (let k = 1; k <= steps; k++) {
            const t = k / steps;
            disturbWave(
                lastPointer.x + (x - lastPointer.x) * t,
                lastPointer.y + (y - lastPointer.y) * t,
                amount,
            );
        }
    }

    function setPointer(x: number, y: number) {
        if (!physics) return;
        leaveWake(x, y);
        lastPointer = { x, y };
        rest.setPointer(x, y);
        wake();
    }

    function clearPointer() {
        if (!physics) return;
        lastPointer = null;
        rest.clearPointer();
        wake();
    }

    function shock(x: number, y: number) {
        if (!physics) return;
        const cx = x / cellPx - 0.5;
        const cy = y / cellPx - 0.5;
        const extent = Math.ceil(LAKE_SHOCK.reach * 3);
        const twoSigma2 = 2 * LAKE_SHOCK.reach ** 2;

        for (
            let j = Math.max(0, Math.round(cy) - extent);
            j <= Math.min(rows - 1, Math.round(cy) + extent);
            j++
        ) {
            for (
                let i = Math.max(0, Math.round(cx) - extent);
                i <= Math.min(cols - 1, Math.round(cx) + extent);
                i++
            ) {
                const falloff = Math.exp(
                    -((i - cx) ** 2 + (j - cy) ** 2) / twoSigma2,
                );
                velocity[j * cols + i] += LAKE_SHOCK.impulse * falloff;
                wave[j * cols + i] -= LAKE_WAVE.shockRing * falloff;
            }
        }
        wake();
    }

    function advance(elapsedMs: number) {
        if (!physics || sleeping) {
            accumulator = 0;
            if (!pending) return false;
            pending = false;
            encode();
            return true;
        }

        accumulator = Math.min(
            accumulator + elapsedMs,
            LAKE_SPRING.maxCatchupMs,
        );
        let steps = 0;
        while (
            accumulator >= STEP_MS &&
            steps < LAKE_SPRING.maxStepsPerAdvance
        ) {
            step();
            accumulator -= STEP_MS;
            steps++;
        }
        if (steps === 0) return false;

        pending = false;
        encode();
        return true;
    }

    function asleep() {
        return !physics || sleeping;
    }

    encode();

    return {
        cols,
        rows,
        field,
        setWindows,
        setPointer,
        clearPointer,
        shock,
        advance,
        asleep,
    };
}
