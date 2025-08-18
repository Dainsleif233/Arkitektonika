import { Repository } from 'typeorm';
import { AppDataSource } from '@/libs/database';
import { Schematic } from '@/entities/Arkitektonika';
import crypto from 'crypto';

export default class {
    private schematicRepository: Repository<Schematic>;

    constructor() {
        this.schematicRepository = AppDataSource.getRepository(Schematic);
    }

    // 根据哈希获取schematic
    async getByHash(sha1: string) {
        return this.schematicRepository.findOne({ where: { sha1, valid: true } });
    }

    // 创建新的schematic记录
    async create(name: string, size: number, sha1: string) {
        const data = new Schematic();
        data.name = name;
        data.size = size;
        data.sha1 = sha1;
        data.delete = crypto.randomUUID();
        data.download = crypto.randomUUID();
        data.timestamp = Math.floor(Date.now() / 1000);
        const schematic = this.schematicRepository.create(data);
        return await this.schematicRepository.save(schematic);
    }
}