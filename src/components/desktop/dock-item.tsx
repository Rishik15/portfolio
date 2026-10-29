"use client";

import Image from "next/image";
import { memo, useCallback } from "react";

import { Tooltip } from "@/components/ui/tooltip";
import { useWindowManager } from "@/components/windows/window-manager";
import type { DockItemConfig } from "@/config/dock";

type DockItemProps = {
    item: DockItemConfig;
};

function DockItemComponent({ item }: DockItemProps) {
    const { activateWindow, registerLauncher } = useWindowManager();

    const setLauncherRef = useCallback(
        (element: HTMLButtonElement | null) => {
            if (item.type !== "window") {
                return;
            }

            registerLauncher(item.windowId, element);
        },
        [item, registerLauncher],
    );

    const handleWindowClick = useCallback(() => {
        if (item.type !== "window") {
            return;
        }

        activateWindow(item.windowId);
    }, [activateWindow, item]);

    const icon = (
        <Image
            src={item.icon}
            alt=""
            width={56}
            height={56}
            sizes="56px"
            loading="eager"
            draggable={false}
            className="
                size-14
                shrink-0
                select-none
                object-contain
                transform-[translateZ(0)]
            "
        />
    );

    let trigger;

    if (item.type === "window") {
        trigger = (
            <button
                ref={setLauncherRef}
                type="button"
                onClick={handleWindowClick}
                aria-label={`Open ${item.label}`}
                className="
                    flex
                    size-14
                    shrink-0
                    cursor-pointer
                    items-center
                    justify-center
                    border-0
                    bg-transparent
                    p-0
                    outline-none
                "
            >
                {icon}
            </button>
        );
    } else if (item.type === "email") {
        const composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
            item.email,
        )}`;

        trigger = (
            <a
                href={composeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Email ${item.email}`}
                className="
                    flex
                    size-14
                    shrink-0
                    cursor-pointer
                    items-center
                    justify-center
                    outline-none
                "
            >
                {icon}
            </a>
        );
    } else {
        trigger = (
            <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${item.label} in a new tab`}
                className="
                    flex
                    size-14
                    shrink-0
                    cursor-pointer
                    items-center
                    justify-center
                    outline-none
                "
            >
                {icon}
            </a>
        );
    }

    return (
        <Tooltip>
            <Tooltip.Trigger>{trigger}</Tooltip.Trigger>

            <Tooltip.Content placement="top" offset={13} showArrow>
                {item.label}
            </Tooltip.Content>
        </Tooltip>
    );
}

export const DockItem = memo(DockItemComponent);
