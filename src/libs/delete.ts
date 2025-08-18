import DB from '@/libs/db-service';
import { initializeDatabase } from '@/libs/database';
import STO from '@/libs/sto-service';

export async function deleteHead(deleteKey: string) {
    const data = await getStatus(deleteKey);
    return new Response(
        null,
        { status: data.status }
    );
}

export async function handleDelete(deleteKey: string) {
    const data = await getStatus(deleteKey);
    if (data.status === 404) return new Response(
        null,
        { status: 404 }
    );
    if (data.status === 410) {
        const db = new DB();
        await db.disable(deleteKey);
        return new Response(
            null,
            { status: 410 }
        );
    }

    const db = new DB();
    const schems = await db.getByHash(data.sha1 as string);
    if (schems.length === 1) {
        const sto = new STO();
        await sto.delete(data.sha1 as string);
    }
    await db.disable(deleteKey);
    return new Response(
        null,
        { status: 200 }
    );
}

async function getStatus(deleteKey: string) {
    await initializeDatabase();
    const db = new DB();
    const data = await db.getByDeleteKey(deleteKey);
    if (!data) return {
        status: 404
    };

    const sto = new STO();
    if (!(await sto.check(data.sha1))) return {
        status: 410,
        sha1: data.sha1
    };

    return {
        status: 200,
        sha1: data.sha1
    };
}
