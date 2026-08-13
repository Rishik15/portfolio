import { ABOUT } from "@/config/about";

export function AboutCopy() {
    return (
        <section>
            <h1 className="text-[26px] font-semibold tracking-tight text-foreground">
                About me
            </h1>

            <div className="mt-4 max-w-xl space-y-3 leading-6 text-foreground/75">
                <p className="font-medium text-foreground/90">
                    {ABOUT.greeting}
                </p>

                {ABOUT.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                ))}
            </div>
        </section>
    );
}
