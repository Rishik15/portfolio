/**
 * page.tsx
 * Throwaway sandbox route for tuning the animated scene and cat. Remove before finishing.
 */

import { Cat } from "@/components/background/cat";
import { Scene } from "@/components/background/scene";

/**
 * Renders the scene and cat full-screen.
 * @returns The sandbox page.
 */
export default function CatSandbox() {
    return (
        <main className="relative h-dvh w-screen overflow-hidden">
            <Scene />
            <Cat />
        </main>
    );
}
