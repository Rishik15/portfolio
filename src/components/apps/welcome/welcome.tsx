"use client";

// welcome.tsx: first-load window with the owner's name, role, outcomes and launch buttons.

import { WELCOME_UI } from "@/components/apps/welcome/welcome-ui";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWindowManager } from "@/components/windows/window-manager";
import { WELCOME, type WelcomeAction } from "@/config/welcome";

/**
 * Renders the Welcome window content.
 * Takes no props; returns the intro, outcome cards and calls to action.
 */
export function Welcome() {
    const { activateWindow } = useWindowManager();

    /**
     * Renders one action as a button (opens a window) or a link (external href).
     * Takes the action and whether it is the primary one; returns the element.
     */
    function renderAction(action: WelcomeAction, primary: boolean) {
        const className = cn(
            buttonVariants({
                variant: primary ? "default" : "outline",
                size: "lg",
                className: primary
                    ? undefined
                    : "border-foreground/15 bg-foreground/5 hover:bg-foreground/10 dark:border-foreground/10 dark:bg-foreground/5 dark:hover:bg-foreground/10",
            }),
        );

        if ("windowId" in action) {
            return (
                <button
                    key={action.label}
                    type="button"
                    onClick={() => activateWindow(action.windowId)}
                    className={className}
                >
                    {action.label}
                </button>
            );
        }

        return (
            <a key={action.label} href={action.href} className={className}>
                {action.label}
            </a>
        );
    }

    return (
        <div className={WELCOME_UI.root}>
            <div className={WELCOME_UI.content}>
                <header>
                    <p className={WELCOME_UI.eyebrow}>{WELCOME.eyebrow}</p>
                    <h1 className={WELCOME_UI.name}>{WELCOME.name}</h1>
                    <p className={WELCOME_UI.role}>{WELCOME.role}</p>
                    <p className={WELCOME_UI.intro}>{WELCOME.intro}</p>
                </header>

                <ul className={WELCOME_UI.cards}>
                    {WELCOME.outcomes.map((outcome) => (
                        <li key={outcome.title} className={WELCOME_UI.card}>
                            <p className={WELCOME_UI.cardTitle}>
                                {outcome.title}
                            </p>
                        </li>
                    ))}
                </ul>

                <div className={WELCOME_UI.actions}>
                    {renderAction(WELCOME.primary, true)}
                    {WELCOME.secondary.map((action) =>
                        renderAction(action, false),
                    )}
                </div>
            </div>
        </div>
    );
}
