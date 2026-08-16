"use client";

import { useEffect } from "react";

import { About } from "@/components/apps/about/about";
import { Experience } from "@/components/apps/experience/experience";
import { preloadNotesLibrary } from "@/components/apps/notes/notes-cache";
import { Notes } from "@/components/apps/notes/notes";
import { Projects } from "@/components/apps/projects/projects";
import { Resume } from "@/components/apps/resume/resume";
import { Terminal } from "@/components/apps/terminal/terminal";
import { AppWindow } from "@/components/windows/app-window";
import { useWindowManager } from "@/components/windows/window-manager";
import { WINDOW_CONFIGS, WINDOW_IDS } from "@/config/windows";

const NOTES_PRELOAD_DELAY = 700;

function getWindowContent(windowId: string) {
    switch (windowId) {
        case "terminal":
            return <Terminal />;

        case "about":
            return <About />;

        case "notes":
            return <Notes />;

        case "resume":
            return <Resume />;

        case "projects":
            return <Projects />;

        case "experience":
            return <Experience />;

        default:
            return null;
    }
}

export function WindowLayer() {
    const { windows, openWindow, getLauncherPosition } = useWindowManager();

    useEffect(() => {
        openWindow(WINDOW_IDS.terminal);

        const timeout = window.setTimeout(
            preloadNotesLibrary,
            NOTES_PRELOAD_DELAY,
        );

        return () => {
            window.clearTimeout(timeout);
        };
    }, [openWindow]);

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
