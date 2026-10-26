"use client";

// desktop-icons.tsx: desktop icon launchers for Projects, Experience, Resume and Terminal.

import { useCallback, useRef, type RefObject } from "react";

import { DesktopIcon } from "@/components/desktop/desktop-icon";
import { useWindowManager } from "@/components/windows/window-manager";
import { WINDOW_IDS, type WindowId } from "@/config/windows";

type DesktopApp = {
    readonly id: string;
    readonly windowId: WindowId;
    readonly label: string;
    readonly icon: string;
    readonly iconWidth: number;
    readonly iconHeight: number;

    readonly position: {
        readonly top: string;
        readonly left: string;
    };
};

const desktopApps = [
    {
        id: "projects",
        windowId: WINDOW_IDS.projects,
        label: "Projects",
        icon: "/icons/projects.svg",
        iconWidth: 64,
        iconHeight: 64,

        position: {
            top: "2%",
            left: "1%",
        },
    },
    {
        id: "experience",
        windowId: WINDOW_IDS.experience,
        label: "Experience",
        icon: "/icons/experience.svg",
        iconWidth: 64,
        iconHeight: 64,

        position: {
            top: "24%",
            left: "1%",
        },
    },
    {
        id: "resume",
        windowId: WINDOW_IDS.resume,
        label: "Resume",
        icon: "/icons/resume.svg",
        iconWidth: 64,
        iconHeight: 64,

        position: {
            top: "46%",
            left: "1%",
        },
    },
    {
        id: "terminal",
        windowId: WINDOW_IDS.terminal,
        label: "Terminal",
        icon: "/icons/terminal.webp",
        iconWidth: 64,
        iconHeight: 64,

        position: {
            top: "68%",
            left: "1%",
        },
    },
] as const satisfies readonly DesktopApp[];

type DesktopAppIconProps = {
    app: DesktopApp;
    dragBoundsRef: RefObject<HTMLDivElement | null>;
};

/**
 * Renders one draggable desktop icon that opens its app window.
 * Takes the app definition and the drag bounds ref; returns the icon element.
 */
function DesktopAppIcon({ app, dragBoundsRef }: DesktopAppIconProps) {
    const { activateWindow, registerLauncher } = useWindowManager();

    const setLauncherRef = useCallback(
        (element: HTMLDivElement | null) => {
            registerLauncher(app.windowId, element);
        },
        [app.windowId, registerLauncher],
    );

    const handleOpen = useCallback(() => {
        activateWindow(app.windowId);
    }, [activateWindow, app.windowId]);

    return (
        <DesktopIcon
            label={app.label}
            icon={app.icon}
            iconWidth={app.iconWidth}
            iconHeight={app.iconHeight}
            position={app.position}
            dragConstraints={dragBoundsRef}
            launcherRef={setLauncherRef}
            onOpen={handleOpen}
            className="pointer-events-auto"
        />
    );
}

/**
 * Renders the column of desktop icons inside their shared drag area.
 * Takes no props; returns the icon layer element.
 */
export function DesktopIcons() {
    const dragBoundsRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={dragBoundsRef}
            className="pointer-events-none absolute inset-x-0 bottom-28 top-20 z-10 overflow-hidden"
        >
            {desktopApps.map((app) => (
                <DesktopAppIcon
                    key={app.id}
                    app={app}
                    dragBoundsRef={dragBoundsRef}
                />
            ))}
        </div>
    );
}
