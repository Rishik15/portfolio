"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { RefObject } from "react";

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
};

export function DesktopIcon({
    label,
    icon,
    position,
    dragConstraints,
    className,
    iconWidth = 88,
    iconHeight = 88,
}: DesktopIconProps) {
    return (
        <motion.div
            drag
            dragConstraints={dragConstraints}
            dragElastic={0}
            dragMomentum={false}
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
                    "inline-flex h-fit w-fit items-center justify-center rounded-[18px] p-1",
                    "transition-[background-color,box-shadow,transform] duration-150 ease-out",
                    "group-hover:scale-[1.01]",
                    "group-hover:bg-black/15",
                    "group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12),0_2px_8px_rgba(0,0,0,0.08)]",
                    "dark:group-hover:bg-white/12",
                    "dark:group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10),0_2px_8px_rgba(0,0,0,0.20)]",
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
                    "mt-1 whitespace-nowrap text-center",
                    "text-[14px] font-normal leading-[22.4px] tracking-[-0.6px]",
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
