"use client";

import { useRef } from "react";

import { DesktopIcon } from "@/components/desktop/desktop-icon";

const desktopApps = [
    {
        id: "experience",
        label: "Experience",
        icon: "/icons/work.webp",

        iconWidth: 80,
        iconHeight: 72,

        position: {
            top: "19%",
            left: "15.5%",
        },
    },
    {
        id: "projects",
        label: "Projects",
        icon: "/icons/terminal.webp",
        iconWidth: 80,
        iconHeight: 80,
        position: {
            top: "27%",
            left: "76.5%",
        },
    },
    {
        id: "certificates",
        label: "Certificates",
        icon: "/icons/certificates.webp",
        iconWidth: 80,
        iconHeight: 80,
        position: {
            top: "47%",
            left: "41.5%",
        },
    },
    {
        id: "playground",
        label: "Playground",
        icon: "/icons/playground.webp",
        iconWidth: 80,
        iconHeight: 80,
        position: {
            top: "58%",
            left: "18.5%",
        },
    },
    {
        id: "skills",
        label: "Skills",
        icon: "/icons/skills.webp",
        iconWidth: 80,
        iconHeight: 80,
        position: {
            top: "56%",
            left: "69%",
        },
    },
] as const;

export function DesktopIcons() {
    const dragBoundsRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={dragBoundsRef}
            className="pointer-events-none absolute inset-x-0 bottom-28 top-20 z-10 overflow-hidden"
        >
            {desktopApps.map((app) => (
                <DesktopIcon
                    key={app.id}
                    label={app.label}
                    icon={app.icon}
                    iconWidth={app.iconWidth}
                    iconHeight={app.iconHeight}
                    position={app.position}
                    dragConstraints={dragBoundsRef}
                    className="pointer-events-auto"
                />
            ))}
        </div>
    );
}
