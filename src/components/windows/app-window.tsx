import type { ReactNode } from "react";

import {
    type AppWindowConfig,
    type WindowActions,
    type WindowPosition,
    type WindowState,
} from "@/components/windows/window-manager";
import {
    type ResizeDirection,
    useWindowFrame,
} from "@/components/windows/use-window-frame";

type AppWindowProps = {
    config: AppWindowConfig;
    state: WindowState;
    actions: WindowActions;
    cascadeIndex: number;
    children?: ReactNode;
    iconPosition?: WindowPosition;

    getIconPosition?: () => WindowPosition | undefined;
};

const RESIZE_HANDLES: {
    direction: Exclude<ResizeDirection, null>;
    className: string;
}[] = [
    {
        direction: "top-left",
        className: "absolute left-0 top-0 h-3 w-3 cursor-nwse-resize",
    },
    {
        direction: "top-right",
        className: "absolute right-0 top-0 h-3 w-3 cursor-nesw-resize",
    },
    {
        direction: "bottom-left",
        className: "absolute bottom-0 left-0 h-3 w-3 cursor-nesw-resize",
    },
    {
        direction: "bottom-right",
        className: "absolute bottom-0 right-0 h-3 w-3 cursor-nwse-resize",
    },
    {
        direction: "top",
        className: "absolute left-3 right-3 top-0 h-1 cursor-ns-resize",
    },
    {
        direction: "bottom",
        className: "absolute bottom-0 left-3 right-3 h-1 cursor-ns-resize",
    },
    {
        direction: "left",
        className: "absolute bottom-3 left-0 top-3 w-1 cursor-ew-resize",
    },
    {
        direction: "right",
        className: "absolute bottom-3 right-0 top-3 w-1 cursor-ew-resize",
    },
];

