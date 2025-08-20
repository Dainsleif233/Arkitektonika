import DB from '@/libs/db-service';
import { initializeDatabase } from '@/libs/database';
import STO from '@/libs/sto-service';

export async function downloadHead(downloadKey: string) {
    const url = await getUrl(downloadKey);
    return new Response(
        null,
        { status: url.status }
    );
}

export async function handleDownload(downloadKey: string) {
    const url = await getUrl(downloadKey);
    if (url.status === 404) return new Response(
        null,
        { status: 404 }
    );
    if (url.status === 410) return new Response(
        null,
        { status: 410 }
    );

    return Response.redirect(url.url as string, 302);
}

async function getUrl(downloadKey: string) {
    const otherApi = JSON.parse(process.env.OTHER_API ?? '{}');
    const matchedKey = Object.keys(otherApi).find(key => downloadKey.endsWith(`@${key}`));
    if (matchedKey) {
        const originalKey = downloadKey.slice(0, -(`@${matchedKey}`.length));
        const apiValue = otherApi[matchedKey];
        return {
            status: 200,
            url: `${apiValue}${originalKey}`
        }
    }

    await initializeDatabase();
    const db = new DB();
    const data = await db.getByDownloadKey(downloadKey);
    if (!data) return {
        status: 404,
        url: null
    };

    const sto = new STO();
    const url = await sto.get(data.sha1, data.name, data.size);
    if (!url) return {
        status: 410,
        url: null
    };

    return {
        status: 200,
        url
    };
}
