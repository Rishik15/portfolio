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
    onOpenAction?: () => void;
    className?: string;
};

export function DesktopIcon({
    label,
    icon,
    position,
    dragConstraints,
    onOpenAction,
    className,
}: DesktopIconProps) {
    return (
        <motion.div
            drag
            dragConstraints={dragConstraints}
            dragElastic={0}
            dragMomentum={false}
            whileDrag={{ scale: 1.025 }}
            onDoubleClick={onOpenAction}
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                    onOpenAction?.();
                }
            }}
            tabIndex={0}
            role="button"
            aria-label={`Open ${label}`}
            style={{
                top: position.top,
                left: position.left,
            }}
            className={cn(
                "group absolute z-10 flex w-[104px] select-none flex-col items-center",
                "outline-none",
                className,
            )}
        >
            <div
                className={cn(
                    "flex size-[78px] items-center justify-center rounded-[18px]",
                    "border border-transparent",
                    "transition-[background-color,border-color,box-shadow,backdrop-filter,transform]",
                    "duration-150 ease-out",

                    "group-hover:scale-[1.02]",
                    "group-hover:border-black/[0.07]",
                    "group-hover:bg-black/[0.045]",
                    "group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_5px_18px_rgba(0,0,0,0.06)]",
                    "group-hover:backdrop-blur-[6px]",

                    "dark:group-hover:border-white/[0.10]",
                    "dark:group-hover:bg-white/[0.075]",
                    "dark:group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_5px_18px_rgba(0,0,0,0.18)]",
                )}
            >
                <Image
                    src={icon}
                    alt=""
                    width={64}
                    height={64}
                    draggable={false}
                    sizes="64px"
                    className="pointer-events-none size-16 object-contain"
                />
            </div>

            <span
                className={cn(
                    "mt-1.5 max-w-[104px] truncate rounded-md px-1.5 py-0.5",
                    "text-center font-sans text-[13px] font-medium leading-tight",
                    "text-black/80 dark:text-white/90",
                    "dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]",
                )}
            >
                {label}
            </span>
        </motion.div>
    );
}
