import busboy from '@fastify/busboy';
import { Readable } from 'stream';
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
        const fileData = await parseMultipartFormData(request);
        if (!fileData)
            return Response.json({ error: 'Missing file' }, { status: 500 });

        const { file, sha1 } = fileData;
        const err = validateFile(file);
        if (err)
            return Response.json({ error: `Invalid request due to invalid nbt content: ${err}` }, { status: 413 });

        await initializeDatabase();
        const db = new DB();
        const data = await db.getByHash(sha1);
        if (!data) {
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
        return Response.json({ error: 'Failed to parse form data' }, { status: 500 });
    }
}

interface FileWithHash {
    file: File;
    sha1: string;
}

async function parseMultipartFormData(request: Request): Promise<FileWithHash | null> {
    return new Promise((resolve, reject) => {
        const headers: any = {};
        request.headers.forEach((value, key) => {
            headers[key] = value;
        });
        
        const bb = busboy({ headers });
        let fileResult: FileWithHash | null = null;

        bb.on('file', (name, stream, info: any) => {
            if (name === 'schematic') {
                const chunks: Buffer[] = [];
                const hash = crypto.createHash('sha1');
                
                stream.on('data', (chunk) => {
                    chunks.push(chunk);
                    hash.update(chunk);
                });
                
                stream.on('end', () => {
                    const buffer = Buffer.concat(chunks);
                    const sha1 = hash.digest('hex');
                    const filename = info?.filename || 'unknown';
                    const mimeType = info?.mimeType || 'application/octet-stream';
                    const file = new File([buffer], filename, { type: mimeType });
                    fileResult = { file, sha1 };
                });
            } else {
                stream.resume(); // 忽略其他字段
            }
        });

        bb.on('finish', () => {
            resolve(fileResult);
        });

        bb.on('error', (err) => {
            reject(err);
        });

        // 将Request转换为Node.js可读流
        if (request.body) {
            const reader = request.body.getReader();
            const stream = new Readable({
                async read() {
                    const { done, value } = await reader.read();
                    if (done) {
                        this.push(null);
                    } else {
                        this.push(Buffer.from(value));
                    }
                }
            });
            stream.pipe(bb);
        } else {
            reject(new Error('No request body'));
        }
    });
}

function validateFile(file: File) {
    // 1. 检查文件大小是否超过5MB
    const maxSize = Number(process.env.MAX_SCHEMATIC_SIZE ?? 5 * 1024 * 1024); // 5MB in bytes
    if (file.size > maxSize) {
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
    // 通过检查文件的MIME类型或文件头来判断是否为gzip格式
    if (file.type !== 'application/gzip' && file.type !== 'application/x-gzip') {
        return 'File must be in gzip compressed format';
    }

    // 所有验证通过，返回null
    return null;
}
