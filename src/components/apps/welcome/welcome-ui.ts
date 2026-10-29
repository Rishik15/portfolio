// welcome-ui.ts: class names for the Welcome window, sized by its own container width.

export const WELCOME_UI = {
  root: `
        @container/welcome
        flex
        h-full
        min-h-0
        flex-col
        justify-center
        overflow-y-auto
        bg-transparent
        px-4
        py-2
        font-sans

        @min-[640px]/welcome:px-10
        @min-[640px]/welcome:py-8
    `,

  content: `
        mx-auto
        w-full
        max-w-xl
        space-y-4

        @min-[640px]/welcome:space-y-6
    `,

  eyebrow: `
        text-[12px]
        font-medium
        uppercase
        tracking-[0.18em]
        text-foreground/55
    `,

  name: `
        mt-2
        text-[28px]
        font-semibold
        leading-tight
        tracking-tight
        text-foreground

        @min-[640px]/welcome:text-[38px]
    `,

  role: `
        mt-1
        text-[14px]
        text-foreground/75

        @min-[640px]/welcome:text-[17px]
    `,

  intro: `
        mt-2
        max-w-md
        text-[14px]
        leading-6
        text-foreground/55

        @min-[640px]/welcome:mt-3
        @min-[640px]/welcome:text-[15px]
    `,

  cards: `
        flex
        flex-wrap
        gap-2
    `,

  card: `
        rounded-full
        border
        border-foreground/10
        bg-foreground/4
        px-3.5
        py-1.5
    `,

  cardTitle: `
        text-[14px]
        font-semibold
        text-foreground

        @min-[640px]/welcome:text-[15px]
    `,

  actions: `
        flex
        flex-wrap
        items-center
        gap-2
        border-t
        border-foreground/10
        pt-4

        @min-[640px]/welcome:pt-6
    `,
} as const;
