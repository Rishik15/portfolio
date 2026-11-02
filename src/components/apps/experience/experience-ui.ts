import type { ExperienceType } from "@/config/experience";

export const TYPE_STYLES: Record<
    ExperienceType,
    { bar: string; dot: string; strip: string }
> = {
    Research: {
        bar: "bg-sky-100 text-sky-950 dark:bg-sky-950 dark:text-sky-100",
        dot: "bg-sky-500",
        strip: "bg-sky-400 dark:bg-sky-500",
    },
    Internship: {
        bar: "bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100",
        dot: "bg-emerald-500",
        strip: "bg-emerald-400 dark:bg-emerald-500",
    },
    Fellowship: {
        bar: "bg-violet-100 text-violet-950 dark:bg-violet-950 dark:text-violet-100",
        dot: "bg-violet-500",
        strip: "bg-violet-400 dark:bg-violet-500",
    },
    "Full-time": {
        bar: "bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-100",
        dot: "bg-rose-500",
        strip: "bg-rose-400 dark:bg-rose-500",
    },
    "Part-time": {
        bar: "bg-orange-100 text-orange-950 dark:bg-orange-950 dark:text-orange-100",
        dot: "bg-orange-500",
        strip: "bg-orange-400 dark:bg-orange-500",
    },
    Contract: {
        bar: "bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-100",
        dot: "bg-amber-500",
        strip: "bg-amber-400 dark:bg-amber-500",
    },
    Other: {
        bar: "bg-slate-100 text-slate-950  dark:bg-slate-800 dark:text-slate-100",
        dot: "bg-slate-500",
        strip: "bg-slate-400 dark:bg-slate-500",
    },
};

