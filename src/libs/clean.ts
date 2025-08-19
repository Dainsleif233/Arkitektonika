import DB from '@/libs/db-service';
import { initializeDatabase } from '@/libs/database';
import { handleDelete } from '@/libs/delete';

export async function cleanHead(password: string) {
    if (password !== process.env.CLEAN_PWD) return new Response(
        null,
        { status: 403 }
    );

    await initializeDatabase();
    const db = new DB();
    const schems = await db.queryExpired(2592000);
    schems.forEach(item => handleDelete(item.delete));
    return new Response(
        null,
        { status: 204 }
    );
}