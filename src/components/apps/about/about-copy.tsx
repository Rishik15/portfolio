import { ABOUT_UI } from "@/components/apps/about/about-ui";
import { ABOUT } from "@/config/about";

export function AboutCopy() {
    return (
        <section>
            <h1 className={ABOUT_UI.copy.heading}>About me</h1>

            <div className={ABOUT_UI.copy.body}>
                <p className={ABOUT_UI.copy.greeting}>{ABOUT.greeting}</p>

                {ABOUT.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                ))}
            </div>
        </section>
    );
}
