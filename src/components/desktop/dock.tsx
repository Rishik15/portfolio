"use client";

import { DockItem } from "@/components/desktop/dock-item";
import { DOCK_CONFIG, DOCK_UI } from "@/components/desktop/dock-ui";
import { Dock as MagicDock, DockIcon } from "@/components/ui/dock";
import { Separator } from "@/components/ui/separator";
import { APP_DOCK_ITEMS, CONTACT_DOCK_ITEMS } from "@/config/dock";

export function Dock() {
    return (
        <div className={DOCK_UI.position}>
            <MagicDock
                iconSize={DOCK_CONFIG.iconSize}
                iconMagnification={DOCK_CONFIG.iconMagnification}
                iconDistance={DOCK_CONFIG.iconDistance}
                direction="middle"
                className={DOCK_UI.dock}
            >
                {APP_DOCK_ITEMS.map((item) => (
                    <DockIcon key={item.id} className={DOCK_UI.icon}>
                        <DockItem item={item} />
                    </DockIcon>
                ))}

                <Separator
                    orientation="vertical"
                    variant="secondary"
                    className={DOCK_UI.separator}
                />

                {CONTACT_DOCK_ITEMS.map((item) => (
                    <DockIcon key={item.id} className={DOCK_UI.icon}>
                        <DockItem item={item} />
                    </DockIcon>
                ))}
            </MagicDock>
        </div>
    );
}
