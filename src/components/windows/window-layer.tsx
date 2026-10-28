// window-layer.tsx: Render open windows and load their app content on demand.

"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

import { Welcome } from "@/components/apps/welcome/welcome";
import { AppContentBoundary, AppLoading } from "@/components/windows/app-content";
import { AppWindow } from "@/components/windows/app-window";
import { useWindowManager } from "@/components/windows/window-manager";
import { WINDOW_CONFIGS, WINDOW_IDS } from "@/config/windows";

const About = dynamic(
    () => import("@/components/apps/about/about").then((module) => module.About),
    { loading: AppLoading },
);
const Experience = dynamic(
    () =>
        import("@/components/apps/experience/experience").then(
            (module) => module.Experience,
        ),
    { loading: AppLoading },
);
const Notes = dynamic(
    () => import("@/components/apps/notes/notes").then((module) => module.Notes),
    { loading: AppLoading },
);
const Projects = dynamic(
    () =>
        import("@/components/apps/projects/projects").then((module) => module.Projects),
    { loading: AppLoading },
);
const Resume = dynamic(
    () => import("@/components/apps/resume/resume").then((module) => module.Resume),
    { loading: AppLoading },
);
const Terminal = dynamic(
    () =>
        import("@/components/apps/terminal/terminal").then((module) => module.Terminal),
    { loading: AppLoading },
);

/** Takes a window ID and returns its eager Welcome or lazy app element. */
function getWindowContent(windowId: string) {
    switch (windowId) {
        case "welcome":
            return <Welcome />;

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

/** Takes no props and returns the window layer, opening Welcome on mount. */
export function WindowLayer() {
    const { windows, openWindow, getLauncherPosition } = useWindowManager();

    useEffect(() => {
        openWindow(WINDOW_IDS.welcome);
    }, [openWindow]);

    return (
        <div className="pointer-events-none fixed inset-0 z-60 overflow-hidden">
            {WINDOW_CONFIGS.map((config, cascadeIndex) => {
                const instance = windows.get(config.id);

                if (!instance || instance.state.status === "closed") {
                    return null;
                }

                /** Takes no arguments and returns this window's launcher position. */
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
                        <AppContentBoundary>
                            {getWindowContent(config.id)}
                        </AppContentBoundary>
                    </AppWindow>
                );
            })}
        </div>
    );
}
