import { NOTES_UI } from "@/components/apps/notes/notes-ui";

type NotesMarkdownProps = {
    html: string;
};

export function NotesMarkdown({ html }: NotesMarkdownProps) {
    return (
        <div
            className={NOTES_UI.markdown}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
