"use client";

import { useRef } from "react";

import { DesktopIcon } from "@/components/desktop/desktop-icon";

const desktopApps = [
    {
        id: "playground",
        label: "Playground",
        icon: "/icons/playground.webp",
        position: {
            top: "22%",
            left: "20%",
        },
    },
    {
        id: "certificates",
        label: "Certificates",
        icon: "/icons/certificates.webp",
        position: {
            top: "14%",
            left: "65%",
        },
    },
    {
        id: "projects",
        label: "Projects",
        icon: "/icons/terminal.webp",
        position: {
            top: "35%",
            left: "47%",
        },
    },
    {
        id: "experience",
        label: "Experience",
        icon: "/icons/experiences.webp",
        position: {
            top: "61%",
            left: "17%",
        },
    },
    {
        id: "skills",
        label: "Skills",
        icon: "/icons/skills.webp",
        position: {
            top: "61%",
            left: "67%",
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
                    position={app.position}
                    dragConstraints={dragBoundsRef}
                    className="pointer-events-auto"
                />
            ))}
        </div>
    );
}
