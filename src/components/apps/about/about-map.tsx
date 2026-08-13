import { ABOUT } from "@/config/about";

export function AboutMap() {
    return (
        <section className="border-t border-foreground/10 pt-4">
            <div className="mb-3">
                <h2 className="text-lg font-semibold text-foreground">
                    Location
                </h2>

                <p className="mt-1 text-sm text-foreground/55">
                    {ABOUT.location.label}
                </p>
            </div>

            <div className="h-59 overflow-hidden rounded-xl border border-foreground/10">
                <iframe
                    src={ABOUT.location.mapUrl}
                    title={`Map of ${ABOUT.location.label}`}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="h-full w-full border-0"
                />
            </div>
        </section>
    );
}
