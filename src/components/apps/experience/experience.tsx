"use client";

import { ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
} from "react";

import { ExperienceCalendar } from "@/components/apps/experience/experience-calendar";
import { ExperienceDetail } from "@/components/apps/experience/experience-detail";
import { matchesQuery } from "@/components/apps/experience/experience-search";
import { ExperienceSidebar } from "@/components/apps/experience/experience-sidebar";
import { ExperienceTimeline } from "@/components/apps/experience/experience-timeline";
import { ExperienceToolbar } from "@/components/apps/experience/experience-toolbar";
import {
    getLatestExperience,
    getSpan,
    isOngoing,
    toMonthIndex,
} from "@/components/apps/experience/experience-time";
import { EXPERIENCE_UI } from "@/components/apps/experience/experience-ui";
import { EXPERIENCES, type ExperienceType } from "@/config/experience";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const PUSH_SPRING = { type: "spring", stiffness: 380, damping: 38 } as const;

const SPAN = getSpan(EXPERIENCES);
const FIRST_YEAR = Math.floor(SPAN.first / 12);
const LAST_YEAR = Math.floor(SPAN.last / 12);
const LATEST = getLatestExperience(EXPERIENCES);
const LATEST_YEAR = Math.floor(toMonthIndex(LATEST.endDate) / 12);

export function Experience() {
    const reduced = useReducedMotion();
    const rootRef = useRef<HTMLDivElement>(null);

    const [year, setYear] = useState(LATEST_YEAR);
    const [direction, setDirection] = useState(1);
    const [query, setQuery] = useState("");
    const [hiddenTypes, setHiddenTypes] = useState<ReadonlySet<ExperienceType>>(
        () => new Set(),
    );
    const ongoing = useMemo(() => EXPERIENCES.filter(isOngoing), []);
    const lastOpenedRef = useRef<string | null>(null);
    const [openId, setOpenId] = useState<string | null>(null);
    const [hintDismissed, setHintDismissed] = useState(false);

    useEffect(() => {
        const root = rootRef.current;
        const target = openId
            ? null
            : root?.querySelector<HTMLElement>(
                  `[data-role-id="${lastOpenedRef.current}"]`,
              );

        (target ?? root)?.focus();
    }, [openId]);

    const visible = useMemo(
        () => EXPERIENCES.filter((e) => !hiddenTypes.has(e.type)),
        [hiddenTypes],
    );

    const matchCount = useMemo(
        () => visible.filter((e) => matchesQuery(e, query)).length,
        [visible, query],
    );

    const opened = EXPERIENCES.find((e) => e.id === openId) ?? null;

    function goToYear(next: number) {
        const clamped = Math.min(Math.max(next, FIRST_YEAR), LAST_YEAR);

        if (clamped === year) {
            return;
        }

        setDirection(clamped > year ? 1 : -1);
        setYear(clamped);
        setHintDismissed(true);
    }

    function open(id: string) {
        lastOpenedRef.current = id;
        setOpenId(id);
        setHintDismissed(true);
    }

    function toggleType(type: ExperienceType) {
        setHiddenTypes((current) => {
            const next = new Set(current);

            if (!next.delete(type)) {
                next.add(type);
            }

            return next;
        });
    }

    function selectTechnology(technology: string) {
        setQuery(technology);
        setOpenId(null);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (event.key !== "Escape") {
            return;
        }

        if (opened) {
            event.preventDefault();
            setOpenId(null);
        } else if (query) {
            setQuery("");
        }
    }

    const slide = (x: number) => ({ x: reduced ? 0 : x, opacity: 0 });

    return (
        <div
            ref={rootRef}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className={EXPERIENCE_UI.root}
        >
            <AnimatePresence mode="popLayout" initial={false}>
                {opened ? (
                    <motion.div
                        key="detail"
                        className={EXPERIENCE_UI.nav.root}
                        initial={slide(64)}
                        animate={{ x: 0, opacity: 1 }}
                        exit={slide(64)}
                        transition={reduced ? { duration: 0 } : PUSH_SPRING}
                    >
                        <div className={EXPERIENCE_UI.detail.header}>
                            <button
                                type="button"
                                aria-label="Back to calendar"
                                onClick={() => setOpenId(null)}
                                className={EXPERIENCE_UI.toolbar.iconButton}
                            >
                                <ChevronLeft
                                    className="size-4"
                                    strokeWidth={1.8}
                                />
                            </button>

                            <div className="min-w-0">
                                <h2
                                    className={EXPERIENCE_UI.detail.headerTitle}
                                >
                                    {opened.role}
                                </h2>

                                <div
                                    className={
                                        EXPERIENCE_UI.detail.headerSubtitle
                                    }
                                >
                                    {opened.company}
                                </div>
                            </div>
                        </div>

                        <ExperienceDetail
                            experience={opened}
                            onSelectTechnology={selectTechnology}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="calendar"
                        className={EXPERIENCE_UI.nav.root}
                        initial={slide(-64)}
                        animate={{ x: 0, opacity: 1 }}
                        exit={slide(-64)}
                        transition={reduced ? { duration: 0 } : PUSH_SPRING}
                    >
                        <ExperienceToolbar
                            year={year}
                            canGoPrevious={year > FIRST_YEAR}
                            canGoNext={year < LAST_YEAR}
                            query={query}
                            matchCount={matchCount}
                            onPrevious={() => goToYear(year - 1)}
                            onNext={() => goToYear(year + 1)}
                            onLatest={() => goToYear(LATEST_YEAR)}
                            onQueryChange={(value) => {
                                setQuery(value);
                                setHintDismissed(true);
                            }}
                        />

                        <div className={EXPERIENCE_UI.main}>
                            <ExperienceSidebar
                                experiences={EXPERIENCES}
                                hiddenTypes={hiddenTypes}
                                ongoing={ongoing}
                                onToggleType={toggleType}
                                onOpen={open}
                            />

                            <ExperienceCalendar
                                experiences={visible}
                                year={year}
                                direction={direction}
                                query={query}
                                showHint={!hintDismissed}
                                onOpen={open}
                            />
                        </div>

                        <ExperienceTimeline
                            experiences={EXPERIENCES}
                            hiddenTypes={hiddenTypes}
                            year={year}
                            onOpen={open}
                            onSelectYear={goToYear}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
