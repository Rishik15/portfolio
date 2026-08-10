"use client";

import {
    createContext,
    useContext,
    type CSSProperties,
    type HTMLAttributes,
    type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

type TooltipContextValue = {
    placement: TooltipPlacement;
};

const TooltipContext = createContext<TooltipContextValue>({
    placement: "top",
});

type TooltipProps = {
    children: ReactNode;
    delay?: number;
    className?: string;
};

function Tooltip({ children, delay = 0, className }: TooltipProps) {
    const style = {
        "--tooltip-delay": `${delay}ms`,
    } as CSSProperties;

    return (
        <span
            style={style}
            className={cn("group/tooltip relative inline-flex", className)}
        >
            {children}
        </span>
    );
}

type TooltipTriggerProps = {
    children: ReactNode;
};

function TooltipTrigger({ children }: TooltipTriggerProps) {
    return <>{children}</>;
}

type TooltipContentProps = HTMLAttributes<HTMLSpanElement> & {
    children: ReactNode;
    placement?: TooltipPlacement;
    offset?: number;
    showArrow?: boolean;
};

const placementClasses: Record<TooltipPlacement, string> = {
    top: [
        "bottom-full left-1/2",
        "-translate-x-1/2 translate-y-1",
        "group-hover/tooltip:translate-y-0",
        "group-focus-within/tooltip:translate-y-0",
    ].join(" "),

    bottom: [
        "top-full left-1/2",
        "-translate-x-1/2 -translate-y-1",
        "group-hover/tooltip:translate-y-0",
        "group-focus-within/tooltip:translate-y-0",
    ].join(" "),

    left: [
        "right-full top-1/2",
        "-translate-y-1/2 translate-x-1",
        "group-hover/tooltip:translate-x-0",
        "group-focus-within/tooltip:translate-x-0",
    ].join(" "),

    right: [
        "left-full top-1/2",
        "-translate-y-1/2 -translate-x-1",
        "group-hover/tooltip:translate-x-0",
        "group-focus-within/tooltip:translate-x-0",
    ].join(" "),
};

const offsetClasses: Record<TooltipPlacement, string> = {
    top: "mb-[var(--tooltip-offset)]",
    bottom: "mt-[var(--tooltip-offset)]",
    left: "mr-[var(--tooltip-offset)]",
    right: "ml-[var(--tooltip-offset)]",
};

function TooltipContent({
    children,
    placement = "top",
    offset = 10,
    showArrow = false,
    className,
    style,
    ...props
}: TooltipContentProps) {
    const tooltipStyle = {
        "--tooltip-offset": `${offset}px`,
        fontFamily: "var(--font-inter)",
        ...style,
    } as CSSProperties;

    return (
        <TooltipContext.Provider value={{ placement }}>
            <span
                role="tooltip"
                data-placement={placement}
                style={tooltipStyle}
                className={cn(
                    "pointer-events-none absolute z-[100] whitespace-nowrap",

                    "rounded-[13px]",
                    "border border-black/[0.08]",
                    "bg-white",
                    "px-[15px] py-[9px]",

                    "text-[13px]",
                    "font-medium",
                    "leading-none",
                    "tracking-[-0.018em]",
                    "text-black/80",
                    "antialiased",

                    "shadow-[0_6px_22px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.05)]",

                    "invisible scale-[0.98] opacity-0",

                    "transform-gpu",
                    "will-change-[opacity,transform]",

                    "transition-[opacity,transform,visibility]",
                    "duration-150",
                    "ease-out",

                    "[transition-delay:0ms]",

                    "group-hover/tooltip:visible",
                    "group-hover/tooltip:scale-100",
                    "group-hover/tooltip:opacity-100",
                    "group-hover/tooltip:[transition-delay:var(--tooltip-delay)]",

                    "group-focus-within/tooltip:visible",
                    "group-focus-within/tooltip:scale-100",
                    "group-focus-within/tooltip:opacity-100",
                    "group-focus-within/tooltip:[transition-delay:var(--tooltip-delay)]",

                    "motion-reduce:transition-none",

                    placementClasses[placement],
                    offsetClasses[placement],

                    className,
                )}
                {...props}
            >
                {children}

                {showArrow && <TooltipArrow />}
            </span>
        </TooltipContext.Provider>
    );
}

const arrowPlacementClasses: Record<TooltipPlacement, string> = {
    top: "-bottom-[5px] left-1/2 -translate-x-1/2",
    bottom: "-top-[5px] left-1/2 -translate-x-1/2",
    left: "-right-[5px] top-1/2 -translate-y-1/2",
    right: "-left-[5px] top-1/2 -translate-y-1/2",
};

function TooltipArrow() {
    const { placement } = useContext(TooltipContext);

    return (
        <span
            aria-hidden="true"
            className={cn(
                "absolute size-[10px]",
                "rotate-45",
                "rounded-[2px]",
                "bg-white",
                arrowPlacementClasses[placement],
            )}
        />
    );
}

Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;
Tooltip.Arrow = TooltipArrow;

export { Tooltip };
