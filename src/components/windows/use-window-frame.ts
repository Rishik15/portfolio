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

type SnapZone = "top" | "left" | "right" | null;

type SnappedSide = "left" | "right" | null;

type UseWindowFrameOptions = {
    config: AppWindowConfig;
    state: WindowState;
    actions: WindowActions;
    cascadeIndex: number;
    iconPosition?: WindowPosition;
    getIconPosition?: () => WindowPosition | undefined;
};

const DEFAULT_WIDTH = "650px";
const DEFAULT_HEIGHT = "500px";

const DEFAULT_MIN_WIDTH = 400;
const DEFAULT_MIN_HEIGHT = 300;

const CASCADE_OFFSET = 30;
const SNAP_THRESHOLD = 10;
const DRAG_THRESHOLD = 1;

const FALLBACK_OPEN_OFFSET_Y = 6;
const FALLBACK_OPEN_SCALE = 0.985;

const MINIMIZE_ANIMATION_MS = 450;

const DEFAULT_VIEWPORT_WIDTH = 1440;
const DEFAULT_VIEWPORT_HEIGHT = 900;

function clamp(value: number, minimum: number, maximum: number) {
    return Math.min(Math.max(value, minimum), maximum);
}

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

function parseSize(
    value: string,
    viewportWidth: number,
    viewportHeight: number,
): number {
    const parsed = Number.parseFloat(value);

    if (!Number.isFinite(parsed)) {
        return 0;
    }

    if (value.endsWith("vw")) {
        return (parsed / 100) * viewportWidth;
    }

    if (value.endsWith("vh")) {
        return (parsed / 100) * viewportHeight;
    }

    return parsed;
}

function getSizeLimits(config: AppWindowConfig, bounds: WindowBounds) {
    const minWidth = Math.min(
        config.minWidth ?? DEFAULT_MIN_WIDTH,
        bounds.width,
    );

    const minHeight = Math.min(
        config.minHeight ?? DEFAULT_MIN_HEIGHT,
        bounds.height,
    );

    const maxWidth = Math.max(
        minWidth,
        Math.min(config.maxWidth ?? bounds.width, bounds.width),
    );

    const maxHeight = Math.max(
        minHeight,
        Math.min(config.maxHeight ?? bounds.height, bounds.height),
    );

    return {
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
    };
}

function getResponsiveWindowSize(
    config: AppWindowConfig,
    bounds: WindowBounds,
): WindowSize {
    const limits = getSizeLimits(config, bounds);

    const preferredWidth = parseSize(
        config.width ?? DEFAULT_WIDTH,
        bounds.width,
        bounds.height,
    );

    const preferredHeight = parseSize(
        config.height ?? DEFAULT_HEIGHT,
        bounds.width,
        bounds.height,
    );

    return {
        width: clamp(preferredWidth, limits.minWidth, limits.maxWidth),
        height: clamp(preferredHeight, limits.minHeight, limits.maxHeight),
    };
}

