import { handleUpload } from "@/libs/upload";

export async function GET(_: Request, { params }: { params: Promise<{ args: string[] }> }) {
    // download/key
    return Response.json(null, { status: 200 });
}

export async function POST(request: Request) {
    return handleUpload(request);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ args: string[] }> }) {
    // delete/key
    return Response.json(null, { status: 200 });
}

export async function HEAD(_: Request, { params }: { params: Promise<{ args: string[] }> }) {
    // download/key
    // delete/key
    return Response.json(null, { status: 200 });
}