"use client";

import { ArrowDown } from "lucide-react";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type KeyboardEvent,
} from "react";

import { TerminalInput } from "@/components/apps/terminal/terminal-input";
import { TerminalOutput } from "@/components/apps/terminal/terminal-output";
import {
    TERMINAL_MOTION,
    TERMINAL_UI,
} from "@/components/apps/terminal/terminal-ui";
import { useTerminal } from "@/components/apps/terminal/use-terminal";

export function Terminal() {
    const terminal = useTerminal();

    const viewportRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const isFollowingRef = useRef(true);

    const [isFollowing, setIsFollowing] = useState(true);
    const [skipToken, setSkipToken] = useState(0);
    const [printingIds, setPrintingIds] = useState<ReadonlySet<number>>(
        new Set(),
    );

    const hasContent = terminal.showWelcome || terminal.entries.length > 0;

    const scrollToLatest = useCallback(() => {
        const viewport = viewportRef.current;

        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }, []);

    const setFollowing = useCallback((following: boolean) => {
        isFollowingRef.current = following;
        setIsFollowing(following);
    }, []);

    useEffect(() => {
        const content = contentRef.current;

        if (!content) return;

        let frame = 0;

        const observer = new ResizeObserver(() => {
            if (!isFollowingRef.current || frame) return;

            frame = requestAnimationFrame(() => {
                frame = 0;

                if (isFollowingRef.current) scrollToLatest();
            });
        });

        observer.observe(content);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [scrollToLatest]);

    const handlePrintingChange = useCallback(
        (id: number, printing: boolean) => {
            setPrintingIds((current) => {
                if (current.has(id) === printing) return current;

                const next = new Set(current);

                if (printing) next.add(id);
                else next.delete(id);

                return next;
            });
        },
        [],
    );

    function handleScroll() {
        const viewport = viewportRef.current;

        if (!viewport) return;

        const distanceFromBottom =
            viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;

        setFollowing(distanceFromBottom < TERMINAL_MOTION.followThresholdPx);
    }

    function handleKeyDownCapture(event: KeyboardEvent<HTMLDivElement>) {
        if (event.key !== "Escape" || printingIds.size === 0) return;

        event.preventDefault();
        event.stopPropagation();
        setSkipToken((current) => current + 1);
    }

    function handleCommand(command: string) {
        setFollowing(true);
        terminal.submitCommand(command);
    }

    function handleJumpToLatest() {
        setFollowing(true);
        scrollToLatest();
        inputRef.current?.focus();
    }

    function focusInput() {
        if (!window.getSelection()?.toString()) {
            inputRef.current?.focus();
        }
    }

    return (
        <div className={TERMINAL_UI.root}>
            <div
                ref={viewportRef}
                onClick={focusInput}
                onScroll={handleScroll}
                onKeyDownCapture={handleKeyDownCapture}
                className={TERMINAL_UI.viewport}
            >
                <div ref={contentRef}>
                    <TerminalOutput
                        entries={terminal.entries}
                        showWelcome={terminal.showWelcome}
                        skipToken={skipToken}
                        onPrintingChange={handlePrintingChange}
                    />

                    <div
                        className={
                            hasContent
                                ? TERMINAL_UI.output.inputWithContent
                                : TERMINAL_UI.output.input
                        }
                    >
                        <TerminalInput
                            history={terminal.history}
                            inputRef={inputRef}
                            viewportRef={viewportRef}
                            onCommand={handleCommand}
                        />
                    </div>
                </div>
            </div>

            {!isFollowing && (
                <button
                    type="button"
                    aria-label="Jump to latest"
                    onClick={handleJumpToLatest}
                    className={TERMINAL_UI.jumpToLatest}
                >
                    <ArrowDown aria-hidden="true" className="size-4" />
                </button>
            )}
        </div>
    );
}
