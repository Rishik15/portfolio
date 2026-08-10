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
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;

        function scheduleNextTick() {
            const delay = ONE_MINUTE - (Date.now() % ONE_MINUTE);

            timer = setTimeout(tick, delay);
        }

        function tick() {
            setNow(new Date());
            scheduleNextTick();
        }

        function syncClock() {
            if (timer !== undefined) {
                clearTimeout(timer);
            }

            setNow(new Date());
            scheduleNextTick();
        }

        function handleVisibilityChange() {
            if (document.visibilityState === "visible") {
                syncClock();
            }
        }

        syncClock();

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            if (timer !== undefined) {
                clearTimeout(timer);
            }

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
        };
    }, []);

    const time = now ? TIME_FORMATTER.format(now) : "00:00 AM";
    const date = now ? DATE_FORMATTER.format(now).toUpperCase() : "JAN 00";

    return (
        <div
            className="flex items-center gap-3 whitespace-nowrap text-[12px] font-normal uppercase tracking-[0.12em]"
            aria-label="Current date and time in New York"
        >
            <time dateTime={now?.toISOString()} className="tabular-nums">
                <span className={now ? "opacity-100" : "opacity-0"}>
                    {time}
                </span>
            </time>

            <span className="tabular-nums">
                <span className={now ? "opacity-100" : "opacity-0"}>
                    {date}
                </span>
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
