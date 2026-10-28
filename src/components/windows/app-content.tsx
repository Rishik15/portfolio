// app-content.tsx: Keep app loading and failure feedback inside the window frame.

"use client";

import { Component, type ReactNode } from "react";

type AppContentState = { hasError: boolean };
type AppContentProps = { children: ReactNode };

/** Takes no arguments and returns an accessible app loading status. */
export function AppLoading() {
    return (
        <p role="status" className="p-6 text-sm">
            Loading app…
        </p>
    );
}

/** Takes no arguments and reloads the document to recover a failed app chunk; returns nothing. */
function reloadApp() {
    window.location.reload();
}

/** Takes app children and returns their content or a window-local recovery control. */
export class AppContentBoundary extends Component<AppContentProps, AppContentState> {
    state: AppContentState = { hasError: false };

    /** Takes no arguments and returns the failure state when a child throws. */
    static getDerivedStateFromError(): AppContentState {
        return { hasError: true };
    }

    /** Takes no arguments and returns app children or reload feedback after a failure. */
    render() {
        if (this.state.hasError) {
            return (
                <div className="space-y-3 p-6 text-sm">
                    <p role="alert">This app could not load. Reload to try again.</p>
                    <button
                        type="button"
                        onClick={reloadApp}
                        className="rounded border px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                        Reload
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
