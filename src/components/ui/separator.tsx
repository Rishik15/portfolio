import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SeparatorOrientation = "horizontal" | "vertical";

type SeparatorVariant = "default" | "secondary" | "tertiary";

interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
    orientation?: SeparatorOrientation;
    variant?: SeparatorVariant;
}

const orientationClasses: Record<SeparatorOrientation, string> = {
    horizontal: "h-px w-full",
    vertical: "h-full w-px",
};

const variantClasses: Record<SeparatorVariant, string> = {
    default: "bg-black/40 dark:bg-white/40",
    secondary: "bg-black/25 dark:bg-white/25",
    tertiary: "bg-black/15 dark:bg-white/15",
};

const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
    (
        {
            orientation = "horizontal",
            variant = "default",
            className,
            ...props
        },
        ref,
    ) => {
        return (
            <div
                ref={ref}
                role="separator"
                aria-orientation={orientation}
                data-orientation={orientation}
                className={cn(
                    "shrink-0",
                    orientationClasses[orientation],
                    variantClasses[variant],
                    className,
                )}
                {...props}
            />
        );
    },
);

Separator.displayName = "Separator";

export { Separator };
