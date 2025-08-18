import { handleUpload } from "@/libs/upload";
import { downloadHead, handleDownload } from "@/libs/download";
import { deleteHead, handleDelete } from "@/libs/delete";

export async function GET(_: Request, { params }: { params: Promise<{ args: string[] }> }) {
    const key = (await params).args[1];
    return handleDownload(key);
}

export async function POST(request: Request) {
    return handleUpload(request);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ args: string[] }> }) {
    const key = (await params).args[1];
    return handleDelete(key);
}

export async function HEAD(_: Request, { params }: { params: Promise<{ args: string[] }> }) {
    const args = (await params).args;
    if (args[0] === 'download') return downloadHead(args[1]);
    if (args[0] === 'delete') return deleteHead(args[1]);
}
