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
        bottom-16
        z-50
        flex
        justify-center
        px-4
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
          border-black/10
          bg-white/35
          px-3
          py-2.5
          shadow-[0_8px_28px_rgba(0,0,0,0.08)]
          backdrop-blur-xl
          dark:border-white/[0.14]
          dark:bg-black/30
          dark:shadow-[0_8px_28px_rgba(0,0,0,0.20)]
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
        bg-black/50
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
