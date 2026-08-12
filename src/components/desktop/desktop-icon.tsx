"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { KeyboardEvent, Ref, RefObject } from "react";

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
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (!onOpen) {
            return;
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen();
        }
    };

    return (
        <motion.div
            ref={launcherRef}
            drag
            dragConstraints={dragConstraints}
            dragElastic={0}
            dragMomentum={false}
            onTap={() => onOpen?.()}
            onKeyDown={handleKeyDown}
            role={onOpen ? "button" : undefined}
            tabIndex={onOpen ? 0 : undefined}
            aria-label={onOpen ? `Open ${label}` : undefined}
            style={{
                top: position.top,
                left: position.left,
            }}
            className={cn(
                "group absolute z-10 flex w-30 select-none flex-col items-center outline-none",
                className,
            )}
        >
            <div
                className={cn(
                    "flex h-fit w-fit flex-col items-center justify-center rounded-[18px]",
                    "transition-[background-color,box-shadow,transform] duration-150 ease-out",
                    "group-hover:scale-[1.02]",
                )}
            >
                <Image
                    src={icon}
                    alt=""
                    width={iconWidth}
                    height={iconHeight}
                    draggable={false}
                    sizes={`${iconWidth}px`}
                    className="pointer-events-none block shrink-0 object-contain drop-shadow-[0_5px_6px_rgba(0,0,0,0.16)]"
                    style={{
                        width: iconWidth,
                        height: iconHeight,
                    }}
                />
            </div>

            <span
                style={{
                    fontFamily: "var(--font-inter)",
                }}
                className={cn(
                    "whitespace-nowrap text-center",
                    "text-[14px] font-bold leading-[22.4px] tracking-[-0.6px]",
                    "text-black",
                    "[text-shadow:0_1px_2px_rgba(255,255,255,0.65),0_1px_3px_rgba(0,0,0,0.12)]",
                    "dark:text-[#f7f7f7]",
                    "dark:[text-shadow:0_1px_3px_rgba(0,0,0,0.75)]",
                )}
            >
                {label}
            </span>
        </motion.div>
    );
}
