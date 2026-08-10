"use client";

import React, { useRef, type PropsWithChildren } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
    motion,
    type MotionProps,
    type MotionValue,
    useMotionValue,
    useSpring,
    useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

export interface DockProps extends VariantProps<typeof dockVariants> {
    className?: string;
    iconSize?: number;
    iconMagnification?: number;
    disableMagnification?: boolean;
    iconDistance?: number;
    direction?: "top" | "middle" | "bottom";
    children: React.ReactNode;
}

const DEFAULT_SIZE = 40;
const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;
const DEFAULT_DISABLE_MAGNIFICATION = false;

const dockVariants = cva(
    "supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 mx-auto flex w-max items-center justify-center gap-2 rounded-2xl border backdrop-blur-md",
);

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
    (
        {
            className,
            children,
            iconSize = DEFAULT_SIZE,
            iconMagnification = DEFAULT_MAGNIFICATION,
            disableMagnification = DEFAULT_DISABLE_MAGNIFICATION,
            iconDistance = DEFAULT_DISTANCE,
            direction = "middle",
            ...props
        },
        ref,
    ) => {
        const mouseX = useMotionValue(Infinity);

        const renderChildren = () => {
            return React.Children.map(children, (child) => {
                if (
                    React.isValidElement<DockIconProps>(child) &&
                    child.type === DockIcon
                ) {
                    return React.cloneElement(child, {
                        ...child.props,
                        mouseX,
                        size: iconSize,
                        magnification: iconMagnification,
                        disableMagnification,
                        distance: iconDistance,
                    });
                }

                return child;
            });
        };

        return (
            <motion.div
                ref={ref}
                onMouseMove={(event) => mouseX.set(event.pageX)}
                onMouseLeave={() => mouseX.set(Infinity)}
                {...props}
                className={cn(
                    dockVariants(),
                    {
                        "items-start": direction === "top",
                        "items-center": direction === "middle",
                        "items-end": direction === "bottom",
                    },
                    className,
                )}
            >
                {renderChildren()}
            </motion.div>
        );
    },
);

Dock.displayName = "Dock";

export interface DockIconProps extends Omit<
    MotionProps & React.HTMLAttributes<HTMLDivElement>,
    "children"
> {
    size?: number;
    magnification?: number;
    disableMagnification?: boolean;
    distance?: number;
    mouseX?: MotionValue<number>;
    className?: string;
    children?: React.ReactNode;
    props?: PropsWithChildren;
}

const DockIcon = ({
    size = DEFAULT_SIZE,
    magnification = DEFAULT_MAGNIFICATION,
    disableMagnification = DEFAULT_DISABLE_MAGNIFICATION,
    distance = DEFAULT_DISTANCE,
    mouseX,
    className,
    children,
    ...props
}: DockIconProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const defaultMouseX = useMotionValue(Infinity);

    const padding = Math.max(4, size * 0.1);

    const distanceCalc = useTransform(
        mouseX ?? defaultMouseX,
        (value: number) => {
            const bounds = ref.current?.getBoundingClientRect() ?? {
                x: 0,
                width: 0,
            };

            return value - bounds.x - bounds.width / 2;
        },
    );

    const targetSize = disableMagnification ? size : magnification;

    const sizeTransform = useTransform(
        distanceCalc,
        [-distance, 0, distance],
        [size, targetSize, size],
    );

    const scaleSize = useSpring(sizeTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    return (
        <motion.div
            ref={ref}
            style={{
                width: scaleSize,
                height: scaleSize,
                padding,
            }}
            className={cn(
                "flex aspect-square shrink-0 cursor-pointer items-center justify-center rounded-full",
                disableMagnification &&
                    "transition-colors hover:bg-muted-foreground",
                className,
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

DockIcon.displayName = "DockIcon";

export { Dock, DockIcon, dockVariants };
