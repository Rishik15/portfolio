/** use-window-frame.ts manages window geometry, gestures and frame transitions. */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

import {
  isWindowMinimized,
  isWindowOpen,
  type AppWindowConfig,
  type WindowActions,
  type WindowPosition,
  type WindowState,
} from "@/components/windows/window-manager";
import { resolveWindowSizing } from "@/components/windows/window-sizing";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type WorkArea = WindowBounds & WindowPosition;

type WindowSize = {
  width: number;
  height: number;
};

type WindowBounds = {
  width: number;
  height: number;
};

type WindowFrame = {
  position: WindowPosition;
  size: WindowSize;
};

export type ResizeDirection =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top"
  | "right"
  | "bottom"
  | "left"
  | null;

type SnapZone = "top" | null;

type UseWindowFrameOptions = {
  config: AppWindowConfig;
  state: WindowState;
  actions: WindowActions;
  cascadeIndex: number;
  iconPosition?: WindowPosition;
  getIconPosition?: () => WindowPosition | undefined;
};

const CASCADE_OFFSET = 30;
const SNAP_THRESHOLD = 10;
const DRAG_THRESHOLD = 1;

const FALLBACK_OPEN_OFFSET_Y = 6;
const FALLBACK_OPEN_SCALE = 0.985;

const MINIMIZE_ANIMATION_MS = 450;

const WORK_AREA_INSET_TOP = 80;
const WORK_AREA_INSET_BOTTOM = 128;

const DEFAULT_VIEWPORT_WIDTH = 1440;
const DEFAULT_VIEWPORT_HEIGHT = 900;

/** Returns the input value constrained to the supplied minimum and maximum. */
function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

