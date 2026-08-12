"use client";

import { useEffect, useState } from "react";

const TIME_ZONE = "America/New_York";
const ONE_MINUTE = 60_000;

const TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
});

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    month: "short",
    day: "2-digit",
});

export function LiveClock() {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        function scheduleNextTick() {
            const delay = ONE_MINUTE - (Date.now() % ONE_MINUTE);

            timer = setTimeout(() => {
                setNow(new Date());
                scheduleNextTick();
            }, delay);
        }

        function syncClock() {
            clearTimeout(timer);
            setNow(new Date());
            scheduleNextTick();
        }

        function handleVisibilityChange() {
            if (document.visibilityState === "visible") {
                syncClock();
            }
        }

        scheduleNextTick();

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearTimeout(timer);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
        };
    }, []);

    const time = TIME_FORMATTER.format(now);
    const date = DATE_FORMATTER.format(now).toUpperCase();

    return (
        <div
            className="flex items-center gap-3 whitespace-nowrap text-[12px] font-normal uppercase tracking-[0.12em]"
            aria-label="Current date and time in New York"
        >
            <time suppressHydrationWarning className="tabular-nums">
                {time}
            </time>

            <span suppressHydrationWarning className="tabular-nums">
                {date}
            </span>

            <span className="flex items-center gap-2">
                <span>New York</span>

                <span
                    className="size-1.5 shrink-0 rounded-full bg-emerald-500"
                    aria-hidden="true"
                />
            </span>
        </div>
    );
}
