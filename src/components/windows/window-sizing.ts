/** window-sizing.ts resolves numeric app sizing policies against the desktop work area. */

export type AxisSizingPolicy = {
  defaultFraction: number;
  minFraction: number;
  maxFraction: number;
  contentFloor: number;
};

export type WindowSizingPolicy = {
  width: AxisSizingPolicy;
  height: AxisSizingPolicy;
};

const DEFAULT_POLICY: WindowSizingPolicy = {
  width: {
    defaultFraction: 0.5,
    minFraction: 0.25,
    maxFraction: 1,
    contentFloor: 400,
  },
  height: {
    defaultFraction: 0.73,
    minFraction: 0.35,
    maxFraction: 1,
    contentFloor: 300,
  },
};

/** Returns the supplied nonnegative finite value, or the fallback for invalid inputs. */
function validNumber(value: number, fallback: number): number {
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

/** Returns default, minimum and maximum pixels for an axis policy, fallback and available extent. */
function resolveAxis(
  policy: AxisSizingPolicy,
  fallback: AxisSizingPolicy,
  extent: number,
) {
  const available = validNumber(extent, 0);
  const minimum = Math.min(
    available,
    Math.max(
      validNumber(policy.contentFloor, fallback.contentFloor),
      validNumber(policy.minFraction, fallback.minFraction) * available,
    ),
  );
  const maximum = Math.max(
    minimum,
    Math.min(
      available,
      validNumber(policy.maxFraction, fallback.maxFraction) * available,
    ),
  );
  const preferred =
    validNumber(policy.defaultFraction, fallback.defaultFraction) * available;
  return {
    minimum,
    maximum,
    preferred: Math.min(maximum, Math.max(minimum, preferred)),
  };
}

/** Returns default size and effective limits for the optional policy and work-area dimensions. */
export function resolveWindowSizing(
  policy: WindowSizingPolicy | undefined,
  area: { width: number; height: number },
) {
  const width = resolveAxis(
    policy?.width ?? DEFAULT_POLICY.width,
    DEFAULT_POLICY.width,
    area.width,
  );
  const height = resolveAxis(
    policy?.height ?? DEFAULT_POLICY.height,
    DEFAULT_POLICY.height,
    area.height,
  );
  return {
    width: width.preferred,
    height: height.preferred,
    minWidth: width.minimum,
    minHeight: height.minimum,
    maxWidth: width.maximum,
    maxHeight: height.maximum,
  };
}
