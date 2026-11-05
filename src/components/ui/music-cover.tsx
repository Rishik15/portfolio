import { Music2 } from "lucide-react";

type MusicCoverProps = {
    src: string | null;
    className: string;
    iconClassName?: string;
};

export function MusicCover({ src, className, iconClassName }: MusicCoverProps) {
    if (!src) {
        return (
            <div className={className}>
                <Music2
                    className={iconClassName ?? "size-4 text-muted-foreground"}
                />
            </div>
        );
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className={className}
        />
    );
}
