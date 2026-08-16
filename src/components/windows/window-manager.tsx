"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";

export type WindowPosition = {
    x: number;
    y: number;
};

export type WindowPlacement = {
    x: number;
    y: number;
};

export type AppWindowConfig = {
    id: string;
    title: string;
    icon?: ReactNode;

    width?: string;
    height?: string;

    minWidth?: number;
    minHeight?: number;

    maxWidth?: number;
    maxHeight?: number;

    initialPlacement?: WindowPlacement;

    canMinimize?: boolean;
    canMaximize?: boolean;
    canResize?: boolean;

    closeOnMinimize?: boolean;

    hideTitleBar?: boolean;
    openMaximized?: boolean;
};

export type ClosedWindowState = {
    status: "closed";
};

export type OpenWindowState = {
    status: "open";
    isActive: boolean;
    isMaximized: boolean;
    zIndex: number;
};

export type MinimizedWindowState = {
    status: "minimized";
    zIndex: number;
};

export type WindowState =
    ClosedWindowState | OpenWindowState | MinimizedWindowState;

export type WindowActions = {
    open: () => void;
    close: () => void;
    minimize: () => void;
    restore: () => void;
    maximize: () => void;
    unmaximize: () => void;
    toggleMaximize: () => void;
    focus: () => void;
};

export type WindowInstance = {
    config: AppWindowConfig;
    state: WindowState;
    actions: WindowActions;
};

type WindowManagerContextValue = {
    windows: Map<string, WindowInstance>;

    activateWindow: (id: string) => void;
    openWindow: (id: string) => void;
    closeWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    restoreWindow: (id: string) => void;
    focusWindow: (id: string) => void;
    deactivateAll: () => void;

    registerLauncher: (windowId: string, element: HTMLElement | null) => void;

    getLauncherPosition: (windowId: string) => WindowPosition | undefined;
};

type WindowManagerProviderProps = {
    configs: readonly AppWindowConfig[];
    children: ReactNode;
};

const MINIMIZED_WINDOW_SIZE = 60;

function createClosedState(): ClosedWindowState {
    return {
        status: "closed",
    };
}

function createOpenState(
    isActive = false,
    isMaximized = false,
    zIndex = 1,
): OpenWindowState {
    return {
        status: "open",
        isActive,
        isMaximized,
        zIndex,
    };
}

function createMinimizedState(zIndex = 1): MinimizedWindowState {
    return {
        status: "minimized",
        zIndex,
    };
}

export function isWindowOpen(state: WindowState): state is OpenWindowState {
    return state.status === "open";
}

export function isWindowMinimized(
    state: WindowState,
): state is MinimizedWindowState {
    return state.status === "minimized";
}

function deactivateOpenWindows(states: Map<string, WindowState>) {
    for (const [windowId, state] of states) {
        if (isWindowOpen(state) && state.isActive) {
            states.set(windowId, {
                ...state,
                isActive: false,
            });
        }
    }
}

const WindowManagerContext = createContext<WindowManagerContextValue | null>(
    null,
);