/** Returns browser viewport dimensions, or fallback dimensions during server rendering. */
function getViewportBounds(): WindowBounds {
  if (typeof window === "undefined") {
    return {
      width: DEFAULT_VIEWPORT_WIDTH,
      height: DEFAULT_VIEWPORT_HEIGHT,
    };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * Returns the desktop area between the top bar and the dock, used to size
 * and place windows, for supplied viewport dimensions or the current browser.
 */
function getWorkArea(viewport = getViewportBounds()): WorkArea {
  const steps = viewport.width >= 2400 ? 2 : viewport.width >= 1800 ? 1 : 0;
  const top = WORK_AREA_INSET_TOP + steps * 8;
  const bottom = WORK_AREA_INSET_BOTTOM + steps * 8;

  return {
    x: 0,
    y: top,
    width: viewport.width,
    height: Math.max(0, viewport.height - top - bottom),
  };
}

/**
 * Returns the full viewport frame for maximize, with no inputs.
 */
function getFullFrame(): WindowFrame {
  return {
    position: { x: 0, y: 0 },
    size: getViewportBounds(),
  };
}

/** Returns the input frame fitted to the supplied viewport and app size limits. */
function clampWindowFrame(
  config: AppWindowConfig,
  frame: WindowFrame,
  bounds: WindowBounds,
): WindowFrame {
  const limits = resolveWindowSizing(config.sizing, getWorkArea(bounds));

  const width = clamp(frame.size.width, limits.minWidth, limits.maxWidth);
  const height = clamp(frame.size.height, limits.minHeight, limits.maxHeight);

  const maxX = Math.max(0, bounds.width - width);
  const maxY = Math.max(0, bounds.height - height);

  return {
    position: {
      x: clamp(frame.position.x, 0, maxX),
      y: clamp(frame.position.y, 0, maxY),
    },
    size: {
      width,
      height,
    },
  };
}

/** Returns a viewport-contained position for the candidate position and frame size. */
function clampWindowPosition(
  position: WindowPosition,
  size: WindowSize,
  bounds: WindowBounds,
): WindowPosition {
  return {
    x: clamp(position.x, 0, Math.max(0, bounds.width - size.width)),
    y: clamp(position.y, 0, Math.max(0, bounds.height - size.height)),
  };
}

/** Returns a resized frame from a fitted start frame, direction, delta, config and viewport. */
function resizeWindowFrame(
  frame: WindowFrame,
  direction: Exclude<ResizeDirection, null>,
  delta: WindowPosition,
  config: AppWindowConfig,
  bounds: WindowBounds,
): WindowFrame {
  const limits = resolveWindowSizing(config.sizing, getWorkArea(bounds));
  const { x, y } = frame.position;
  const right = x + frame.size.width;
  const bottom = y + frame.size.height;
  const position = { ...frame.position };
  const size = { ...frame.size };

  if (direction.includes("right")) {
    size.width = clamp(
      frame.size.width + delta.x,
      limits.minWidth,
      Math.min(limits.maxWidth, bounds.width - x),
    );
  }
  if (direction.includes("left")) {
    size.width = clamp(
      frame.size.width - delta.x,
      limits.minWidth,
      Math.min(limits.maxWidth, right),
    );
    position.x = right - size.width;
  }
  if (direction.includes("bottom")) {
    size.height = clamp(
      frame.size.height + delta.y,
      limits.minHeight,
      Math.min(limits.maxHeight, bounds.height - y),
    );
  }
  if (direction.includes("top")) {
    size.height = clamp(
      frame.size.height - delta.y,
      limits.minHeight,
      Math.min(limits.maxHeight, bottom),
    );
    position.y = bottom - size.height;
  }

  return { position, size };
}

/** Returns the initial app frame for the supplied config and cascade index. */
function getDefaultWindowFrame(
  config: AppWindowConfig,
  cascadeIndex: number,
): WindowFrame {
  const bounds = getViewportBounds();
  const area = getWorkArea();
  const { width, height } = resolveWindowSizing(config.sizing, area);
  const size = { width, height };

  const freeX = Math.max(0, area.width - size.width);
  const freeY = Math.max(0, area.height - size.height);

  const placementX = clamp(config.initialPlacement?.x ?? 0.5, 0, 1);
  const placementY = clamp(config.initialPlacement?.y ?? 0.5, 0, 1);

  const cascadeOffset =
    config.initialPlacement === undefined ? cascadeIndex * CASCADE_OFFSET : 0;

  return clampWindowFrame(
    config,
    {
      position: {
        x: area.x + freeX * placementX + cascadeOffset,
        y: area.y + freeY * placementY + cascadeOffset,
      },
      size,
    },
    bounds,
  );
}

/** Returns a fitted frame scaled between supplied work areas using app limits and relative placement. */
function scaleFrameBetweenWorkAreas(
  config: AppWindowConfig,
  frame: WindowFrame,
  previousBounds: WorkArea,
  nextBounds: WorkArea,
): WindowFrame {
  const widthScale =
    previousBounds.width > 0 ? nextBounds.width / previousBounds.width : 1;

  const heightScale =
    previousBounds.height > 0 ? nextBounds.height / previousBounds.height : 1;

  const previousFreeX = Math.max(0, previousBounds.width - frame.size.width);

  const previousFreeY = Math.max(0, previousBounds.height - frame.size.height);

  const horizontalProgress =
    previousFreeX > 0
      ? clamp((frame.position.x - previousBounds.x) / previousFreeX, 0, 1)
      : 0.5;

  const verticalProgress =
    previousFreeY > 0
      ? clamp((frame.position.y - previousBounds.y) / previousFreeY, 0, 1)
      : 0.5;

  const limits = resolveWindowSizing(config.sizing, nextBounds);

  const nextWidth = clamp(
    frame.size.width * widthScale,
    limits.minWidth,
    limits.maxWidth,
  );

  const nextHeight = clamp(
    frame.size.height * heightScale,
    limits.minHeight,
    limits.maxHeight,
  );

  const nextFreeX = Math.max(0, nextBounds.width - nextWidth);
  const nextFreeY = Math.max(0, nextBounds.height - nextHeight);

  return {
    position: {
      x: nextBounds.x + nextFreeX * horizontalProgress,
      y: nextBounds.y + nextFreeY * verticalProgress,
    },
    size: { width: nextWidth, height: nextHeight },
  };
}

/** Returns window frame state and interaction handlers for the supplied app, actions and placement options. */
export function useWindowFrame({
  config,
  state,
  actions,
  cascadeIndex,
  iconPosition,
  getIconPosition,
}: UseWindowFrameOptions) {
  const reducedMotion = useReducedMotion();
  const defaultFrame = useMemo(
    () => getDefaultWindowFrame(config, cascadeIndex),
    [cascadeIndex, config],
  );

  const canMinimize = config.canMinimize !== false;
  const canMaximize = config.canMaximize !== false;
  const canResize = config.canResize !== false;
  const hideTitleBar = config.hideTitleBar === true;
  const shouldOpenMaximized = config.openMaximized === true;

  const getDefaultFrame = useCallback(
    () => getDefaultWindowFrame(config, cascadeIndex),
    [cascadeIndex, config],
  );

  const hasIconAnimation = !reducedMotion && iconPosition !== undefined;
  const hasFallbackOpenAnimation =
    !reducedMotion && !hasIconAnimation && !shouldOpenMaximized;
  const shouldAnimateOpen = hasIconAnimation || hasFallbackOpenAnimation;

  const [position, setPosition] = useState<WindowPosition>(() => {
    if (hasIconAnimation) {
      return iconPosition;
    }

    if (shouldOpenMaximized) {
      return getFullFrame().position;
    }

    return {
      x: defaultFrame.position.x,
      y: defaultFrame.position.y + (reducedMotion ? 0 : FALLBACK_OPEN_OFFSET_Y),
    };
  });

  const [size, setSize] = useState<WindowSize>(() => {
    if (hasIconAnimation) {
      return {
        width: 60,
        height: 60,
      };
    }

    if (shouldOpenMaximized && typeof window !== "undefined") {
      return getFullFrame().size;
    }

    return defaultFrame.size;
  });

  const [scale, setScale] = useState(
    hasFallbackOpenAnimation ? FALLBACK_OPEN_SCALE : 1,
  );

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<ResizeDirection>(null);
  const [isMaximized, setIsMaximized] = useState(shouldOpenMaximized);
  const [snapZone, setSnapZone] = useState<SnapZone>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isOpening, setIsOpening] = useState(shouldAnimateOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [opacity, setOpacity] = useState(shouldAnimateOpen ? 0 : 1);

  const positionRef = useRef(position);
  const sizeRef = useRef(size);

  const isMaximizedRef = useRef(isMaximized);
  const snapZoneRef = useRef<SnapZone>(snapZone);

  const isAnimating = useRef(false);
  const animationTimers = useRef(new Set<number>());
  const pendingMinimize = useRef(false);

  /** Cancels tracked transition timers, with no inputs or return value. */
  const clearAnimationTimers = useCallback(() => {
    animationTimers.current.forEach((timer) => window.clearTimeout(timer));
    animationTimers.current.clear();
  }, []);

  /** Schedules the supplied completion after a motion delay; returns nothing. */
  const finishTransition = useCallback(
    (complete: () => void, delay: number) => {
      if (reducedMotion) {
        complete();
        return;
      }
      const timer = window.setTimeout(() => {
        animationTimers.current.delete(timer);
        complete();
      }, delay);
      animationTimers.current.add(timer);
    },
    [reducedMotion],
  );

  useEffect(() => clearAnimationTimers, [clearAnimationTimers]);
  const hasUserAdjustedFrame = useRef(false);
  const workAreaRef = useRef(getWorkArea());
  const gestureVersion = useRef(0);
  const hasActiveGesture = useRef(false);

  const savedPosition = useRef<WindowPosition>({
    ...defaultFrame.position,
  });

  const savedSize = useRef<WindowSize>({
    ...defaultFrame.size,
  });

  const previousState = useRef({
    x: defaultFrame.position.x,
    y: defaultFrame.position.y,
    width: defaultFrame.size.width,
    height: defaultFrame.size.height,
  });

  const dragRef = useRef({
    startX: 0,
    startY: 0,
    needsRestore: false,
    initialClientX: 0,
    initialClientY: 0,
  });

  const resizeRef = useRef({
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startPosX: 0,
    startPosY: 0,
  });

  /** Stores the supplied position in state and its synchronous ref; returns nothing. */
  const setFramePosition = useCallback((nextPosition: WindowPosition) => {
    positionRef.current = nextPosition;
    setPosition(nextPosition);
  }, []);

  /** Stores the supplied size in state and its synchronous ref; returns nothing. */
  const setFrameSize = useCallback((nextSize: WindowSize) => {
    sizeRef.current = nextSize;
    setSize(nextSize);
  }, []);

  /** Stores the supplied maximize flag in state and its ref; returns nothing. */
  const setFrameMaximized = useCallback((nextValue: boolean) => {
    isMaximizedRef.current = nextValue;
    setIsMaximized(nextValue);
  }, []);

  /** Stores the supplied preview zone when changed; returns nothing. */
  const setFrameSnapZone = useCallback((nextValue: SnapZone) => {
    if (snapZoneRef.current === nextValue) {
      return;
    }

    snapZoneRef.current = nextValue;
    setSnapZone(nextValue);
  }, []);

  const isOpen = isWindowOpen(state);
  const isMinimized = isWindowMinimized(state);
  const isActive = isOpen && state.isActive;

  const zIndex = isOpen ? state.zIndex : isMinimized ? state.zIndex : 0;

  /** Closes the current app with no inputs or return value. */
  const handleClose = useCallback(() => {
    actions.close();
  }, [actions]);

  /** Minimizes the current app toward its icon with no inputs or return value. */
  const handleMinimize = useCallback(() => {
    if (isAnimating.current || !canMinimize) {
      return;
    }

    if (reducedMotion) {
      actions.minimize();
      return;
    }

    const currentIconPosition = getIconPosition?.() ?? iconPosition;

    if (!currentIconPosition) {
      actions.minimize();
      return;
    }

    isAnimating.current = true;
    pendingMinimize.current = true;

    if (!isMaximizedRef.current) {
      savedPosition.current = {
        x: positionRef.current.x,
        y: positionRef.current.y,
      };

      savedSize.current = {
        width: sizeRef.current.width,
        height: sizeRef.current.height,
      };
    }

    setIsClosing(true);
    setIsTransitioning(!reducedMotion);

    setFramePosition(currentIconPosition);

    setFrameSize({
      width: 60,
      height: 60,
    });

    setOpacity(0);

    finishTransition(() => {
      pendingMinimize.current = false;
      isAnimating.current = false;
      actions.minimize();
    }, MINIMIZE_ANIMATION_MS);
  }, [
    actions,
    canMinimize,
    reducedMotion,
    finishTransition,
    getIconPosition,
    iconPosition,
    setFramePosition,
    setFrameSize,
  ]);

  /** Toggles the current app between restored and full viewport frames; returns nothing. */
  const handleMaximize = useCallback(() => {
    if (!canMaximize || typeof window === "undefined") {
      return;
    }

    setIsTransitioning(!reducedMotion);

    if (isMaximizedRef.current) {
      const restoredFrame = clampWindowFrame(
        config,
        {
          position: {
            x: previousState.current.x,
            y: previousState.current.y,
          },
          size: {
            width: previousState.current.width,
            height: previousState.current.height,
          },
        },
        getViewportBounds(),
      );

      setFramePosition(restoredFrame.position);
      setFrameSize(restoredFrame.size);

      savedPosition.current = restoredFrame.position;
      savedSize.current = restoredFrame.size;

      setFrameMaximized(false);
    } else {
      previousState.current = {
        x: positionRef.current.x,
        y: positionRef.current.y,
        width: sizeRef.current.width,
        height: sizeRef.current.height,
      };

      setFramePosition(getFullFrame().position);

      setFrameSize(getFullFrame().size);

      setFrameMaximized(true);
    }

    finishTransition(() => {
      setIsTransitioning(false);
    }, 200);

    actions.toggleMaximize();
  }, [
    actions,
    canMaximize,
    reducedMotion,
    finishTransition,
    config,
    setFrameMaximized,
    setFramePosition,
    setFrameSize,
  ]);

  useEffect(() => {
    if (!isOpening || reducedMotion) {
      return;
    }

    let secondFrame = 0;
    let transitionTimeout = 0;

    const firstFrame = requestAnimationFrame(() => {
      setIsTransitioning(!reducedMotion);

      secondFrame = requestAnimationFrame(() => {
        const nextFrame = getDefaultFrame();

        setFramePosition(nextFrame.position);

        setFrameSize(nextFrame.size);

        setScale(1);
        setOpacity(1);

        transitionTimeout = window.setTimeout(() => {
          setIsTransitioning(false);
          setIsOpening(false);

          savedPosition.current = nextFrame.position;
          savedSize.current = nextFrame.size;

          previousState.current = {
            x: nextFrame.position.x,
            y: nextFrame.position.y,
            width: nextFrame.size.width,
            height: nextFrame.size.height,
          };
        }, 300);
      });
    });

    return () => {
      cancelAnimationFrame(firstFrame);

      if (secondFrame) {
        cancelAnimationFrame(secondFrame);
      }

      if (transitionTimeout) {
        window.clearTimeout(transitionTimeout);
      }
    };
  }, [
    getDefaultFrame,
    hasIconAnimation,
    reducedMotion,
    isOpening,
    setFramePosition,
    setFrameSize,
  ]);

  useEffect(() => {
    if (reducedMotion || isMinimized || !isClosing || isAnimating.current) {
      return;
    }

    isAnimating.current = true;

    let secondFrame = 0;
    let transitionTimeout = 0;

    const firstFrame = requestAnimationFrame(() => {
      setIsTransitioning(!reducedMotion);

      secondFrame = requestAnimationFrame(() => {
        const bounds = getViewportBounds();

        let restoredFrame: WindowFrame;

        if (isMaximizedRef.current) {
          restoredFrame = getFullFrame();
        } else {
          restoredFrame = clampWindowFrame(
            config,
            {
              position: savedPosition.current,
              size: savedSize.current,
            },
            bounds,
          );

          savedPosition.current = restoredFrame.position;
          savedSize.current = restoredFrame.size;
        }

        setFramePosition(restoredFrame.position);
        setFrameSize(restoredFrame.size);

        setScale(1);
        setOpacity(1);

        transitionTimeout = window.setTimeout(() => {
          setIsTransitioning(false);
          setIsClosing(false);
          isAnimating.current = false;
        }, MINIMIZE_ANIMATION_MS);
      });
    });

    return () => {
      cancelAnimationFrame(firstFrame);

      if (secondFrame) {
        cancelAnimationFrame(secondFrame);
      }

      if (transitionTimeout) {
        window.clearTimeout(transitionTimeout);
      }
      isAnimating.current = false;
    };
  }, [
    config,
    isClosing,
    isMinimized,
    reducedMotion,
    setFramePosition,
    setFrameSize,
  ]);

  useEffect(() => {
    if (!reducedMotion) {
      return;
    }
    clearAnimationTimers();
    if (pendingMinimize.current) {
      pendingMinimize.current = false;
      actions.minimize();
    }
    if (isOpening || isClosing) {
      const frame = isMaximizedRef.current
        ? getFullFrame()
        : isOpening
          ? getDefaultFrame()
          : clampWindowFrame(
              config,
              {
                position: savedPosition.current,
                size: savedSize.current,
              },
              getViewportBounds(),
            );
      setFramePosition(frame.position);
      setFrameSize(frame.size);
      savedPosition.current = frame.position;
      savedSize.current = frame.size;
    }
    setScale(1);
    setOpacity(1);
    setIsOpening(false);
    setIsClosing(false);
    setIsTransitioning(false);
    isAnimating.current = false;
  }, [
    actions,
    clearAnimationTimers,
    config,
    getDefaultFrame,
    isClosing,
    isOpening,
    reducedMotion,
    setFramePosition,
    setFrameSize,
  ]);

  /** Starts a title-bar drag from the supplied mouse event; returns nothing. */
  const handleDragMouseDown = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!isActive) {
        actions.focus();
      }

      event.preventDefault();

      dragRef.current = {
        startX: event.clientX - positionRef.current.x,
        startY: event.clientY - positionRef.current.y,

        needsRestore: isMaximizedRef.current,

        initialClientX: event.clientX,
        initialClientY: event.clientY,
      };

      hasActiveGesture.current = true;
      setIsDragging(true);
    },
    [actions, isActive],
  );

  /** Toggles maximize when allowed, with no inputs or return value. */
  const handleTitleBarDoubleClick = useCallback(() => {
    if (canMaximize) {
      handleMaximize();
    }
  }, [canMaximize, handleMaximize]);

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const version = gestureVersion.current;
    let hasMoved = false;
    let animationFrame = 0;

    let pendingPointer: {
      x: number;
      y: number;
    } | null = null;

    /** Applies the supplied pointer coordinates to the active drag; returns nothing. */
    const applyDragPosition = (clientX: number, clientY: number) => {
      if (version !== gestureVersion.current) {
        return;
      }
      if (dragRef.current.needsRestore) {
        const deltaX = Math.abs(clientX - dragRef.current.initialClientX);

        const deltaY = Math.abs(clientY - dragRef.current.initialClientY);

        if (deltaX <= DRAG_THRESHOLD && deltaY <= DRAG_THRESHOLD) {
          return;
        }

        const bounds = getViewportBounds();
        const restoredFrame = clampWindowFrame(
          config,
          {
            position: {
              x: previousState.current.x,
              y: previousState.current.y,
            },
            size: {
              width: previousState.current.width,
              height: previousState.current.height,
            },
          },
          bounds,
        );
        const cursorRatioX = clamp(clientX / bounds.width, 0, 1);
        const restoredPosition = clampWindowPosition(
          {
            x: clientX - restoredFrame.size.width * cursorRatioX,
            y: clientY - 24,
          },
          restoredFrame.size,
          bounds,
        );

        setIsTransitioning(!reducedMotion);
        setFramePosition(restoredPosition);
        setFrameSize(restoredFrame.size);

        setFrameMaximized(false);

        finishTransition(() => {
          setIsTransitioning(false);
        }, 150);

        dragRef.current = {
          startX: clientX - restoredPosition.x,
          startY: clientY - restoredPosition.y,
          needsRestore: false,
          initialClientX: clientX,
          initialClientY: clientY,
        };

        hasUserAdjustedFrame.current = true;

        return;
      }

      setFramePosition(
        clampWindowPosition(
          {
            x: clientX - dragRef.current.startX,
            y: clientY - dragRef.current.startY,
          },
          sizeRef.current,
          getViewportBounds(),
        ),
      );

      hasUserAdjustedFrame.current = true;

      if (clientY <= SNAP_THRESHOLD) {
        setFrameSnapZone("top");
        return;
      }

      setFrameSnapZone(null);
    };

    /** Applies the latest queued gesture coordinates with no inputs or return value. */
    const flushPendingPointer = () => {
      if (!pendingPointer) {
        return;
      }

      const pointer = pendingPointer;
      pendingPointer = null;

      applyDragPosition(pointer.x, pointer.y);
    };

    /** Queues the supplied mouse event for the next animation frame; returns nothing. */
    const handleMouseMove = (event: MouseEvent) => {
      hasMoved = true;
      pendingPointer = {
        x: event.clientX,
        y: event.clientY,
      };

      if (animationFrame) {
        return;
      }

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        flushPendingPointer();
      });
    };

    /** Flushes the supplied release coordinates and saves the completed gesture; returns nothing. */
    const handleMouseUp = (event: MouseEvent) => {
      if (version !== gestureVersion.current) {
        return;
      }
      if (
        hasMoved ||
        event.clientX !== dragRef.current.initialClientX ||
        event.clientY !== dragRef.current.initialClientY
      ) {
        pendingPointer = { x: event.clientX, y: event.clientY };
      }
      hasActiveGesture.current = false;
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }

      flushPendingPointer();

      dragRef.current.needsRestore = false;

      const currentSnapZone = snapZoneRef.current;

      if (currentSnapZone) {
        setIsTransitioning(!reducedMotion);

        if (!isMaximizedRef.current) {
          previousState.current = {
            x: savedPosition.current.x,
            y: savedPosition.current.y,
            width: savedSize.current.width,
            height: savedSize.current.height,
          };
        }

        if (currentSnapZone === "top") {
          setFramePosition(getFullFrame().position);

          setFrameSize(getFullFrame().size);

          setFrameMaximized(true);
        }

        finishTransition(() => {
          setIsTransitioning(false);
        }, 200);

        setFrameSnapZone(null);
      } else if (!isMaximizedRef.current) {
        savedPosition.current = {
          x: positionRef.current.x,
          y: positionRef.current.y,
        };

        savedSize.current = {
          width: sizeRef.current.width,
          height: sizeRef.current.height,
        };

        previousState.current = {
          x: positionRef.current.x,
          y: positionRef.current.y,
          width: sizeRef.current.width,
          height: sizeRef.current.height,
        };
      }

      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    config,
    isDragging,
    reducedMotion,
    finishTransition,
    setFrameMaximized,
    setFramePosition,
    setFrameSize,
    setFrameSnapZone,
  ]);

  /** Fits the frame and starts resizing from the supplied event and direction; returns nothing. */
  const handleResizeMouseDown = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>, direction: ResizeDirection) => {
      if (!canResize) {
        return;
      }

      if (!isActive) {
        actions.focus();
      }

      event.preventDefault();
      event.stopPropagation();

      const frame = clampWindowFrame(
        config,
        { position: positionRef.current, size: sizeRef.current },
        getViewportBounds(),
      );
      setFramePosition(frame.position);
      setFrameSize(frame.size);
      hasActiveGesture.current = true;
      setIsResizing(direction);

      resizeRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        startWidth: frame.size.width,
        startHeight: frame.size.height,
        startPosX: frame.position.x,
        startPosY: frame.position.y,
      };
    },
    [actions, canResize, config, isActive, setFramePosition, setFrameSize],
  );

  useEffect(() => {
    if (!isResizing) {
      return;
    }

    const version = gestureVersion.current;
    let animationFrame = 0;

    let pendingPointer: {
      x: number;
      y: number;
    } | null = null;

    /** Applies the supplied pointer coordinates to the anchored resize frame; returns nothing. */
    const applyResize = (clientX: number, clientY: number) => {
      if (version !== gestureVersion.current) {
        return;
      }
      const start = resizeRef.current;
      const frame = resizeWindowFrame(
        {
          position: { x: start.startPosX, y: start.startPosY },
          size: { width: start.startWidth, height: start.startHeight },
        },
        isResizing,
        {
          x: clientX - start.startX,
          y: clientY - start.startY,
        },
        config,
        getViewportBounds(),
      );
      setFrameSize(frame.size);
      setFramePosition(frame.position);

      hasUserAdjustedFrame.current = true;
    };

    /** Applies the latest queued gesture coordinates with no inputs or return value. */
    const flushPendingPointer = () => {
      if (!pendingPointer) {
        return;
      }

      const pointer = pendingPointer;
      pendingPointer = null;

      applyResize(pointer.x, pointer.y);
    };

    /** Queues the supplied mouse event for the next animation frame; returns nothing. */
    const handleMouseMove = (event: MouseEvent) => {
      pendingPointer = {
        x: event.clientX,
        y: event.clientY,
      };

      if (animationFrame) {
        return;
      }

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        flushPendingPointer();
      });
    };

    /** Flushes the supplied release coordinates and saves the completed gesture; returns nothing. */
    const handleMouseUp = (event: MouseEvent) => {
      if (version !== gestureVersion.current) {
        return;
      }
      pendingPointer = { x: event.clientX, y: event.clientY };
      hasActiveGesture.current = false;
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }

      flushPendingPointer();

      setIsResizing(null);

      savedPosition.current = {
        x: positionRef.current.x,
        y: positionRef.current.y,
      };

      savedSize.current = {
        width: sizeRef.current.width,
        height: sizeRef.current.height,
      };

      previousState.current = {
        x: positionRef.current.x,
        y: positionRef.current.y,
        width: sizeRef.current.width,
        height: sizeRef.current.height,
      };
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [config, isResizing, setFramePosition, setFrameSize]);

  useEffect(() => {
    let animationFrame = 0;

    /** Cancels active gestures and refits saved frames to the viewport; has no inputs or return value. */
    const handleBrowserResize = () => {
      if (hasActiveGesture.current && !isMaximizedRef.current) {
        previousState.current = {
          ...positionRef.current,
          ...sizeRef.current,
        };
      }
      gestureVersion.current += 1;
      hasActiveGesture.current = false;
      dragRef.current.needsRestore = false;
      setIsDragging(false);
      setIsResizing(null);
      setFrameSnapZone(null);

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(() => {
        const previousBounds = workAreaRef.current;
        const nextBounds = getWorkArea();

        workAreaRef.current = nextBounds;

        const previousRestoredFrame: WindowFrame = {
          position: {
            x: previousState.current.x,
            y: previousState.current.y,
          },
          size: {
            width: previousState.current.width,
            height: previousState.current.height,
          },
        };

        const nextRestoredFrame = hasUserAdjustedFrame.current
          ? scaleFrameBetweenWorkAreas(
              config,
              previousRestoredFrame,
              previousBounds,
              nextBounds,
            )
          : getDefaultWindowFrame(config, cascadeIndex);

        previousState.current = {
          x: nextRestoredFrame.position.x,
          y: nextRestoredFrame.position.y,
          width: nextRestoredFrame.size.width,
          height: nextRestoredFrame.size.height,
        };

        savedPosition.current = nextRestoredFrame.position;
        savedSize.current = nextRestoredFrame.size;

        if (isMaximized) {
          setFramePosition(getFullFrame().position);

          setFrameSize(getFullFrame().size);

          return;
        }

        setFramePosition(nextRestoredFrame.position);
        setFrameSize(nextRestoredFrame.size);
      });
    };

    window.addEventListener("resize", handleBrowserResize);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      window.removeEventListener("resize", handleBrowserResize);
    };
  }, [
    cascadeIndex,
    config,
    isMaximized,
    setFramePosition,
    setFrameSize,
    setFrameSnapZone,
  ]);

  /** Focuses the current window if inactive, with no inputs or return value. */
  const handleWindowMouseDown = useCallback(() => {
    if (!isActive) {
      actions.focus();
    }
  }, [actions, isActive]);

  const snapPreviewFrame =
    snapZone && typeof window !== "undefined" ? getFullFrame() : null;

  const snapPreviewStyle = snapPreviewFrame
    ? {
        top: snapPreviewFrame.position.y + 8,
        left: snapPreviewFrame.position.x + 8,
        width: snapPreviewFrame.size.width - 16,
        height: snapPreviewFrame.size.height - 16,
      }
    : null;

  const shouldRender = isOpen || (isMinimized && (isClosing || reducedMotion));

  return {
    reducedMotion,
    position,
    size,
    scale,
    opacity,
    zIndex,

    isActive,
    isMinimized,
    isMaximized,
    isOpening,
    isClosing,
    isTransitioning,

    snapZone,
    snapPreviewStyle,

    canMinimize,
    canMaximize,
    canResize,
    hideTitleBar,

    shouldRender,

    handleClose,
    handleMinimize,
    handleMaximize,

    handleDragMouseDown,
    handleTitleBarDoubleClick,
    handleResizeMouseDown,
    handleWindowMouseDown,
  };
}
