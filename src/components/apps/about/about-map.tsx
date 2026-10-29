import { ABOUT_UI } from "@/components/apps/about/about-ui";
import { ABOUT } from "@/config/about";

export function AboutMap() {
    return (
        <section className={ABOUT_UI.map.section}>
            <div className={ABOUT_UI.map.header}>
                <h2 className={ABOUT_UI.map.title}>Location</h2>

                <p className={ABOUT_UI.map.location}>{ABOUT.location.label}</p>
            </div>

            <div className={ABOUT_UI.map.frame}>
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
