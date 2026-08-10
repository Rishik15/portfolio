"use client";

import { memo } from "react";
import Image from "next/image";

import { Tooltip } from "@/components/ui/tooltip";
import type { DockItemConfig } from "@/config/dock";

type DockItemProps = {
    item: DockItemConfig;
};

function DockItemComponent({ item }: DockItemProps) {
    return (
        <Tooltip>
            <Tooltip.Trigger>
                <Image
                    src={item.icon}
                    alt=""
                    width={80}
                    height={80}
                    sizes="48px"
                    loading="eager"
                    draggable={false}
                    className="
                        size-15
                        shrink-0
                        select-none
                        object-contain
                        transform-[translateZ(0)]
                    "
                />
            </Tooltip.Trigger>

            <Tooltip.Content placement="top" offset={13} showArrow>
                {item.label}
            </Tooltip.Content>
        </Tooltip>
    );
}

export const DockItem = memo(DockItemComponent);