export function WindowManagerProvider({
    configs,
    children,
}: WindowManagerProviderProps) {
    const nextZIndexRef = useRef(1);

    const launcherElementsRef = useRef(new Map<string, HTMLElement>());

    const configuredWindowIds = useMemo(
        () => new Set(configs.map((config) => config.id)),
        [configs],
    );

    const [windowStates, setWindowStates] = useState<Map<string, WindowState>>(
        () => {
            const initialStates = new Map<string, WindowState>();

            for (const config of configs) {
                initialStates.set(config.id, createClosedState());
            }

            return initialStates;
        },
    );

    const activateWindow = useCallback(
        (id: string) => {
            if (!configuredWindowIds.has(id)) {
                console.warn(`WindowManager: Window "${id}" was not found.`);
                return;
            }

            setWindowStates((previousStates) => {
                const currentState =
                    previousStates.get(id) ?? createClosedState();

                const nextStates = new Map(previousStates);

                deactivateOpenWindows(nextStates);

                const zIndex = nextZIndexRef.current++;

                if (isWindowOpen(currentState)) {
                    nextStates.set(id, {
                        ...currentState,
                        isActive: true,
                        zIndex,
                    });

                    return nextStates;
                }

                nextStates.set(id, createOpenState(true, false, zIndex));

                return nextStates;
            });
        },
        [configuredWindowIds],
    );

    const openWindow = useCallback(
        (id: string) => {
            if (!configuredWindowIds.has(id)) {
                console.warn(`WindowManager: Window "${id}" was not found.`);
                return;
            }

            setWindowStates((previousStates) => {
                const currentState =
                    previousStates.get(id) ?? createClosedState();

                if (isWindowOpen(currentState)) {
                    return previousStates;
                }

                const nextStates = new Map(previousStates);

                deactivateOpenWindows(nextStates);

                const zIndex = nextZIndexRef.current++;

                nextStates.set(id, createOpenState(true, false, zIndex));

                return nextStates;
            });
        },
        [configuredWindowIds],
    );

    const closeWindow = useCallback(
        (id: string) => {
            if (!configuredWindowIds.has(id)) {
                console.warn(`WindowManager: Window "${id}" was not found.`);
                return;
            }

            setWindowStates((previousStates) => {
                const currentState =
                    previousStates.get(id) ?? createClosedState();

                if (currentState.status === "closed") {
                    return previousStates;
                }

                const nextStates = new Map(previousStates);

                nextStates.set(id, createClosedState());

                return nextStates;
            });
        },
        [configuredWindowIds],
    );

    const minimizeWindow = useCallback(
        (id: string) => {
            if (!configuredWindowIds.has(id)) {
                console.warn(`WindowManager: Window "${id}" was not found.`);
                return;
            }

            setWindowStates((previousStates) => {
                const currentState = previousStates.get(id);

                if (!currentState || !isWindowOpen(currentState)) {
                    return previousStates;
                }

                const config = configs.find(
                    (windowConfig) => windowConfig.id === id,
                );

                const nextStates = new Map(previousStates);

                if (config?.closeOnMinimize) {
                    nextStates.set(id, createClosedState());

                    return nextStates;
                }

                nextStates.set(id, createMinimizedState(currentState.zIndex));

                return nextStates;
            });
        },
        [configs, configuredWindowIds],
    );

    const restoreWindow = useCallback(
        (id: string) => {
            if (!configuredWindowIds.has(id)) {
                console.warn(`WindowManager: Window "${id}" was not found.`);
                return;
            }

            setWindowStates((previousStates) => {
                const currentState = previousStates.get(id);

                if (!currentState || !isWindowMinimized(currentState)) {
                    return previousStates;
                }

                const nextStates = new Map(previousStates);

                deactivateOpenWindows(nextStates);

                const zIndex = nextZIndexRef.current++;

                nextStates.set(id, createOpenState(true, false, zIndex));

                return nextStates;
            });
        },
        [configuredWindowIds],
    );

    const focusWindow = useCallback(
        (id: string) => {
            if (!configuredWindowIds.has(id)) {
                console.warn(`WindowManager: Window "${id}" was not found.`);
                return;
            }

            setWindowStates((previousStates) => {
                const currentState = previousStates.get(id);

                if (!currentState || !isWindowOpen(currentState)) {
                    return previousStates;
                }

                if (currentState.isActive) {
                    return previousStates;
                }

                const nextStates = new Map(previousStates);

                deactivateOpenWindows(nextStates);

                const zIndex = nextZIndexRef.current++;

                nextStates.set(id, {
                    ...currentState,
                    isActive: true,
                    zIndex,
                });

                return nextStates;
            });
        },
        [configuredWindowIds],
    );

    const deactivateAll = useCallback(() => {
        setWindowStates((previousStates) => {
            let hasActiveWindow = false;

            for (const state of previousStates.values()) {
                if (isWindowOpen(state) && state.isActive) {
                    hasActiveWindow = true;
                    break;
                }
            }

            if (!hasActiveWindow) {
                return previousStates;
            }

            const nextStates = new Map(previousStates);

            deactivateOpenWindows(nextStates);

            return nextStates;
        });
    }, []);

    const registerLauncher = useCallback(
        (windowId: string, element: HTMLElement | null) => {
            if (element) {
                launcherElementsRef.current.set(windowId, element);

                return;
            }

            launcherElementsRef.current.delete(windowId);
        },
        [],
    );

    const getLauncherPosition = useCallback(
        (windowId: string): WindowPosition | undefined => {
            const element = launcherElementsRef.current.get(windowId);

            if (!element) {
                return undefined;
            }

            const rect = element.getBoundingClientRect();

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            return {
                x: centerX - MINIMIZED_WINDOW_SIZE / 2,
                y: centerY - MINIMIZED_WINDOW_SIZE / 2,
            };
        },
        [],
    );

    const createActions = useCallback(
        (windowId: string): WindowActions => ({
            open: () => openWindow(windowId),

            close: () => closeWindow(windowId),

            minimize: () => minimizeWindow(windowId),

            restore: () => restoreWindow(windowId),

            maximize: () => {
                setWindowStates((previousStates) => {
                    const currentState = previousStates.get(windowId);

                    if (!currentState || !isWindowOpen(currentState)) {
                        return previousStates;
                    }

                    const nextStates = new Map(previousStates);

                    nextStates.set(windowId, {
                        ...currentState,
                        isMaximized: true,
                    });

                    return nextStates;
                });
            },

            unmaximize: () => {
                setWindowStates((previousStates) => {
                    const currentState = previousStates.get(windowId);

                    if (!currentState || !isWindowOpen(currentState)) {
                        return previousStates;
                    }

                    const nextStates = new Map(previousStates);

                    nextStates.set(windowId, {
                        ...currentState,
                        isMaximized: false,
                    });

                    return nextStates;
                });
            },

            toggleMaximize: () => {
                setWindowStates((previousStates) => {
                    const currentState = previousStates.get(windowId);

                    if (!currentState || !isWindowOpen(currentState)) {
                        return previousStates;
                    }

                    const nextStates = new Map(previousStates);

                    nextStates.set(windowId, {
                        ...currentState,
                        isMaximized: !currentState.isMaximized,
                    });

                    return nextStates;
                });
            },

            focus: () => focusWindow(windowId),
        }),
        [closeWindow, focusWindow, minimizeWindow, openWindow, restoreWindow],
    );

    const windows = useMemo(() => {
        const instances = new Map<string, WindowInstance>();

        for (const config of configs) {
            const state = windowStates.get(config.id) ?? createClosedState();

            instances.set(config.id, {
                config,
                state,
                actions: createActions(config.id),
            });
        }

        return instances;
    }, [configs, createActions, windowStates]);

    const value = useMemo<WindowManagerContextValue>(
        () => ({
            windows,

            activateWindow,
            openWindow,
            closeWindow,
            minimizeWindow,
            restoreWindow,
            focusWindow,
            deactivateAll,

            registerLauncher,
            getLauncherPosition,
        }),
        [
            windows,
            activateWindow,
            openWindow,
            closeWindow,
            minimizeWindow,
            restoreWindow,
            focusWindow,
            deactivateAll,
            registerLauncher,
            getLauncherPosition,
        ],
    );

    return (
        <WindowManagerContext.Provider value={value}>
            {children}
        </WindowManagerContext.Provider>
    );
}

export function useWindowManager() {
    const context = useContext(WindowManagerContext);

    if (!context) {
        throw new Error(
            "useWindowManager must be used inside WindowManagerProvider.",
        );
    }

    return context;
}

export function useWindow(windowId: string) {
    const { windows } = useWindowManager();

    return windows.get(windowId);
}
