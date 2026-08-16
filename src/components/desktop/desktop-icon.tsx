"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useRef, type KeyboardEvent, type Ref, type RefObject } from "react";

import { DESKTOP_ICON_UI } from "@/components/desktop/desktop-icon-ui";
import { cn } from "@/lib/utils";

type DesktopIconProps = {
    label: string;
    icon: string;

    position: {
        top: string;
        left: string;
    };

    dragConstraints: RefObject<HTMLDivElement | null>;

    className?: string;

    iconWidth?: number;
    iconHeight?: number;

    launcherRef?: Ref<HTMLDivElement>;
    onOpen?: () => void;
};

const DRAG_TAP_BLOCK_MS = 100;

export function DesktopIcon({
    label,
    icon,
    position,
    dragConstraints,
    className,
    iconWidth = 64,
    iconHeight = 64,
    launcherRef,
    onOpen,
}: DesktopIconProps) {
    const isDraggingRef = useRef(false);
    const lastDragEndRef = useRef(0);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (!onOpen) {
            return;
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen();
        }
    };

    const handleDragStart = () => {
        isDraggingRef.current = true;
    };

    const handleDragEnd = () => {
        isDraggingRef.current = false;
        lastDragEndRef.current = performance.now();
    };

    const handleTap = () => {
        if (!onOpen || isDraggingRef.current) {
            return;
        }

        const timeSinceDragEnd = performance.now() - lastDragEndRef.current;

        if (timeSinceDragEnd < DRAG_TAP_BLOCK_MS) {
            return;
        }

        onOpen();
    };

    return (
        <motion.div
            ref={launcherRef}
            drag
            dragConstraints={dragConstraints}
            dragElastic={0}
            dragMomentum={false}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTap={handleTap}
            onKeyDown={handleKeyDown}
            role={onOpen ? "button" : undefined}
            tabIndex={onOpen ? 0 : undefined}
            aria-label={onOpen ? `Open ${label}` : undefined}
            style={{
                top: position.top,
                left: position.left,
            }}
            className={cn(DESKTOP_ICON_UI.root, className)}
        >
            <div className={DESKTOP_ICON_UI.responsiveScale}>
                <div className={DESKTOP_ICON_UI.iconSurface}>
                    <Image
                        src={icon}
                        alt=""
                        width={iconWidth}
                        height={iconHeight}
                        loading="eager"
                        draggable={false}
                        sizes={`${iconWidth}px`}
                        className={DESKTOP_ICON_UI.image}
                        style={{
                            width: iconWidth,
                            height: iconHeight,
                        }}
                    />
                </div>
            </div>

            <span
                style={{
                    fontFamily: "var(--font-inter)",
                }}
                className={DESKTOP_ICON_UI.label}
            >
                {label}
            </span>
        </motion.div>
    );
}
