"use client";

import { AppWindow } from "@/components/windows/app-window";
import { useWindowManager } from "@/components/windows/window-manager";
import { WINDOW_CONFIGS } from "@/config/windows";

export function WindowLayer() {
    const { windows, getLauncherPosition } = useWindowManager();

    return (
        <div
            className="
                pointer-events-none
                fixed
                inset-0
                z-[60]
                overflow-hidden
            "
        >
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
                    />
                );
            })}
        </div>
    );
}
