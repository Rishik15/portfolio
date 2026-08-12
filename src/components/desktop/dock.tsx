"use client";

import { Dock as MagicDock, DockIcon } from "@/components/ui/dock";
import { Separator } from "@/components/ui/separator";
import { DockItem } from "@/components/desktop/dock-item";
import { APP_DOCK_ITEMS, CONTACT_DOCK_ITEMS } from "@/config/dock";

export function Dock() {
    return (
        <div
            className="
                pointer-events-none
                fixed
                inset-x-0
                bottom-8
                z-50
                flex
                justify-center
                px-4
                ml-2
            "
        >
            <MagicDock
                iconSize={54}
                iconMagnification={72}
                iconDistance={130}
                direction="middle"
                className="
                    pointer-events-auto
                    h-19
                    gap-2.5
                    rounded-[24px]
                    px-3
                    py-2.5

                    border!
                    border-white/10!
                    bg-white/10!
                    backdrop-blur-[5px]!
                    shadow-none!
                "
            >
                {APP_DOCK_ITEMS.map((item) => (
                    <DockIcon key={item.id} className="rounded-[15px]">
                        <DockItem item={item} />
                    </DockIcon>
                ))}

                <Separator
                    orientation="vertical"
                    variant="secondary"
                    className="
                        mx-0.75
                        h-11
                        w-[1.5px]
                        shrink-0
                        self-center
                        bg-black
                        dark:bg-white/90
                    "
                />

                {CONTACT_DOCK_ITEMS.map((item) => (
                    <DockIcon key={item.id} className="rounded-[15px]">
                        <DockItem item={item} />
                    </DockIcon>
                ))}
            </MagicDock>
        </div>
    );
}
