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
        <Tooltip
            delay={0}
            className="
        flex
        size-full
        items-center
        justify-center
      "
        >
            <Tooltip.Trigger>
                <button
                    type="button"
                    aria-label={item.label}
                    className="
            flex
            size-full
            items-center
            justify-center
            rounded-[14px]
            border-0
            bg-transparent
            p-0
            outline-none
          "
                >
                    <Image
                        src={item.icon}
                        alt=""
                        width={80}
                        height={80}
                        sizes="48px"
                        draggable={false}
                        priority={item.id === "about"}
                        className="
              size-11.5
              shrink-0
              select-none
              object-contain
              transform-[translateZ(0)]
            "
                    />
                </button>
            </Tooltip.Trigger>

            <Tooltip.Content placement="top" offset={13} showArrow>
                {item.label}
            </Tooltip.Content>
        </Tooltip>
    );
}

export const DockItem = memo(DockItemComponent);
