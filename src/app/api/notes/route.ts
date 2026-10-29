import { getNotesLibrary } from "@/lib/notes/get-notes";

export const runtime = "nodejs";
export const dynamic = "force-static";

export async function GET() {
    const library = await getNotesLibrary();

    return Response.json(library);
}
