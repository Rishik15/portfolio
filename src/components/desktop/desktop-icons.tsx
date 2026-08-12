"use client";

import { useRef } from "react";

import { DesktopIcon } from "@/components/desktop/desktop-icon";

const desktopApps = [
    {
        id: "Terminal",
        label: "Terminal",
        icon: "/icons/terminal.webp",
        iconWidth: 72,
        iconHeight: 72,
        position: {
            top: "40%",
            left: "2%",
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
