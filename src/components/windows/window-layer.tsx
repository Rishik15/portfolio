"use client";

import { Terminal } from "@/components/apps/terminal/terminal";
import { AppWindow } from "@/components/windows/app-window";
import { useWindowManager } from "@/components/windows/window-manager";
import { WINDOW_CONFIGS } from "@/config/windows";

function getWindowContent(windowId: string) {
    switch (windowId) {
        case "terminal":
            return <Terminal />;
        default:
            return null;
    }
}

export function WindowLayer() {
    const { windows, getLauncherPosition } = useWindowManager();

    return (
        <div className="pointer-events-none fixed inset-0 z-60 overflow-hidden">
            {WINDOW_CONFIGS.map((config, cascadeIndex) => {
                const instance = windows.get(config.id);

                if (!instance || instance.state.status === "closed") {
                    return null;
                }

                const getIconPosition = () => getLauncherPosition(config.id);

                return (
                    <AppWindow
                        key={config.id}
                        config={instance.config}
                        state={instance.state}
                        actions={instance.actions}
                        cascadeIndex={cascadeIndex}
                        iconPosition={getIconPosition()}
                        getIconPosition={getIconPosition}
                    >
                        {getWindowContent(config.id)}
                    </AppWindow>
                );
            })}
        </div>
    );
}
