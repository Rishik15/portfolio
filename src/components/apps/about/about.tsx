import { AboutCopy } from "@/components/apps/about/about-copy";
import { AboutMap } from "@/components/apps/about/about-map";
import { ABOUT_UI } from "@/components/apps/about/about-ui";

export function About() {
    return (
        <div className={ABOUT_UI.root}>
            <div className={ABOUT_UI.content}>
                <AboutCopy />
                <AboutMap />
            </div>
        </div>
    );
}