export function AppWindow({
    config,
    state,
    actions,
    cascadeIndex,
    children,
    iconPosition,
    getIconPosition,
}: AppWindowProps) {
    const frame = useWindowFrame({
        config,
        state,
        actions,
        cascadeIndex,
        iconPosition,
        getIconPosition,
    });

    if (!frame.shouldRender) {
        return null;
    }

    return (
        <>
            {frame.snapZone && frame.snapPreviewStyle && (
                <div
                    className="
                        pointer-events-none
                        fixed
                        z-100
                        rounded-xl
                        border
                        border-black/15
                        bg-white/35
                        dark:border-white/20
                        dark:bg-black/35
                        transition-all
                        duration-150
                    "
                    style={frame.snapPreviewStyle}
                />
            )}

            <section
                aria-label={`${config.title} window`}
                onMouseDown={frame.handleWindowMouseDown}
                className={`
                    absolute
                    ${
                        frame.isTransitioning
                            ? frame.isClosing
                                ? "transition-[transform,width,height,opacity] duration-[450ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                                : frame.isOpening
                                  ? "transition-[transform,width,height,opacity] duration-300 ease-out"
                                  : "transition-[transform,width,height,opacity] duration-200"
                            : ""
                    }
                    ${frame.isMaximized ? "" : "rounded-2xl"}
                `}
                style={{
                    transform: `translate3d(${frame.position.x}px, ${frame.position.y}px, 0) scale(${frame.scale})`,
                    transformOrigin: "center center",

                    width: frame.size.width,

                    height: frame.size.height,

                    opacity: frame.opacity,

                    zIndex: frame.isActive
                        ? 50 + frame.zIndex
                        : 40 + frame.zIndex,

                    pointerEvents: frame.isMinimized ? "none" : "auto",
                }}
            >
                <div
                    className={`
                        relative
                        h-full
                        w-full
                        overflow-hidden

                        border
                        border-black/15
                        bg-white/96

                        shadow-[0_24px_60px_-16px_rgba(0,0,0,0.38),0_8px_24px_-12px_rgba(0,0,0,0.28)]

                        dark:border-white/15
                        dark:bg-black/99
                        dark:shadow-[0_24px_60px_-16px_rgba(0,0,0,0.75),0_8px_24px_-12px_rgba(0,0,0,0.6)]

                        ${frame.isMaximized ? "" : "rounded-2xl"}
                    `}
                >
                    {!frame.hideTitleBar && (
                        <div
                            onMouseDown={frame.handleDragMouseDown}
                            onDoubleClick={frame.handleTitleBarDoubleClick}
                            className={`
                                flex
                                h-12
                                cursor-move
                                select-none
                                items-center
                                border-b
                                px-4

                                border-black/10
                                bg-white/72

                                dark:border-white/10
                                dark:bg-white/6

                                ${frame.isMaximized ? "" : "rounded-t-2xl"}
                            `}
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                                onMouseDown={(event) => {
                                    event.stopPropagation();
                                }}
                            >
                                <button
                                    type="button"
                                    aria-label={`Close ${config.title}`}
                                    onClick={frame.handleClose}
                                    className={`
                                        size-3
                                        rounded-full
                                        transition-colors
                                        ${
                                            frame.isActive
                                                ? "bg-[#ff5f57] hover:bg-[#ff4b42]"
                                                : "bg-zinc-400 dark:bg-zinc-600"
                                        }
                                    `}
                                />

                                <button
                                    type="button"
                                    aria-label={`Minimize ${config.title}`}
                                    disabled={!frame.canMinimize}
                                    onClick={
                                        frame.canMinimize
                                            ? frame.handleMinimize
                                            : undefined
                                    }
                                    className={`
                                        size-3
                                        rounded-full
                                        transition-colors
                                        ${
                                            !frame.canMinimize
                                                ? "cursor-not-allowed bg-zinc-400 dark:bg-zinc-600"
                                                : frame.isActive
                                                  ? "bg-[#febc2e] hover:bg-[#e9a91f]"
                                                  : "bg-zinc-400 dark:bg-zinc-600"
                                        }
                                    `}
                                />

                                <button
                                    type="button"
                                    aria-label={`Maximize ${config.title}`}
                                    disabled={!frame.canMaximize}
                                    onClick={
                                        frame.canMaximize
                                            ? frame.handleMaximize
                                            : undefined
                                    }
                                    className={`
                                        size-3
                                        rounded-full
                                        transition-colors
                                        ${
                                            !frame.canMaximize
                                                ? "cursor-not-allowed bg-zinc-400 dark:bg-zinc-600"
                                                : frame.isActive
                                                  ? "bg-[#28c840] hover:bg-[#1fb735]"
                                                  : "bg-zinc-400 dark:bg-zinc-600"
                                        }
                                    `}
                                />
                            </div>

                            <div
                                className="
                                    ml-3
                                    flex
                                    min-w-0
                                    items-center
                                    gap-2
                                    text-sm
                                    font-medium
                                    text-black/80
                                    dark:text-white/80
                                "
                            >
                                {config.icon && (
                                    <span
                                        className={`
                                            shrink-0
                                            ${
                                                frame.isActive
                                                    ? ""
                                                    : "opacity-50 grayscale"
                                            }
                                        `}
                                    >
                                        {config.icon}
                                    </span>
                                )}

                                <span className="truncate">{config.title}</span>
                            </div>
                        </div>
                    )}

                    <div
                        className={`
                            relative
                            overflow-auto
                            ${
                                frame.hideTitleBar
                                    ? "h-full"
                                    : "h-[calc(100%-3rem)]"
                            }
                        `}
                    >
                        {children}

                        {!frame.isActive && (
                            <div
                                className="
                                    absolute
                                    inset-0
                                    z-10
                                "
                                onMouseDown={frame.handleWindowMouseDown}
                            />
                        )}
                    </div>
                </div>

                {frame.canResize &&
                    !frame.isMaximized &&
                    RESIZE_HANDLES.map(({ direction, className }) => (
                        <div
                            key={direction}
                            className={className}
                            onMouseDown={(event) => {
                                frame.handleResizeMouseDown(event, direction);
                            }}
                        />
                    ))}
            </section>
        </>
    );
}