export const EXPERIENCE_UI = {
    root: "@container/experience flex h-full min-h-0 w-full flex-col overflow-hidden bg-background text-foreground outline-none",

    main: "flex min-h-0 flex-1 overflow-hidden",

    toolbar: {
        root: "flex h-11 shrink-0 items-center gap-2 border-b border-foreground/10 px-3",
        iconButton:
            "inline-flex size-7 shrink-0 items-center justify-center rounded-md text-foreground/70 transition-colors duration-100 hover:bg-foreground/[0.07] hover:text-foreground disabled:pointer-events-none disabled:opacity-30",
        title: "min-w-0 truncate text-[15px] font-semibold tabular-nums tracking-[-0.01em]",
        pill: "inline-flex h-7 shrink-0 items-center rounded-md border border-foreground/10 px-2.5 text-[12px] font-medium text-foreground/80 transition-colors duration-100 hover:bg-foreground/[0.07] hover:text-foreground",
        search: "relative ml-auto flex h-7 w-44 shrink-0 items-center @max-[800px]/experience:w-32",
        searchIcon:
            "pointer-events-none absolute left-2 size-3.5 text-foreground/45",
        searchInput:
            "h-full w-full rounded-md border border-foreground/10 bg-foreground/[0.035] pl-7 pr-12 text-[12px] outline-none transition-colors duration-100 placeholder:text-foreground/40 focus:border-foreground/25 focus:bg-background",
        searchCount:
            "pointer-events-none absolute right-2 text-[10px] tabular-nums text-foreground/50",
    },

    sidebar: {
        root: "flex w-[210px] shrink-0 flex-col gap-5 overflow-y-auto border-r border-foreground/10 bg-foreground/[0.025] px-2.5 py-3 @max-[800px]/experience:w-12 @max-[800px]/experience:items-center @max-[800px]/experience:px-1.5",
        heading:
            "mb-1 px-2 text-[10px] font-medium tracking-[0.08em] text-foreground/50 @max-[800px]/experience:hidden",
        row: "flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-[13px] text-foreground/85 transition-colors duration-100 hover:bg-foreground/[0.06] @max-[800px]/experience:justify-center @max-[800px]/experience:px-0",
        rowOff: "text-foreground/40",
        dot: "size-2.5 shrink-0 rounded-full",
        dotOff: "bg-transparent ring-1 ring-inset ring-foreground/30",
        label: "min-w-0 truncate @max-[800px]/experience:hidden",
        count: "ml-auto text-[11px] tabular-nums text-foreground/45 @max-[800px]/experience:hidden",
    },

    calendar: {
        root: "relative flex min-w-0 flex-1 flex-col overflow-hidden px-4 pb-3 pt-3",
        months: "grid grid-cols-12",
        month: "pb-2 text-center text-[11px] font-medium tracking-[0.04em] text-foreground/55",
        monthNow: "text-foreground",
        stage: "relative min-h-0 flex-1",
        slide: "absolute inset-0 flex flex-col",
        columns: "pointer-events-none absolute inset-0 grid grid-cols-12",
        column: "border-l border-foreground/[0.07] last:border-r",
        columnNow: "bg-foreground/[0.03]",
        lanes: "relative grid min-h-0 flex-1 grid-cols-12 content-start gap-y-1.5 overflow-y-auto pt-2",
        nowLine: "pointer-events-none absolute inset-y-0 w-px bg-red-500/70",
        nowDot: "absolute -top-1 -left-[3px] size-[7px] rounded-full bg-red-500",
        bar: "relative z-10 flex h-full min-w-0 cursor-pointer flex-col justify-center overflow-hidden px-2.5 text-left outline-none transition-[filter] duration-150 hover:brightness-[0.97] focus-visible:ring-2 focus-visible:ring-ring dark:hover:brightness-125",
        barRole: "truncate text-[12px] font-semibold leading-tight",
        barRange: "truncate text-[10px] leading-tight opacity-70",
        summary:
            "relative z-10 w-fit shrink-0 bg-background py-1 pr-2 pl-2 text-[12px] text-foreground/50",
        hint: "pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full border border-foreground/10 bg-background px-3 py-1.5 text-[12px] text-foreground/70 shadow-md",
    },

    timeline: {
        root: "shrink-0 border-t border-foreground/10 px-4 pb-2.5 pt-2.5",
        track: "relative h-[72px] select-none",
        year: "absolute top-0 inline-flex h-5 items-center rounded-full px-2 text-[11px] font-medium tabular-nums text-foreground/45 transition-colors duration-150 hover:bg-foreground/[0.06] hover:text-foreground/80",
        yearActive: "bg-foreground/[0.08] text-foreground",
        divider:
            "pointer-events-none absolute inset-y-0 border-l border-foreground/10",
        strip: "block h-1.5 w-full rounded-full opacity-80",
    },

    nav: {
        root: "flex min-h-0 min-w-0 flex-1 flex-col",
    },

    detail: {
        header: "flex shrink-0 items-center gap-2.5 border-b border-foreground/10 px-3 py-2 @3xl/experience:px-4",
        headerTitle:
            "truncate text-[13px] font-semibold leading-tight tracking-[-0.01em] @3xl/experience:text-[14px]",
        headerSubtitle:
            "truncate text-[10px] leading-tight text-foreground/55 @3xl/experience:text-[11px]",
        root: "min-h-0 min-w-0 flex-1 overflow-y-auto",
        content:
            "grid grid-cols-1 gap-6 p-4 @3xl/experience:grid-cols-[minmax(0,1.5fr)_minmax(200px,0.8fr)] @3xl/experience:gap-8 @3xl/experience:p-5",
        sectionTitle:
            "mb-2 text-[10px] font-medium tracking-[0.08em] text-foreground/50",
        body: "text-[13px] leading-6 text-foreground/80",
        highlights: "flex flex-col gap-2",
        highlightRow: "flex gap-2.5 text-[13px] leading-6 text-foreground/80",
        highlightDot: "mt-[10px] size-1 shrink-0 rounded-full bg-foreground/35",
        side: "flex flex-col gap-4 @3xl/experience:border-l @3xl/experience:border-foreground/10 @3xl/experience:pl-5",
        label: "mb-1 text-[9px] font-medium tracking-[0.08em] text-foreground/50 @3xl/experience:text-[10px]",
        value: "flex min-w-0 items-center gap-1.5 text-[13px] text-foreground/90",
        chips: "flex flex-wrap gap-1.5",
        chip: "rounded-md border border-foreground/10 px-1.5 py-0.5 text-[11px] text-foreground/75 transition-colors duration-100 hover:bg-foreground/[0.07] hover:text-foreground",
    },
} as const;
