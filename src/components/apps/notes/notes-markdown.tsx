type NotesMarkdownProps = {
    html: string;
};

export function NotesMarkdown({ html }: NotesMarkdownProps) {
    return (
        <div
            className="
                mt-5
                text-[15px]
                leading-7
                text-foreground/80

                [&_h1]:mb-3
                [&_h1]:mt-8
                [&_h1]:text-2xl
                [&_h1]:font-semibold
                [&_h1]:tracking-tight
                [&_h1]:text-foreground

                [&_h2]:mb-2
                [&_h2]:mt-8
                [&_h2]:text-xl
                [&_h2]:font-semibold
                [&_h2]:tracking-tight
                [&_h2]:text-foreground

                [&_h3]:mb-2
                [&_h3]:mt-6
                [&_h3]:text-lg
                [&_h3]:font-semibold
                [&_h3]:text-foreground

                [&_p]:my-4

                [&_strong]:font-semibold
                [&_strong]:text-foreground

                [&_a]:underline
                [&_a]:decoration-foreground/25
                [&_a]:underline-offset-2
                [&_a]:transition-colors
                [&_a]:duration-100
                hover:[&_a]:decoration-foreground/70

                [&_ul]:my-4
                [&_ul]:list-disc
                [&_ul]:pl-6

                [&_ol]:my-4
                [&_ol]:list-decimal
                [&_ol]:pl-6

                [&_li]:my-1

                [&_blockquote]:my-5
                [&_blockquote]:border-l-2
                [&_blockquote]:border-[#e6b62f]
                [&_blockquote]:pl-4
                [&_blockquote]:italic
                [&_blockquote]:text-foreground/60

                [&_hr]:my-8
                [&_hr]:border-black/10
                dark:[&_hr]:border-white/10

                [&_code]:rounded
                [&_code]:bg-black/[0.055]
                [&_code]:px-1.5
                [&_code]:py-0.5
                [&_code]:font-mono
                [&_code]:text-[0.9em]
                dark:[&_code]:bg-white/[0.07]

                [&_pre]:my-5
                [&_pre]:overflow-x-auto
                [&_pre]:rounded-xl
                [&_pre]:bg-black/[0.055]
                [&_pre]:p-4
                [&_pre]:leading-6
                dark:[&_pre]:bg-white/[0.06]

                [&_pre_code]:bg-transparent
                [&_pre_code]:p-0

                [&_img]:my-6
                [&_img]:h-auto
                [&_img]:max-w-full
                [&_img]:rounded-xl

                [&_table]:my-6
                [&_table]:w-full
                [&_table]:border-collapse
                [&_table]:text-sm

                [&_th]:border
                [&_th]:border-black/10
                [&_th]:bg-black/[0.025]
                [&_th]:px-3
                [&_th]:py-2
                [&_th]:text-left
                [&_th]:font-semibold
                dark:[&_th]:border-white/10
                dark:[&_th]:bg-white/[0.035]

                [&_td]:border
                [&_td]:border-black/10
                [&_td]:px-3
                [&_td]:py-2
                dark:[&_td]:border-white/10
            "
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
