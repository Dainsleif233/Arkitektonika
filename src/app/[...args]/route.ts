export async function GET(_: Request, { params }: { params: Promise<{ args: string[] }> }) {
    // download/key
    return Response.json(null, { status: 200 });
}

export async function POST(request: Request, { params }: { params: Promise<{ args: string[] }> }) {
    // upload
    return Response.json(null, { status: 200 });
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