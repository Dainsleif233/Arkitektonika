import crypto from 'crypto';
import DB from '@/libs/db-service';
import STO from '@/libs/sto-service';
import { initializeDatabase } from '@/libs/database';

export async function handleUpload(request: Request) {
    // 获取上传的表单数据
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('multipart/form-data'))
        return Response.json({ error: 'Invalid content type' }, { status: 400 });

    try {
        const file = (await request.formData()).get('schematic') as File | null;
        if (!file)
            return Response.json({ error: 'Missing file' }, { status: 500 });
        const sha1 = await getHash(file);

        const err = await validateFile(file);
        if (err) {
            console.error(err);
            return Response.json({ error: `Invalid request due to invalid nbt content: ${err}` }, { status: 413 });
        }

        await initializeDatabase();
        const db = new DB();
        const data = await db.getByHash(sha1);
        if (data.length < 1) {
            const sto = new STO();
            await sto.put(file, sha1);
        }

        const newData = await db.create(file.name, file.size, sha1);
        return Response.json(
            {
                download_key: newData.download,
                delete_key: newData.delete
            },
            { status: 200 }
        );
    } catch (e) {
        console.error(e);
        return Response.json({ error: 'Failed to parse form data' }, { status: 500 });
    }
}

async function validateFile(file: File) {
    // 1. 检查文件大小是否超过5MB
    const maxSize = Number(process.env.MAX_SCHEMATIC_SIZE);
    if (maxSize > 0 && file.size > maxSize) {
        return `File size exceeds ${maxSize} Bytes limit`;
    }

    // 2. 检查文件扩展名
    const fileName = file.name.toLowerCase();
    if (fileName.length >= 100)
        return 'File name is to long'

    const validExtensions = ['.schematic', '.schem'];
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    if (!hasValidExtension) {
        return 'File extension must be .schematic or .schem';
    }

    // 3. 检查是否为gzip压缩包
    // 通过检查文件的字节信息（魔数）来判断是否为gzip格式
    const bytes = new Uint8Array(await file.arrayBuffer());

    // gzip文件的魔数是0x1f 0x8b
    if (bytes.length < 2 || bytes[0] !== 0x1f || bytes[1] !== 0x8b) {
        return 'File must be in gzip compressed format';
    }

    // 所有验证通过，返回null
    return null;
}

async function getHash(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const hash = crypto.createHash('sha1');
    hash.update(buffer);
    return hash.digest('hex');
}