import { AboutCopy } from "./about-copy";
import { AboutMap } from "./about-map";

export function About() {
    return (
        <div className="min-h-full bg-transparent px-5 py-5 font-sans">
            <div className="mx-auto max-w-2xl space-y-5">
                <AboutCopy />
                <AboutMap />
            </div>
        </div>
    );
}
