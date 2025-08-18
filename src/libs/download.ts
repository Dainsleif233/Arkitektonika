import DB from '@/libs/db-service';
import { initializeDatabase } from '@/libs/database';
import STO from '@/libs/sto-service';

export async function downloadHead(downloadKey: string) {
    const url = await getUrl(downloadKey);
    if (url === 404) return new Response(
        null,
        { status: 404 }
    );
    if (url === 410) return new Response(
        null,
        { status: 410 }
    );
    
    return new Response(
        null,
        { status: 200 }
    );
}

export async function handleDownload(downloadKey: string) {
    const url = await getUrl(downloadKey);
    if (url === 404) return new Response(
        null,
        { status: 404 }
    );
    if (url === 410) return new Response(
        null,
        { status: 410 }
    );

    return Response.redirect(url, 302);
}

async function getUrl(downloadKey: string) {
    await initializeDatabase();
    const db = new DB();
    const data = await db.getByDownloadKey(downloadKey);
    if (!data) return 404;

    const sto = new STO();
    const url = await sto.get(data.sha1, data.name, data.size);
    if (!url) return 410;

    return url;
}
