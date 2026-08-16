import {
    useCallback,
    useEffect,
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

function parseSize(value: string): number {
    if (typeof window === "undefined") {
        return Number.parseFloat(value);
    }

    if (value.endsWith("vw")) {
        return (Number.parseFloat(value) / 100) * window.innerWidth;
    }

    if (value.endsWith("vh")) {
        return (Number.parseFloat(value) / 100) * window.innerHeight;
    }

    return Number.parseFloat(value);
}

export function useWindowFrame({
    config,
    state,
    actions,
    cascadeIndex,
    iconPosition,
    getIconPosition,
}: UseWindowFrameOptions) {
    const cascadeOffset = cascadeIndex * CASCADE_OFFSET;

    const defaultWidth = config.width ?? DEFAULT_WIDTH;

    const defaultHeight = config.height ?? DEFAULT_HEIGHT;

    const minWidth = config.minWidth ?? DEFAULT_MIN_WIDTH;

    const minHeight = config.minHeight ?? DEFAULT_MIN_HEIGHT;

    const canMinimize = config.canMinimize !== false;

    const canMaximize = config.canMaximize !== false;

    const canResize = config.canResize !== false;

    const hideTitleBar = config.hideTitleBar === true;

    const shouldOpenMaximized = config.openMaximized === true;

    const getCenteredX = useCallback(() => {
        if (config.initialX !== undefined) {
            return config.initialX;
        }

        if (typeof window === "undefined") {
            return 100 + cascadeOffset;
        }

        const width = parseSize(defaultWidth);

        return Math.max(0, (window.innerWidth - width) / 2 + cascadeOffset);
    }, [cascadeOffset, config.initialX, defaultWidth]);

    const getCenteredY = useCallback(() => {
        if (config.initialY !== undefined) {
            return config.initialY;
        }

        if (typeof window === "undefined") {
            return 50 + cascadeOffset;
        }

        const height = parseSize(defaultHeight);

        return Math.max(0, (window.innerHeight - height) / 2 + cascadeOffset);
    }, [cascadeOffset, config.initialY, defaultHeight]);

    const defaultX = getCenteredX();
    const defaultY = getCenteredY();

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
            x: defaultX,
            y: defaultY + FALLBACK_OPEN_OFFSET_Y,
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

        return {
            width: parseSize(defaultWidth),

            height: parseSize(defaultHeight),
        };
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

    const isAnimating = useRef(false);

    const savedPosition = useRef<WindowPosition>({
        x: defaultX,
        y: defaultY,
    });

    const savedSize = useRef<WindowSize>({
        width: parseSize(defaultWidth),

        height: parseSize(defaultHeight),
    });

    const previousState = useRef({
        x: defaultX,
        y: defaultY,

        width: parseSize(defaultWidth),

        height: parseSize(defaultHeight),
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

        savedPosition.current = {
            x: position.x,
            y: position.y,
        };

        savedSize.current = {
            width: size.width,
            height: size.height,
        };

        setIsClosing(true);
        setIsTransitioning(true);

        setPosition(currentIconPosition);

        setSize({
            width: 60,
            height: 60,
        });

        setOpacity(0);

        window.setTimeout(() => {
            isAnimating.current = false;

            actions.minimize();
        }, 300);
    }, [actions, canMinimize, getIconPosition, iconPosition, position, size]);

    const handleMaximize = useCallback(() => {
        if (!canMaximize || typeof window === "undefined") {
            return;
        }

        setIsTransitioning(true);

        if (isMaximized || isSnapped) {
            setPosition({
                x: previousState.current.x,

                y: previousState.current.y,
            });

            setSize({
                width: previousState.current.width,

                height: previousState.current.height,
            });

            setIsMaximized(false);
            setIsSnapped(null);
        } else {
            previousState.current = {
                x: position.x,
                y: position.y,
                width: size.width,
                height: size.height,
            };

            setPosition({
                x: 0,
                y: 0,
            });

            setSize({
                width: window.innerWidth,

                height: window.innerHeight,
            });

            setIsMaximized(true);
            setIsSnapped(null);
        }

        window.setTimeout(() => {
            setIsTransitioning(false);
        }, 200);

        actions.toggleMaximize();
    }, [actions, canMaximize, isMaximized, isSnapped, position, size]);

    useEffect(() => {
        if (!isOpening) {
            return;
        }

        let secondFrame = 0;
        let transitionTimeout = 0;

        const firstFrame = requestAnimationFrame(() => {
            setIsTransitioning(true);

            secondFrame = requestAnimationFrame(() => {
                const nextPosition = {
                    x: getCenteredX(),

                    y: getCenteredY(),
                };

                const nextSize = {
                    width: parseSize(defaultWidth),

                    height: parseSize(defaultHeight),
                };

                setPosition(nextPosition);

                if (hasIconAnimation) {
                    setSize(nextSize);
                }

                setScale(1);
                setOpacity(1);

                transitionTimeout = window.setTimeout(() => {
                    setIsTransitioning(false);

                    setIsOpening(false);

                    savedPosition.current = nextPosition;

                    savedSize.current = nextSize;
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
        defaultHeight,
        defaultWidth,
        getCenteredX,
        getCenteredY,
        hasIconAnimation,
        isOpening,
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
                setPosition(savedPosition.current);

                setSize(savedSize.current);

                setScale(1);
                setOpacity(1);

                transitionTimeout = window.setTimeout(() => {
                    setIsTransitioning(false);

                    setIsClosing(false);

                    isAnimating.current = false;
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
    }, [isClosing, isMinimized]);

    const handleDragMouseDown = useCallback(
        (event: ReactMouseEvent<HTMLDivElement>) => {
            if (!isActive) {
                actions.focus();
            }

            event.preventDefault();

            dragRef.current = {
                startX: event.clientX - position.x,

                startY: event.clientY - position.y,

                needsRestore: isMaximized || isSnapped !== null,

                initialClientX: event.clientX,

                initialClientY: event.clientY,
            };

            setIsDragging(true);
        },
        [actions, isActive, isMaximized, isSnapped, position],
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

        const handleMouseMove = (event: MouseEvent) => {
            if (dragRef.current.needsRestore) {
                const deltaX = Math.abs(
                    event.clientX - dragRef.current.initialClientX,
                );

                const deltaY = Math.abs(
                    event.clientY - dragRef.current.initialClientY,
                );

                if (deltaX <= DRAG_THRESHOLD && deltaY <= DRAG_THRESHOLD) {
                    return;
                }

                const previousWidth = previousState.current.width;

                const previousHeight = previousState.current.height;

                const cursorRatioX = event.clientX / window.innerWidth;

                const newX = event.clientX - previousWidth * cursorRatioX;

                const newY = event.clientY - 24;

                const restoredX = Math.max(0, newX);

                const restoredY = Math.max(0, newY);

                setIsTransitioning(true);

                setPosition({
                    x: restoredX,
                    y: restoredY,
                });

                setSize({
                    width: previousWidth,
                    height: previousHeight,
                });

                setIsMaximized(false);
                setIsSnapped(null);

                window.setTimeout(() => {
                    setIsTransitioning(false);
                }, 150);

                dragRef.current = {
                    startX: event.clientX - restoredX,

                    startY: event.clientY - restoredY,

                    needsRestore: false,

                    initialClientX: event.clientX,

                    initialClientY: event.clientY,
                };

                return;
            }

            const newX = event.clientX - dragRef.current.startX;

            const newY = Math.max(0, event.clientY - dragRef.current.startY);

            setPosition({
                x: newX,
                y: newY,
            });

            if (event.clientY <= SNAP_THRESHOLD) {
                setSnapZone("top");
                return;
            }

            if (event.clientX <= SNAP_THRESHOLD) {
                setSnapZone("left");
                return;
            }

            if (event.clientX >= window.innerWidth - SNAP_THRESHOLD) {
                setSnapZone("right");
                return;
            }

            setSnapZone(null);
        };

        const handleMouseUp = () => {
            dragRef.current.needsRestore = false;

            if (snapZone) {
                setIsTransitioning(true);

                if (!isMaximized && !isSnapped) {
                    previousState.current = {
                        x: savedPosition.current.x,

                        y: savedPosition.current.y,

                        width: savedSize.current.width,

                        height: savedSize.current.height,
                    };
                }

                if (snapZone === "top") {
                    setPosition({
                        x: 0,
                        y: 0,
                    });

                    setSize({
                        width: window.innerWidth,

                        height: window.innerHeight,
                    });

                    setIsMaximized(true);
                    setIsSnapped(null);
                }

                if (snapZone === "left") {
                    setPosition({
                        x: 0,
                        y: 0,
                    });

                    setSize({
                        width: window.innerWidth / 2,

                        height: window.innerHeight,
                    });

                    setIsSnapped("left");
                    setIsMaximized(false);
                }

                if (snapZone === "right") {
                    setPosition({
                        x: window.innerWidth / 2,

                        y: 0,
                    });

                    setSize({
                        width: window.innerWidth / 2,

                        height: window.innerHeight,
                    });

                    setIsSnapped("right");

                    setIsMaximized(false);
                }

                window.setTimeout(() => {
                    setIsTransitioning(false);
                }, 200);

                setSnapZone(null);
            } else if (!isMaximized && !isSnapped) {
                savedPosition.current = {
                    x: position.x,
                    y: position.y,
                };

                savedSize.current = {
                    width: size.width,
                    height: size.height,
                };
            }

            setIsDragging(false);
        };

        document.addEventListener("mousemove", handleMouseMove);

        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);

            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, isMaximized, isSnapped, position, size, snapZone]);

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

                startWidth: size.width,

                startHeight: size.height,

                startPosX: position.x,

                startPosY: position.y,
            };
        },
        [actions, canResize, isActive, position, size],
    );

    useEffect(() => {
        if (!isResizing) {
            return;
        }

        const handleMouseMove = (event: MouseEvent) => {
            const deltaX = event.clientX - resizeRef.current.startX;

            const deltaY = event.clientY - resizeRef.current.startY;

            let newWidth = resizeRef.current.startWidth;

            let newHeight = resizeRef.current.startHeight;

            let newX = resizeRef.current.startPosX;

            let newY = resizeRef.current.startPosY;

            if (isResizing.includes("right")) {
                newWidth = Math.max(
                    minWidth,
                    resizeRef.current.startWidth + deltaX,
                );
            }

            if (isResizing.includes("left")) {
                const potentialWidth = resizeRef.current.startWidth - deltaX;

                if (potentialWidth >= minWidth) {
                    newWidth = potentialWidth;

                    newX = resizeRef.current.startPosX + deltaX;
                }
            }

            if (isResizing.includes("bottom")) {
                newHeight = Math.max(
                    minHeight,
                    resizeRef.current.startHeight + deltaY,
                );
            }

            if (isResizing.includes("top")) {
                const potentialHeight = resizeRef.current.startHeight - deltaY;

                const potentialY = resizeRef.current.startPosY + deltaY;

                if (potentialHeight >= minHeight && potentialY >= 0) {
                    newHeight = potentialHeight;

                    newY = potentialY;
                }
            }

            setSize({
                width: newWidth,
                height: newHeight,
            });

            setPosition({
                x: newX,
                y: newY,
            });
        };

        const handleMouseUp = () => {
            setIsResizing(null);

            savedPosition.current = {
                x: position.x,
                y: position.y,
            };

            savedSize.current = {
                width: size.width,
                height: size.height,
            };
        };

        document.addEventListener("mousemove", handleMouseMove);

        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);

            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing, minHeight, minWidth, position, size]);

    useEffect(() => {
        if (!isMaximized && !isSnapped) {
            return;
        }

        const handleBrowserResize = () => {
            if (isMaximized) {
                setPosition({
                    x: 0,
                    y: 0,
                });

                setSize({
                    width: window.innerWidth,

                    height: window.innerHeight,
                });

                return;
            }

            if (isSnapped === "left") {
                setPosition({
                    x: 0,
                    y: 0,
                });

                setSize({
                    width: window.innerWidth / 2,

                    height: window.innerHeight,
                });

                return;
            }

            if (isSnapped === "right") {
                setPosition({
                    x: window.innerWidth / 2,

                    y: 0,
                });

                setSize({
                    width: window.innerWidth / 2,

                    height: window.innerHeight,
                });
            }
        };

        window.addEventListener("resize", handleBrowserResize);

        return () => {
            window.removeEventListener("resize", handleBrowserResize);
        };
    }, [isMaximized, isSnapped]);

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