function clampWindowFrame(
    config: AppWindowConfig,
    frame: WindowFrame,
    bounds: WindowBounds,
): WindowFrame {
    const limits = getSizeLimits(config, bounds);

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

function getDefaultWindowFrame(
    config: AppWindowConfig,
    cascadeIndex: number,
): WindowFrame {
    const bounds = getViewportBounds();
    const size = getResponsiveWindowSize(config, bounds);

    const freeX = Math.max(0, bounds.width - size.width);
    const freeY = Math.max(0, bounds.height - size.height);

    const placementX = clamp(config.initialPlacement?.x ?? 0.5, 0, 1);
    const placementY = clamp(config.initialPlacement?.y ?? 0.5, 0, 1);

    const cascadeOffset =
        config.initialPlacement === undefined
            ? cascadeIndex * CASCADE_OFFSET
            : 0;

    return clampWindowFrame(
        config,
        {
            position: {
                x: freeX * placementX + cascadeOffset,
                y: freeY * placementY + cascadeOffset,
            },
            size,
        },
        bounds,
    );
}

function scaleFrameBetweenViewports(
    config: AppWindowConfig,
    frame: WindowFrame,
    previousBounds: WindowBounds,
    nextBounds: WindowBounds,
): WindowFrame {
    const widthScale =
        previousBounds.width > 0 ? nextBounds.width / previousBounds.width : 1;

    const heightScale =
        previousBounds.height > 0
            ? nextBounds.height / previousBounds.height
            : 1;

    const previousFreeX = Math.max(0, previousBounds.width - frame.size.width);

    const previousFreeY = Math.max(
        0,
        previousBounds.height - frame.size.height,
    );

    const horizontalProgress =
        previousFreeX > 0 ? clamp(frame.position.x / previousFreeX, 0, 1) : 0.5;

    const verticalProgress =
        previousFreeY > 0 ? clamp(frame.position.y / previousFreeY, 0, 1) : 0.5;

    const limits = getSizeLimits(config, nextBounds);

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

    return clampWindowFrame(
        config,
        {
            position: {
                x: nextFreeX * horizontalProgress,
                y: nextFreeY * verticalProgress,
            },
            size: {
                width: nextWidth,
                height: nextHeight,
            },
        },
        nextBounds,
    );
}

export function useWindowFrame({
    config,
    state,
    actions,
    cascadeIndex,
    iconPosition,
    getIconPosition,
}: UseWindowFrameOptions) {
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

    const hasIconAnimation = iconPosition !== undefined;
    const hasFallbackOpenAnimation = !hasIconAnimation && !shouldOpenMaximized;
    const shouldAnimateOpen = hasIconAnimation || hasFallbackOpenAnimation;

    const [position, setPosition] = useState<WindowPosition>(() => {
        if (hasIconAnimation) {
            return iconPosition;
        }

        if (shouldOpenMaximized) {
            return {
                x: 0,
                y: 0,
            };
        }

        return {
            x: defaultFrame.position.x,
            y: defaultFrame.position.y + FALLBACK_OPEN_OFFSET_Y,
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
            return {
                width: window.innerWidth,
                height: window.innerHeight,
            };
        }

        return defaultFrame.size;
    });

    const [scale, setScale] = useState(
        hasFallbackOpenAnimation ? FALLBACK_OPEN_SCALE : 1,
    );

    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState<ResizeDirection>(null);
    const [isMaximized, setIsMaximized] = useState(shouldOpenMaximized);
    const [isSnapped, setIsSnapped] = useState<SnappedSide>(null);
    const [snapZone, setSnapZone] = useState<SnapZone>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isOpening, setIsOpening] = useState(shouldAnimateOpen);
    const [isClosing, setIsClosing] = useState(false);
    const [opacity, setOpacity] = useState(shouldAnimateOpen ? 0 : 1);

    const positionRef = useRef(position);
    const sizeRef = useRef(size);

    const isMaximizedRef = useRef(isMaximized);
    const isSnappedRef = useRef<SnappedSide>(isSnapped);
    const snapZoneRef = useRef<SnapZone>(snapZone);

    const isAnimating = useRef(false);
    const hasUserAdjustedFrame = useRef(false);
    const viewportBoundsRef = useRef(getViewportBounds());

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

    const setFramePosition = useCallback((nextPosition: WindowPosition) => {
        positionRef.current = nextPosition;
        setPosition(nextPosition);
    }, []);

    const setFrameSize = useCallback((nextSize: WindowSize) => {
        sizeRef.current = nextSize;
        setSize(nextSize);
    }, []);

    const setFrameMaximized = useCallback((nextValue: boolean) => {
        isMaximizedRef.current = nextValue;
        setIsMaximized(nextValue);
    }, []);

    const setFrameSnapped = useCallback((nextValue: SnappedSide) => {
        isSnappedRef.current = nextValue;
        setIsSnapped(nextValue);
    }, []);

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

    const handleClose = useCallback(() => {
        actions.close();
    }, [actions]);

    const handleMinimize = useCallback(() => {
        if (isAnimating.current || !canMinimize) {
            return;
        }

        const currentIconPosition = getIconPosition?.() ?? iconPosition;

        if (!currentIconPosition) {
            actions.minimize();
            return;
        }

        isAnimating.current = true;

        if (!isMaximizedRef.current && isSnappedRef.current === null) {
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
        setIsTransitioning(true);

        setFramePosition(currentIconPosition);

        setFrameSize({
            width: 60,
            height: 60,
        });

        setOpacity(0);

        window.setTimeout(() => {
            isAnimating.current = false;
            actions.minimize();
        }, MINIMIZE_ANIMATION_MS);
    }, [
        actions,
        canMinimize,
        getIconPosition,
        iconPosition,
        setFramePosition,
        setFrameSize,
    ]);

    const handleMaximize = useCallback(() => {
        if (!canMaximize || typeof window === "undefined") {
            return;
        }

        setIsTransitioning(true);

        if (isMaximizedRef.current || isSnappedRef.current) {
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
            setFrameSnapped(null);
        } else {
            previousState.current = {
                x: positionRef.current.x,
                y: positionRef.current.y,
                width: sizeRef.current.width,
                height: sizeRef.current.height,
            };

            setFramePosition({
                x: 0,
                y: 0,
            });

            setFrameSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });

            setFrameMaximized(true);
            setFrameSnapped(null);
        }

        window.setTimeout(() => {
            setIsTransitioning(false);
        }, 200);

        actions.toggleMaximize();
    }, [
        actions,
        canMaximize,
        config,
        setFrameMaximized,
        setFramePosition,
        setFrameSize,
        setFrameSnapped,
    ]);

    useEffect(() => {
        if (!isOpening) {
            return;
        }

        let secondFrame = 0;
        let transitionTimeout = 0;

        const firstFrame = requestAnimationFrame(() => {
            setIsTransitioning(true);

            secondFrame = requestAnimationFrame(() => {
                const nextFrame = getDefaultFrame();

                setFramePosition(nextFrame.position);

                if (hasIconAnimation) {
                    setFrameSize(nextFrame.size);
                }

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
        isOpening,
        setFramePosition,
        setFrameSize,
    ]);

    useEffect(() => {
        if (isMinimized || !isClosing || isAnimating.current) {
            return;
        }

        isAnimating.current = true;

        let secondFrame = 0;
        let transitionTimeout = 0;

        const firstFrame = requestAnimationFrame(() => {
            setIsTransitioning(true);

            secondFrame = requestAnimationFrame(() => {
                const bounds = getViewportBounds();

                let restoredFrame: WindowFrame;

                if (isMaximizedRef.current) {
                    restoredFrame = {
                        position: {
                            x: 0,
                            y: 0,
                        },
                        size: {
                            width: bounds.width,
                            height: bounds.height,
                        },
                    };
                } else if (isSnappedRef.current === "left") {
                    restoredFrame = {
                        position: {
                            x: 0,
                            y: 0,
                        },
                        size: {
                            width: bounds.width / 2,
                            height: bounds.height,
                        },
                    };
                } else if (isSnappedRef.current === "right") {
                    restoredFrame = {
                        position: {
                            x: bounds.width / 2,
                            y: 0,
                        },
                        size: {
                            width: bounds.width / 2,
                            height: bounds.height,
                        },
                    };
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
        };
    }, [config, isClosing, isMinimized, setFramePosition, setFrameSize]);

    const handleDragMouseDown = useCallback(
        (event: ReactMouseEvent<HTMLDivElement>) => {
            if (!isActive) {
                actions.focus();
            }

            event.preventDefault();

            dragRef.current = {
                startX: event.clientX - positionRef.current.x,
                startY: event.clientY - positionRef.current.y,

                needsRestore:
                    isMaximizedRef.current || isSnappedRef.current !== null,

                initialClientX: event.clientX,
                initialClientY: event.clientY,
            };

            setIsDragging(true);
        },
        [actions, isActive],
    );

    const handleTitleBarDoubleClick = useCallback(() => {
        if (canMaximize) {
            handleMaximize();
        }
    }, [canMaximize, handleMaximize]);

    useEffect(() => {
        if (!isDragging) {
            return;
        }

        let animationFrame = 0;

        let pendingPointer: {
            x: number;
            y: number;
        } | null = null;

        const applyDragPosition = (clientX: number, clientY: number) => {
            if (dragRef.current.needsRestore) {
                const deltaX = Math.abs(
                    clientX - dragRef.current.initialClientX,
                );

                const deltaY = Math.abs(
                    clientY - dragRef.current.initialClientY,
                );

                if (deltaX <= DRAG_THRESHOLD && deltaY <= DRAG_THRESHOLD) {
                    return;
                }

                const previousWidth = previousState.current.width;
                const previousHeight = previousState.current.height;

                const cursorRatioX = clientX / window.innerWidth;

                const newX = clientX - previousWidth * cursorRatioX;
                const newY = clientY - 24;

                const restoredX = Math.max(0, newX);
                const restoredY = Math.max(0, newY);

                setIsTransitioning(true);

                setFramePosition({
                    x: restoredX,
                    y: restoredY,
                });

                setFrameSize({
                    width: previousWidth,
                    height: previousHeight,
                });

                setFrameMaximized(false);
                setFrameSnapped(null);

                window.setTimeout(() => {
                    setIsTransitioning(false);
                }, 150);

                dragRef.current = {
                    startX: clientX - restoredX,
                    startY: clientY - restoredY,
                    needsRestore: false,
                    initialClientX: clientX,
                    initialClientY: clientY,
                };

                hasUserAdjustedFrame.current = true;

                return;
            }

            const newX = clientX - dragRef.current.startX;
            const newY = Math.max(0, clientY - dragRef.current.startY);

            setFramePosition({
                x: newX,
                y: newY,
            });

            hasUserAdjustedFrame.current = true;

            if (clientY <= SNAP_THRESHOLD) {
                setFrameSnapZone("top");
                return;
            }

            if (clientX <= SNAP_THRESHOLD) {
                setFrameSnapZone("left");
                return;
            }

            if (clientX >= window.innerWidth - SNAP_THRESHOLD) {
                setFrameSnapZone("right");
                return;
            }

            setFrameSnapZone(null);
        };

        const flushPendingPointer = () => {
            if (!pendingPointer) {
                return;
            }

            const pointer = pendingPointer;
            pendingPointer = null;

            applyDragPosition(pointer.x, pointer.y);
        };

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

        const handleMouseUp = () => {
            if (animationFrame) {
                window.cancelAnimationFrame(animationFrame);
                animationFrame = 0;
            }

            flushPendingPointer();

            dragRef.current.needsRestore = false;

            const currentSnapZone = snapZoneRef.current;

            if (currentSnapZone) {
                setIsTransitioning(true);

                if (!isMaximizedRef.current && isSnappedRef.current === null) {
                    previousState.current = {
                        x: savedPosition.current.x,
                        y: savedPosition.current.y,
                        width: savedSize.current.width,
                        height: savedSize.current.height,
                    };
                }

                if (currentSnapZone === "top") {
                    setFramePosition({
                        x: 0,
                        y: 0,
                    });

                    setFrameSize({
                        width: window.innerWidth,
                        height: window.innerHeight,
                    });

                    setFrameMaximized(true);
                    setFrameSnapped(null);
                }

                if (currentSnapZone === "left") {
                    setFramePosition({
                        x: 0,
                        y: 0,
                    });

                    setFrameSize({
                        width: window.innerWidth / 2,
                        height: window.innerHeight,
                    });

                    setFrameSnapped("left");
                    setFrameMaximized(false);
                }

                if (currentSnapZone === "right") {
                    setFramePosition({
                        x: window.innerWidth / 2,
                        y: 0,
                    });

                    setFrameSize({
                        width: window.innerWidth / 2,
                        height: window.innerHeight,
                    });

                    setFrameSnapped("right");
                    setFrameMaximized(false);
                }

                window.setTimeout(() => {
                    setIsTransitioning(false);
                }, 200);

                setFrameSnapZone(null);
            } else if (
                !isMaximizedRef.current &&
                isSnappedRef.current === null
            ) {
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
        isDragging,
        setFrameMaximized,
        setFramePosition,
        setFrameSize,
        setFrameSnapped,
        setFrameSnapZone,
    ]);

    const handleResizeMouseDown = useCallback(
        (
            event: ReactMouseEvent<HTMLDivElement>,
            direction: ResizeDirection,
        ) => {
            if (!canResize) {
                return;
            }

            if (!isActive) {
                actions.focus();
            }

            event.preventDefault();
            event.stopPropagation();

            setIsResizing(direction);

            resizeRef.current = {
                startX: event.clientX,
                startY: event.clientY,
                startWidth: sizeRef.current.width,
                startHeight: sizeRef.current.height,
                startPosX: positionRef.current.x,
                startPosY: positionRef.current.y,
            };
        },
        [actions, canResize, isActive],
    );

    useEffect(() => {
        if (!isResizing) {
            return;
        }

        let animationFrame = 0;

        let pendingPointer: {
            x: number;
            y: number;
        } | null = null;

        const applyResize = (clientX: number, clientY: number) => {
            const bounds = getViewportBounds();
            const limits = getSizeLimits(config, bounds);

            const deltaX = clientX - resizeRef.current.startX;
            const deltaY = clientY - resizeRef.current.startY;

            let newWidth = resizeRef.current.startWidth;
            let newHeight = resizeRef.current.startHeight;

            let newX = resizeRef.current.startPosX;
            let newY = resizeRef.current.startPosY;

            if (isResizing.includes("right")) {
                newWidth = Math.max(
                    limits.minWidth,
                    resizeRef.current.startWidth + deltaX,
                );

                newWidth = Math.min(newWidth, limits.maxWidth);
            }

            if (isResizing.includes("left")) {
                const potentialWidth = resizeRef.current.startWidth - deltaX;

                if (potentialWidth >= limits.minWidth) {
                    newWidth = Math.min(potentialWidth, limits.maxWidth);

                    newX =
                        resizeRef.current.startPosX +
                        (resizeRef.current.startWidth - newWidth);
                }
            }

            if (isResizing.includes("bottom")) {
                newHeight = Math.max(
                    limits.minHeight,
                    resizeRef.current.startHeight + deltaY,
                );

                newHeight = Math.min(newHeight, limits.maxHeight);
            }

            if (isResizing.includes("top")) {
                const potentialHeight = resizeRef.current.startHeight - deltaY;

                const potentialY = resizeRef.current.startPosY + deltaY;

                if (potentialHeight >= limits.minHeight && potentialY >= 0) {
                    newHeight = Math.min(potentialHeight, limits.maxHeight);

                    newY =
                        resizeRef.current.startPosY +
                        (resizeRef.current.startHeight - newHeight);
                }
            }

            setFrameSize({
                width: newWidth,
                height: newHeight,
            });

            setFramePosition({
                x: newX,
                y: newY,
            });

            hasUserAdjustedFrame.current = true;
        };

        const flushPendingPointer = () => {
            if (!pendingPointer) {
                return;
            }

            const pointer = pendingPointer;
            pendingPointer = null;

            applyResize(pointer.x, pointer.y);
        };

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

        const handleMouseUp = () => {
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

        const handleBrowserResize = () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }

            animationFrame = requestAnimationFrame(() => {
                const previousBounds = viewportBoundsRef.current;
                const nextBounds = getViewportBounds();

                viewportBoundsRef.current = nextBounds;

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
                    ? scaleFrameBetweenViewports(
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
                    setFramePosition({
                        x: 0,
                        y: 0,
                    });

                    setFrameSize({
                        width: nextBounds.width,
                        height: nextBounds.height,
                    });

                    return;
                }

                if (isSnapped === "left") {
                    setFramePosition({
                        x: 0,
                        y: 0,
                    });

                    setFrameSize({
                        width: nextBounds.width / 2,
                        height: nextBounds.height,
                    });

                    return;
                }

                if (isSnapped === "right") {
                    setFramePosition({
                        x: nextBounds.width / 2,
                        y: 0,
                    });

                    setFrameSize({
                        width: nextBounds.width / 2,
                        height: nextBounds.height,
                    });

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
        isSnapped,
        setFramePosition,
        setFrameSize,
    ]);

    const handleWindowMouseDown = useCallback(() => {
        if (!isActive) {
            actions.focus();
        }
    }, [actions, isActive]);

    const snapPreviewStyle =
        snapZone && typeof window !== "undefined"
            ? {
                  top: 8,

                  left: snapZone === "right" ? window.innerWidth / 2 + 4 : 8,

                  width:
                      snapZone === "top"
                          ? window.innerWidth - 16
                          : window.innerWidth / 2 - 12,

                  height: window.innerHeight - 16,
              }
            : null;

    const shouldRender = isOpen || (isMinimized && isClosing);

    return {
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
